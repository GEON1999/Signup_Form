import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, FormContainer } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';
import { step1Schema, type Step1FormData } from '../schemas/signupSchemas';

const SignupStep1: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

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
      // TODO: 실시간 중복 확인 로직 추가 예정
      // TODO: 데이터 보존 로직 추가 예정
      console.log('1단계 데이터:', data);
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 아이디 */}
              <div>
                <Input
                  label="아이디"
                  {...register("username")}
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  autoComplete="username"
                  error={errors.username?.message}
                />
              </div>

              {/* 이메일 */}
              <div>
                <Input
                  label="이메일"
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 비밀번호 */}
              <div>
                <Input
                  label="비밀번호"
                  {...register("password")}
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
                  {...register("confirmPassword")}
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
                {...register("phone")}
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
                {isSubmitting ? "처리 중..." : "다음 단계"}
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupStep1;
