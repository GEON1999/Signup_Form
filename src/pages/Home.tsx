import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, FormContainer } from '../components/ui';
import { loginSchema, type LoginFormData } from '../schemas/signupSchemas';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // 실제 로그인 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('로그인 데이터:', data);
      alert('로그인 기능은 데모용입니다.');
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 시뮬레이션
    console.log('카카오 로그인 요청');
    alert('카카오 로그인은 데모용입니다.');
  };

  const handleFindAccount = (type: 'id' | 'password') => {
    // 계정 찾기 시뮬레이션
    console.log(`${type === 'id' ? '아이디' : '비밀번호'} 찾기 요청`);
    alert(`${type === 'id' ? '아이디' : '비밀번호'} 찾기는 데모용입니다.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <FormContainer
          title="로그인"
          subtitle="우리의 이야기 시작하기"
          maxWidth="sm"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 로그인 폼 */}
            <div className="space-y-6">
              {/* 이메일/아이디 */}
              <div>
                <Input
                  label="이메일"
                  {...register('email')}
                  type="text"
                  placeholder="이메일을 입력해주세요"
                  autoComplete="username"
                />
                {errors.email?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <Input
                  label="비밀번호"
                  {...register('password')}
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="current-password"
                />
                {errors.password?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* 계정 찾기 링크 */}
            <div className="flex justify-center space-x-4 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => handleFindAccount('id')}
                className="hover:text-gray-900 transition-colors duration-200"
              >
                아이디 찾기
              </button>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={() => handleFindAccount('password')}
                className="hover:text-gray-900 transition-colors duration-200"
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={isLoading}
              loadingText="로그인 중..."
              className="w-full"
            >
              로그인
            </Button>
          </form>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors duration-200"
          >
            <span className="mr-2"></span>
            카카오톡으로 로그인
          </button>

          {/* 회원가입 링크 */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{' '}
              <Link
                to="/signup/step1"
                className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
              >
                회원가입
              </Link>
            </p>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default Home;
