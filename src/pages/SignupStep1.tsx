import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, FormContainer } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';
import { step1Schema, type Step1FormData } from '../schemas/signupSchemas';
import { checkUsernameAvailability, checkEmailAvailability } from '../api/auth';
import { useSignupStore } from '../stores/signupStore';

const SignupStep1: React.FC = () => {
  const navigate = useNavigate();

  // Zustand 스토어에서 데이터 가져오기
  const {
    step1Data,
    setStep1Data,
    setCurrentStep,
    usernameChecked,
    usernameValid,
    emailChecked,
    emailValid,
    setUsernameCheckStatus,
    setEmailCheckStatus,
  } = useSignupStore();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    // 스토어에 저장된 데이터가 있으면 사용, 없으면 빈 값으로 초기화
    defaultValues: step1Data || {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  // 스토어에 저장된 중복 확인 상태 복원
  useEffect(() => {
    const checkSavedData = async () => {
      if (step1Data?.username && !usernameChecked) {
        await handleUsernameCheck();
      }
      if (step1Data?.email && !emailChecked) {
        await handleEmailCheck();
      }
    };

    checkSavedData();
    if (usernameChecked) {
      setUsernameCheck({
        isChecking: false,
        isChecked: usernameChecked,
        isValid: usernameValid,
        message: usernameValid
          ? '중복되지 않은 사용자명입니다'
          : '이미 사용중인 사용자명입니다',
      });
    }

    if (emailChecked) {
      setEmailCheck({
        isChecking: false,
        isChecked: emailChecked,
        isValid: emailValid,
        message: emailValid
          ? '중복되지 않은 이메일입니다'
          : '이미 가입된 이메일입니다',
      });
    }
  }, []);

  // 중복 확인 상태
  const [usernameCheck, setUsernameCheck] = useState<{
    isChecking: boolean;
    isChecked: boolean;
    isValid: boolean;
    message: string;
  }>({ isChecking: false, isChecked: false, isValid: false, message: '' });

  const [emailCheck, setEmailCheck] = useState<{
    isChecking: boolean;
    isChecked: boolean;
    isValid: boolean;
    message: string;
  }>({ isChecking: false, isChecked: false, isValid: false, message: '' });

  // 사용자명 중복 확인
  const handleUsernameCheck = async () => {
    const username = getValues('username');
    if (!username || username.trim().length === 0) {
      setUsernameCheck({
        isChecking: false,
        isChecked: true,
        isValid: false,
        message: '사용자명을 입력해주세요',
      });
      // 스토어 상태 업데이트
      setUsernameCheckStatus(true, false);
      return;
    }

    setUsernameCheck({
      isChecking: true,
      isChecked: false,
      isValid: false,
      message: '',
    });

    try {
      const result = await checkUsernameAvailability(username);
      setUsernameCheck({
        isChecking: false,
        isChecked: true,
        isValid: result.isAvailable,
        message: result.message,
      });
      // 스토어 상태 업데이트
      setUsernameCheckStatus(true, result.isAvailable);
    } catch (error) {
      setUsernameCheck({
        isChecking: false,
        isChecked: true,
        isValid: false,
        message: '중복 확인 중 오류가 발생했습니다',
      });
      // 스토어 상태 업데이트
      setUsernameCheckStatus(true, false);
    }
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const email = getValues('email');
    if (!email || email.trim().length === 0) {
      setEmailCheck({
        isChecking: false,
        isChecked: true,
        isValid: false,
        message: '이메일을 입력해주세요',
      });
      // 스토어 상태 업데이트
      setEmailCheckStatus(true, false);
      return;
    }

    setEmailCheck({
      isChecking: true,
      isChecked: false,
      isValid: false,
      message: '',
    });

    try {
      const result = await checkEmailAvailability(email);
      setEmailCheck({
        isChecking: false,
        isChecked: true,
        isValid: result.isAvailable,
        message: result.message,
      });
      // 스토어 상태 업데이트
      setEmailCheckStatus(true, result.isAvailable);
    } catch (error) {
      setEmailCheck({
        isChecking: false,
        isChecked: true,
        isValid: false,
        message: '중복 확인 중 오류가 발생했습니다',
      });
      // 스토어 상태 업데이트
      setEmailCheckStatus(true, false);
    }
  };

  const steps = [
    {
      number: 1,
      title: '기본 정보',
      description: '아이디, 이메일, 비밀번호',
    },
    {
      number: 2,
      title: '개인 정보',
      description: '생년월일, 성별, 프로필',
    },
    {
      number: 3,
      title: 'SNS 연동',
      description: '소셜 계정 연결 (선택)',
    },
  ];

  const onSubmit = async (data: Step1FormData) => {
    try {
      // 아이디와 이메일 중복확인이 완료되었는지 확인
      if (!usernameCheck.isChecked || !usernameCheck.isValid) {
        alert('아이디 중복 확인을 완료해주세요.');
        return;
      }

      if (!emailCheck.isChecked || !emailCheck.isValid) {
        alert('이메일 중복 확인을 완료해주세요.');
        return;
      }

      // 데이터 보존 - Zustand 스토어에 저장
      setStep1Data(data);
      setCurrentStep(2);

      console.log('1단계 데이터가 저장되었습니다:', data);

      // 다음 단계로 이동
      navigate('/signup/step2');
    } catch (error) {
      console.error('1단계 폼 제출 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 진행 상태 표시 */}
        <ProgressIndicator currentStep={1} steps={steps} className="mb-8" />

        <FormContainer
          title="기본 정보 입력"
          subtitle="회원가입을 위한 기본 정보를 입력해주세요"
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* 아이디 */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  아이디
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-grow">
                    <Input
                      id="username"
                      {...register('username')}
                      type="text"
                      placeholder="아이디를 입력해주세요"
                      autoComplete="username"
                      error={errors.username?.message}
                      helperText={
                        usernameCheck.isChecked ? (
                          <span
                            className={
                              usernameCheck.isValid
                                ? 'text-green-600'
                                : 'text-red-500'
                            }
                          >
                            {usernameCheck.message}
                          </span>
                        ) : undefined
                      }
                    />
                  </div>
                  <div className="pt-[6px] flex-shrink-0">
                    <Button
                      type="button"
                      onClick={handleUsernameCheck}
                      disabled={usernameCheck.isChecking}
                      className="px-3 py-[9px] text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded whitespace-nowrap"
                      size="sm"
                    >
                      {usernameCheck.isChecking ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-1"></div>
                          확인중
                        </div>
                      ) : (
                        '중복확인'
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  이메일
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-grow">
                    <Input
                      id="email"
                      {...register('email')}
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      error={errors.email?.message}
                      helperText={
                        emailCheck.isChecked ? (
                          <span
                            className={
                              emailCheck.isValid
                                ? 'text-green-600'
                                : 'text-red-500'
                            }
                          >
                            {emailCheck.message}
                          </span>
                        ) : undefined
                      }
                    />
                  </div>
                  <div className="pt-[6px] flex-shrink-0">
                    <Button
                      type="button"
                      onClick={handleEmailCheck}
                      disabled={emailCheck.isChecking}
                      className="px-3 py-[9px] text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded whitespace-nowrap"
                      size="sm"
                    >
                      {emailCheck.isChecking ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-1"></div>
                          확인중
                        </div>
                      ) : (
                        '중복확인'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 비밀번호 */}
              <div>
                <Input
                  label="비밀번호"
                  {...register('password')}
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="new-password"
                  error={errors.password?.message}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <Input
                  label="비밀번호 확인"
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="비밀번호를 확인해 주세요"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <Input
                label="전화번호"
                {...register('phone')}
                type="tel"
                placeholder="01012345678"
                autoComplete="tel"
                error={errors.phone?.message}
              />
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 border-transparent"
              >
                홈으로 돌아가기
              </Link>

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting}
                className="sm:min-w-[120px]"
              >
                {isSubmitting ? '처리 중...' : '다음 단계'}
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupStep1;
