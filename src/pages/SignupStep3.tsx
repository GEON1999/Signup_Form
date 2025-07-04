import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormContainer, ErrorMessage } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';
import { useSignupStore } from '../stores/signupStore';
import { signUp } from '../api/auth';
import { supabase } from '../lib/supabase';
import type { SignupData } from '../types/auth';

interface FormErrors {
  general?: string;
  github?: string;
}

const SignupStep3: React.FC = () => {
  const navigate = useNavigate();
  const [hasGitHubConnection, setHasGitHubConnection] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Zustand 스토어에서 데이터 가져오기
  const {
    step1Data,
    step2Data,
    usernameChecked,
    usernameValid,
    emailChecked,
    emailValid,
    resetAllData
  } = useSignupStore();

  const steps = [
    {
      number: 1,
      title: '기본 정보',
      description: '로그인 정보 입력',
    },
    {
      number: 2,
      title: '개인 정보',
      description: '프로필 완성',
    },
    {
      number: 3,
      title: 'GitHub 연동',
      description: 'GitHub 계정 연결 (선택)',
    },
  ];

  // step1과 step2 완료 상태 확인 및 접근 제어
  useEffect(() => {
    // 회원가입 완료 진행 중일 때는 검증을 건너뜀
    if (isCompleting) {
      return;
    }

    const isStep1Complete = step1Data && 
      usernameChecked && usernameValid && 
      emailChecked && emailValid;
    
    const isStep2Complete = step2Data && 
      step2Data.birthDate && 
      step2Data.gender;
    
    if (!isStep1Complete) {
      console.log('Step1이 완료되지 않았습니다. Step1으로 리디렉션합니다.');
      navigate('/signup/step1', { replace: true });
      return;
    }
    
    if (!isStep2Complete) {
      console.log('Step2가 완료되지 않았습니다. Step2로 리디렉션합니다.');
      navigate('/signup/step2', { replace: true });
      return;
    }
  }, [step1Data, step2Data, usernameChecked, usernameValid, emailChecked, emailValid, navigate, isCompleting]);

  // GitHub 연동 관련 상수들은 UI에서 직접 사용

  const handleGitHubConnect = async () => {
    setConnectingGithub(true);
    setErrors({});

    try {
      // GitHub OAuth 로그인으로 리다이렉트
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/signup/step3?github=connected`,
          scopes: 'user:email',
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('GitHub 연동 오류:', error);
      setErrors({
        github: `GitHub 연동 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      });
      setConnectingGithub(false);
    }
  };



  // GitHub 연동 시 GitHub 이메일 추출 함수
  const getCurrentGitHubEmail = (): string | undefined => {
    // URL 파라미터에서 GitHub 연돐 상태 확인
    if (window.location.search.includes('github=connected')) {
      // 실제 구현에서는 Supabase session에서 GitHub 이메일을 추출
      // 여기서는 임시로 step1의 이메일을 사용
      return step1Data?.email;
    }
    return undefined;
  };

  // GitHub OAuth 상태 감지 (linkIdentity 방식)
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // GitHub identity가 있는지 확인
        const hasGitHub = session?.user?.identities?.some(
          (identity) => identity.provider === 'github'
        );
        setHasGitHubConnection(!!hasGitHub);

        if (hasGitHub) {
          console.log('GitHub 연동 감지:', session?.user?.email);
        }
      } catch (error) {
        console.error('GitHub 세션 확인 오류:', error);
      }
    };

    checkAuthState();

    // Auth 상태 변경 감지 (linkIdentity 방식)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const hasGitHub = session?.user?.identities?.some(
          (identity) => identity.provider === 'github'
        );
        setHasGitHubConnection(!!hasGitHub);

        // URL에 link=success 파라미터가 있으면 linkIdentity 성공
        if (hasGitHub && window.location.search.includes('link=success')) {
          console.log(
            'GitHub linkIdentity 성공! 동일 계정에 GitHub identity 연결됨'
          );

          // URL 파라미터 제거
          window.history.replaceState({}, '', window.location.pathname);

          // 연동 완료 후 홈으로 이동
          setTimeout(() => {
            navigate('/', { replace: true });
            // 네비게이션 완료 후 성공 메시지와 데이터 리셋
            setTimeout(() => {
              alert(
                '회원가입 및 GitHub 연동이 성공적으로 완료되었습니다!\n\n이제 동일한 계정으로 이메일/비밀번호 또는 GitHub 로그인 모두 가능합니다.'
              );
              resetAllData();
            }, 500);
          }, 1500);
        }
      } else if (event === 'SIGNED_OUT') {
        setHasGitHubConnection(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);
    setIsCompleting(true);
    setErrors({});

    if (!step1Data || !step2Data) {
      setErrors({
        general: '회원가입 정보가 누락되었습니다. 처음부터 다시 시도해주세요.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // 현재 인증된 세션 확인 (linkIdentity 방식)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authUser = session?.user;

      // GitHub OAuth로 인증된 사용자인지 확인
      const hasGitHubIdentity = authUser?.identities?.some(
        (identity) => identity.provider === 'github'
      );

      console.log('Auth 상태:', {
        hasAuthUser: !!authUser,
        hasGitHubIdentity,
        userEmail: authUser?.email,
      });

      // GitHub OAuth로 인증된 사용자인 경우 linkIdentity 방식으로 처리
      if (hasGitHubIdentity && authUser) {
        console.log(
          '이미 GitHub로 인증되어 있습니다. 사용자 정보를 업데이트합니다.'
        );

        // 먼저 동일 이메일을 가진 사용자가 있는지 확인
        const email = authUser.email || step1Data.email;
        const { data: existingUser, error: findError } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (findError) {
          console.error('사용자 조회 오류:', findError);
          throw findError;
        }

        let userId = authUser.id;

        if (existingUser) {
          console.log(
            '기존 사용자 정보 발견. 해당 사용자를 업데이트합니다:',
            existingUser.id
          );
          userId = existingUser.id;

          // 기존 사용자 업데이트
          const { error: updateError } = await supabase
            .from('users')
            .update({
              username: step1Data.username,
              email_verified: true, // GitHub 연동은 이메일 인증 처리
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (updateError) {
            console.error('사용자 업데이트 오류:', updateError);
            throw updateError;
          }
        } else {
          console.log('새 사용자를 생성합니다:', userId);
          // 새 사용자 생성
          const { error: insertError } = await supabase.from('users').insert({
            id: userId,
            username: step1Data.username,
            email: email,
            email_verified: true, // GitHub 연동은 이메일 인증 처리
            phone: '',
            phone_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error('새 사용자 생성 오류:', insertError);
            throw insertError;
          }
        }

        // profiles 테이블에 step2에서 입력한 정보 저장
        // 먼저 해당 user_id로 업데이트 대상 프로필이 있는지 확인
        const { data: existingProfile, error: profileFindError } =
          await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (profileFindError) {
          console.error('프로필 조회 오류:', profileFindError);
          throw profileFindError;
        }

        if (existingProfile) {
          // 프로필 업데이트
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({
              birth_date: step2Data.birthDate,
              gender: step2Data.gender,
              profile_image_url: step2Data.profileImageUrl || '',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (updateProfileError) {
            console.error('프로필 업데이트 오류:', updateProfileError);
            throw updateProfileError;
          }
        } else {
          // 새 프로필 생성
          const { error: insertProfileError } = await supabase
            .from('profiles')
            .insert({
              user_id: userId,
              birth_date: step2Data.birthDate,
              gender: step2Data.gender,
              profile_image_url: step2Data.profileImageUrl || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (insertProfileError) {
            console.error('프로필 생성 오류:', insertProfileError);
            throw insertProfileError;
          }
        }

        // GitHub 연동 시 social_id 업데이트
        const githubEmail = getCurrentGitHubEmail();
        if (githubEmail) {
          const { error: socialIdError } = await supabase
            .from('users')
            .update({ social_id: githubEmail })
            .eq('id', userId);

          if (socialIdError) {
            console.error('social_id 업데이트 오류:', socialIdError);
            throw socialIdError;
          }
          console.log('GitHub 연동 완료 - social_id 업데이트됨');
        }

        console.log('GitHub 연동 사용자 정보 업데이트 완료');
      }

      // GitHub 연동 여부와 관계없이 항상 signUp 호출 (이메일/비밀번호 로컬 로그인 지원)
      const signupData: SignupData = {
        username: step1Data.username,
        email: step1Data.email,
        password: step1Data.password,
        phone: step1Data.phone,
        birthDate: step2Data.birthDate,
        gender: step2Data.gender,
        profileImageUrl: step2Data.profileImageUrl || '',
        // GitHub 연동 시 social_id 설정, 없으면 undefined
        socialId: hasGitHubConnection ? getCurrentGitHubEmail() : undefined,
      };

      const result = await signUp(signupData);
      console.log('회원가입 성공 (로컬 로그인 지원 + GitHub 연동):', result);

      // 회원가입 완료 후 홈으로 이동 (먼저 이동)
      navigate('/', { replace: true });
      
      // 네비게이션 완료 후 성공 메시지와 데이터 리셋
      setTimeout(() => {
        alert('회원가입이 성공적으로 완료되었습니다!');
        resetAllData();
      }, 500);
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      setErrors({
        general: `회원가입 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      });
    } finally {
      setIsLoading(false);
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 진행 상태 표시 */}
        <ProgressIndicator currentStep={3} steps={steps} className="mb-8" />

        <FormContainer
          title="SNS 계정 연동"
          subtitle="소셜 계정을 연동하여 더 편리하게 이용해보세요 (선택사항)"
          maxWidth="lg"
        >
          {errors.general && (
            <ErrorMessage
              message={errors.general}
              variant="banner"
              dismissible
              onDismiss={() => setErrors({ general: undefined })}
            />
          )}
          {/* GitHub 계정 연동 옵션 */}
          <div className="space-y-4">
            <div
              className={`border rounded-lg p-4 transition-colors duration-200 ${
                hasGitHubConnection
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/github-mark.png"
                    alt="GitHub"
                    className="w-8 h-8"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">GitHub</h4>
                    {hasGitHubConnection ? (
                      <div className="text-sm text-gray-600">
                        <p className="text-green-600 font-medium">
                          ✓ GitHub 계정이 연동되었습니다
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        GitHub 계정으로 로그인 및 데이터 동기화
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <button
                    onClick={handleGitHubConnect}
                    disabled={connectingGithub || isLoading}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectingGithub ? '연동 중...' : '연동'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  SNS 계정 연동 안내
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>SNS 계정 연동은 선택사항입니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8">
            <Link
              to="/signup/step2"
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 border-transparent"
            >
              이전 단계
            </Link>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleComplete}
                loading={isLoading}
                loadingText="완료 중..."
                className="sm:min-w-[120px]"
              >
                회원가입 완료
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupStep3;
