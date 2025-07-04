import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, FormContainer } from '../components/ui';
import { loginSchema, type LoginFormData } from '../schemas/signupSchemas';
import { signIn } from '../api/auth';
import { supabase } from '../lib/supabase';
import type { Provider } from '@supabase/supabase-js';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // GitHub 콜백에서 전달된 에러 메시지 처리
  useEffect(() => {
    const state = location.state as { error?: string } | null;
    if (state?.error) {
      setLoginError(state.error);
      // location state 정리
      navigate('/', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

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
    setLoginError(null);
    try {
      // Supabase signIn API 호출
      const result = await signIn(data.email, data.password);

      console.log('로그인 성공:', result);
      setLoginSuccess(true);

      // 로그인 성공 시 /home으로 리디렉션
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error('로그인 오류:', error);
      setLoginError(error.message || '로그인 중 오류가 발생했습니다.');
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);
    setLoginError(null);

    try {
      // 1. 먼저 임시 GitHub 인증으로 사용자 정보 가져오기
      const { data: authData, error: authError } =
        await supabase.auth.signInWithOAuth({
          provider: 'github' as Provider,
          options: {
            redirectTo: `${window.location.origin}/auth/github-callback`,
            scopes: 'user:email',
            skipBrowserRedirect: true, // 리디렉션 방지
          },
        });

      if (authError) {
        throw authError;
      }

      // GitHub OAuth URL로 리디렉션 (계정 확인은 콜백에서 처리)
      if (authData?.url) {
        window.location.href = authData.url;
      }
    } catch (error: any) {
      console.error('GitHub 로그인 오류:', error);
      setLoginError(
        `GitHub 로그인 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`
      );
      setIsGitHubLoading(false);
    }
  };

  // const handleFindAccount = (type: 'id' | 'password') => {
  //   // 계정 찾기 시뮬레이션
  //   console.log(`${type === 'id' ? '아이디' : '비밀번호'} 찾기 요청`);
  //   alert(`${type === 'id' ? '아이디' : '비밀번호'} 찾기는 데모용입니다.`);
  // };

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

            {/* 계정 찾기 링크
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
            </div> */}

            {/* 에러 메시지 */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            {/* 성공 메시지 */}
            {loginSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  로그인 성공! 이동 중...
                </p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={isLoading}
              loadingText="로그인 중..."
              className="w-full"
              disabled={loginSuccess}
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

          {/* GitHub 로그인 */}
          <button
            onClick={handleGitHubLogin}
            disabled={isGitHubLoading || loginSuccess}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="/github-mark-white.png"
              alt="GitHub 로고"
              className="w-5 h-5 mr-2"
            />
            {isGitHubLoading ? 'GitHub 로그인 중...' : 'GitHub 계정으로 로그인'}
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
