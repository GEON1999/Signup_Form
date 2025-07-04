import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormContainer, ErrorMessage } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';
import { useSignupStore } from '../stores/signupStore';
import { signUp } from '../api/auth';
import { supabase } from '../lib/supabase';
import type { SignupData } from '../types/auth';
import type { Provider } from '@supabase/supabase-js';

interface SnsAccount {
  provider: 'github';
  connected: boolean;
  email?: string;
  name?: string;
  provider_id?: string;
}

interface FormErrors {
  general?: string;
  github?: string;
}

const SignupStep3: React.FC = () => {
  const navigate = useNavigate();
  const [snsAccounts, setSnsAccounts] = useState<SnsAccount[]>([
    { provider: 'github', connected: false },
  ]);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      title: 'SNS 연동',
      description: '소셜 계정 연결 (선택)',
    },
  ];

  const snsProviderInfo: Record<
    SnsAccount['provider'],
    { name: string; buttonColor: string; icon: React.ReactNode; color: string }
  > = {
    github: {
      name: 'GitHub',
      buttonColor: 'bg-gray-800 hover:bg-gray-900',
      icon: (
        <img className="w-8 h-8" src="/github-mark.png" alt="GitHub 로고" />
      ),
      color: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
    },
  };

  const handleSnsConnect = async (provider: SnsAccount['provider']) => {
    if (provider === 'github') {
      setConnectingGithub(true);
      setErrors({});

      try {
        // Supabase GitHub OAuth 로그인
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github' as Provider,
          options: {
            redirectTo: `${window.location.origin}/signup/step3`,
            scopes: 'user:email',
          },
        });

        if (error) {
          throw error;
        }

        // 로그인 성공 시 팝업이 열리므로 여기서는 상태를 변경하지 않음
        // GitHub 인증은 리디렉션으로 처리되며, 복귀 시 useEffect에서 처리함
      } catch (error: any) {
        console.error('GitHub 연동 오류:', error);
        setErrors({
          github: `GitHub 연동 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
        });
      } finally {
        setConnectingGithub(false);
      }
    }
  };

  const handleSnsDisconnect = async (provider: SnsAccount['provider']) => {
    try {
      // Supabase 세션 종료
      await supabase.auth.signOut();

      // 연동 상태 해제
      setSnsAccounts((prev) =>
        prev.map((account) =>
          account.provider === provider
            ? {
                ...account,
                connected: false,
                email: undefined,
                name: undefined,
                provider_id: undefined,
              }
            : account
        )
      );
    } catch (error) {
      console.error('GitHub 연동 해제 오류:', error);
    }
  };

  // Zustand 스토어에서 데이터 가져오기 - 개별 선택자로 분리하여 무한 루프 방지
  const step1Data = useSignupStore((state) => state.step1Data);
  const step2Data = useSignupStore((state) => state.step2Data);
  const resetAllData = useSignupStore((state) => state.resetAllData);

  // GitHub OAuth 콜백 처리
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // 세션이 있고 GitHub로 로그인한 경우
        if (session?.user && session.user.app_metadata?.provider === 'github') {
          console.log('GitHub 사용자 세션 감지:', session.user);

          // 연동 상태 업데이트
          setSnsAccounts((prev) =>
            prev.map((account) =>
              account.provider === 'github'
                ? {
                    ...account,
                    connected: true,
                    email: session.user.email || undefined,
                    name:
                      session.user.user_metadata?.name ||
                      session.user.user_metadata?.user_name ||
                      'GitHub 사용자',
                    provider_id: session.user.id,
                  }
                : account
            )
          );
        }
      } catch (error) {
        console.error('GitHub 세션 확인 오류:', error);
      }
    };

    checkAuthState();

    // Auth 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === 'SIGNED_IN' &&
        session?.user?.app_metadata?.provider === 'github'
      ) {
        setSnsAccounts((prev) =>
          prev.map((account) =>
            account.provider === 'github'
              ? {
                  ...account,
                  connected: true,
                  email: session.user.email || undefined,
                  name:
                    session.user.user_metadata?.name ||
                    session.user.user_metadata?.user_name ||
                    'GitHub 사용자',
                  provider_id: session.user.id,
                }
              : account
          )
        );
      } else if (event === 'SIGNED_OUT') {
        setSnsAccounts((prev) =>
          prev.map((account) =>
            account.provider === 'github'
              ? {
                  ...account,
                  connected: false,
                  email: undefined,
                  name: undefined,
                  provider_id: undefined,
                }
              : account
          )
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);
    setErrors({});

    if (!step1Data || !step2Data) {
      setErrors({
        general: '회원가입 정보가 누락되었습니다. 처음부터 다시 시도해주세요.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // GitHub 연동 정보 확인
      const connectedGithub = snsAccounts.find(
        (account) => account.provider === 'github' && account.connected
      );

      // 디버깅용 GitHub 연동 정보 출력
      if (connectedGithub) {
        console.log('GitHub 연동 정보:', {
          provider: connectedGithub.provider,
          name: connectedGithub.name,
          email: connectedGithub.email,
          provider_id: connectedGithub.provider_id,
        });
      }

      // SignupData 인터페이스에 맞게 데이터 구성
      const signupData: SignupData = {
        username: step1Data.username,
        email: step1Data.email,
        password: step1Data.password,
        birth_date: step2Data.birthDate,
        gender: step2Data.gender,
        profile_image_url: step2Data.profileImageUrl || '',
        // GitHub 연동 정보가 있는 경우 추가
        github_account: connectedGithub
          ? {
              provider_id: connectedGithub.provider_id || '',
              provider_email: connectedGithub.email,
              provider_name: connectedGithub.name,
            }
          : undefined,
      };

      console.log('회원가입 요청 데이터:', signupData);

      // Supabase API를 통한 실제 회원가입 요청
      const result = await signUp(signupData);

      console.log('회원가입 결과:', result);

      // GitHub 연동 상태가 있었다면 로그아웃 처리
      if (snsAccounts.some((acc) => acc.connected)) {
        await supabase.auth.signOut();
      }

      // 회원가입 데이터 초기화
      resetAllData();

      // 회원가입 완료 후 홈으로 이동
      navigate('/', { replace: true });

      // 성공 메시지
      alert('회원가입이 성공적으로 완료되었습니다! 환영합니다.');
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      setErrors({
        general: `회원가입 완료 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      });
    } finally {
      setIsLoading(false);
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
          {/* SNS 계정 연동 옵션 */}
          <div className="space-y-4">
            {snsAccounts.map((account) => {
              const providerInfo = snsProviderInfo[account.provider];

              return (
                <div
                  key={account.provider}
                  className={`border rounded-lg p-4 transition-colors duration-200 ${
                    account.connected
                      ? 'border-green-200 bg-green-50'
                      : `border-gray-200 ${providerInfo.color}`
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{providerInfo.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {providerInfo.name}
                        </h4>
                        {account.connected ? (
                          <div className="text-sm text-gray-600">
                            <p>{account.email}</p>
                            <p className="text-green-600 font-medium">
                              ✓ 연동됨
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {providerInfo.name} 계정으로 로그인 및 데이터 동기화
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      {account.connected ? (
                        <button
                          onClick={() => handleSnsDisconnect(account.provider)}
                          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          연동 해제
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSnsConnect(account.provider)}
                          disabled={connectingGithub || isLoading}
                          className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${providerInfo.buttonColor}`}
                        >
                          {connectingGithub ? '연동 중...' : '연동'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
