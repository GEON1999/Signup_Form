import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, Profile, SignupData } from '../types/auth';
import { signIn, signUp, signOut } from '../api/auth';

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

          // API 클라이언트 함수를 사용한 로그인
          const { user, profile } = await signIn(email, password);

          set({
            user,
            profile,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
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

          // API 클라이언트 함수를 사용한 회원가입
          const { user, profile } = await signUp(userData);

          set({
            user,
            profile,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
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
          set({ isLoading: true, error: null });

          // API 클라이언트 함수를 사용한 로그아웃
          await signOut();

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
          throw error;
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
