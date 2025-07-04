import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormContainer, ErrorMessage } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';

interface SnsAccount {
  provider: 'kakao';
  connected: boolean;
  email?: string;
  name?: string;
}

interface FormErrors {
  general?: string;
}

const SignupStep3: React.FC = () => {
  const navigate = useNavigate();
  const [snsAccounts, setSnsAccounts] = useState<SnsAccount[]>([
    { provider: 'kakao', connected: false },
  ]);
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

  const snsProviderInfo = {
    kakao: {
      name: 'Kakao',
      icon: '🔴',
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      buttonColor: 'bg-red-500 hover:bg-red-600',
    },
  };

  const handleSnsConnect = async (provider: SnsAccount['provider']) => {
    setIsLoading(true);
    setErrors({});

    try {
      // 연동된 것으로 가정
      setSnsAccounts((prev) =>
        prev.map((account) =>
          account.provider === provider
            ? {
                ...account,
                connected: true,
                email: `user@${provider}.com`,
                name: `${snsProviderInfo[provider].name} User`,
              }
            : account
        )
      );
    } catch (error) {
      setErrors({
        general: `${snsProviderInfo[provider].name} 연동에 실패했습니다. 다시 시도해주세요.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnsDisconnect = (provider: SnsAccount['provider']) => {
    setSnsAccounts((prev) =>
      prev.map((account) =>
        account.provider === provider
          ? { ...account, connected: false, email: undefined, name: undefined }
          : account
      )
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // 전체 회원가입 데이터 취합
      const step1Data = JSON.parse(
        localStorage.getItem('signupStep1Data') || '{}'
      );
      const step2Data = JSON.parse(
        localStorage.getItem('signupStep2Data') || '{}'
      );
      const connectedSns = snsAccounts.filter((account) => account.connected);

      const completeSignupData = {
        ...step1Data,
        ...step2Data,
        snsAccounts: connectedSns,
        completedAt: new Date().toISOString(),
      };

      console.log('회원가입 완료 데이터:', completeSignupData);

      localStorage.removeItem('signupStep1Data');
      localStorage.removeItem('signupStep2Data');
      localStorage.setItem('signupCompleted', 'true');

      // 회원가입 완료 후 홈으로 이동
      navigate('/', { replace: true });

      // 성공 메시지
      alert('회원가입이 성공적으로 완료되었습니다! 환영합니다.');
    } catch (error) {
      setErrors({
        general: '함원가입 완료 중 오류가 발생했습니다. 다시 시도해주세요.',
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
                          disabled={isLoading}
                          className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${providerInfo.buttonColor}`}
                        >
                          {isLoading ? '연동 중...' : '연동'}
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
