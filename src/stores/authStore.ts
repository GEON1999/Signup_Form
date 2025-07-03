import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { AuthState, User, Profile, SignupData } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인 액션
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          // Supabase Auth를 사용한 로그인
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            // 사용자 정보 조회
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();
            // 사용자 정보가 없으면 기본 정보 생성
            let user;
            if (userError) {
              console.error('사용자 정보 조회 오류:', userError);
              throw userError;
            } else if (!userData) {
              // 사용자 정보가 없으면 기본 정보 생성
              user = {
                id: data.user.id,
                username: data.user.email?.split('@')[0] || '',
                email: data.user.email || '',
                phone: '',
                email_verified: data.user.email_confirmed_at ? true : false,
                phone_verified: false,
                created_at: data.user.created_at,
                updated_at: data.user.updated_at || data.user.created_at,
              };
            } else {
              user = userData;
            }

            // 프로필 정보 조회
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .maybeSingle();

            // 프로필이 없어도 에러로 처리하지 않음 (선택적)
            const profile = profileError ? null : profileData;

            set({
              user,
              profile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || '로그인에 실패했습니다.',
          });
          throw error;
        }
      },

      // 회원가입 액션
      signup: async (userData: SignupData) => {
        try {
          set({ isLoading: true, error: null });

          // Supabase Auth를 사용한 회원가입
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                username: userData.username,
                phone: userData.phone,
                birth_date: userData.birth_date,
                gender: userData.gender,
                profile_image_url: userData.profile_image_url,
              },
            },
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            // 이메일 확인이 필요한 경우 처리
            if (!data.session) {
              // 이메일 확인이 필요하지만 기본 사용자 정보는 제공
              const basicUser = {
                id: data.user.id,
                username: userData.username,
                email: userData.email,
                phone: userData.phone || '',
                email_verified: false,
                phone_verified: false,
                created_at: data.user.created_at,
                updated_at: data.user.updated_at || data.user.created_at,
              };

              set({
                user: basicUser,
                profile: null,
                isAuthenticated: true, // 인증은 되었지만 이메일 확인은 필요
                isLoading: false,
                error:
                  '회원가입이 완료되었지만 이메일 확인이 필요합니다. 이메일을 확인해주세요.',
              });
              return;
            }

            // 세션이 있으면 로그인 처리와 동일하게 사용자 정보 조회
            try {
              // Users 테이블에서 사용자 정보 조회 (트리거로 생성되었을 수 있음)
              const { data: existingUser, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

              // 사용자 정보가 없으면 생성 시도
              let user = existingUser;
              if (userError && userError.code === 'PGRST116') {
                // 사용자 정보가 없으면 생성
                const { data: newUser, error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: data.user.id,
                    username: userData.username,
                    email: userData.email,
                    phone: userData.phone,
                    password_hash: '', // Supabase Auth가 처리
                  })
                  .select()
                  .single();

                if (insertError) {
                  throw insertError;
                }
                user = newUser;
              } else if (userError) {
                throw userError;
              }

              // 프로필 정보 조회 또는 생성
              let profile = null;
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', data.user.id)
                .single();

              if (profileError && profileError.code === 'PGRST116') {
                // 프로필이 없고 프로필 정보가 있으면 생성
                if (
                  userData.birth_date ||
                  userData.gender ||
                  userData.profile_image_url
                ) {
                  const { data: newProfile, error: insertProfileError } =
                    await supabase
                      .from('profiles')
                      .insert({
                        user_id: data.user.id,
                        birth_date: userData.birth_date,
                        gender: userData.gender,
                        profile_image_url: userData.profile_image_url,
                      })
                      .select()
                      .single();

                  if (!insertProfileError) {
                    profile = newProfile;
                  }
                }
              } else if (!profileError) {
                profile = profileData;
              }

              set({
                user,
                profile,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (dbError: any) {
              // 데이터베이스 에러가 발생해도 Auth는 성공했으므로 기본 정보만 저장
              console.warn(
                '데이터베이스 저장 실패, 기본 Auth 정보만 사용:',
                dbError
              );

              const basicUser = {
                id: data.user.id,
                username:
                  userData.username || data.user.email?.split('@')[0] || '',
                email: data.user.email || userData.email,
                phone: userData.phone || '',
                email_verified: data.user.email_confirmed_at ? true : false,
                phone_verified: false,
                created_at: data.user.created_at,
                updated_at: data.user.updated_at || data.user.created_at,
              };

              set({
                user: basicUser,
                profile: null,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            }
          }
        } catch (error: any) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || '회원가입에 실패했습니다.',
          });
          throw error;
        }
      },

      // 로그아웃 액션
      logout: async () => {
        try {
          set({ isLoading: true });

          // Supabase Auth 로그아웃
          const { error } = await supabase.auth.signOut();

          if (error) {
            throw error;
          }

          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '로그아웃에 실패했습니다.',
          });
        }
      },

      // 사용자 정보 설정
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // 프로필 정보 설정
      setProfile: (profile: Profile) => {
        set({ profile });
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 에러 설정
      setError: (error: string | null) => {
        set({ error });
      },

      // 에러 초기화
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }), // 지속할 상태만 선택
    }
  )
);
