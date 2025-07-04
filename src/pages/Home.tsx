import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, FormContainer } from '../components/ui';

interface LoginData {
  email: string;
  password: string;
}

const Home: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // 실제 로그인 API 호출 대신 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('로그인 데이터:', loginData);
    alert('로그인 기능은 데모용입니다.');
    setIsLoading(false);
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
          {/* 로그인 폼 */}
          <div className="space-y-6">
            {/* 이메일/아이디 */}
            <Input
              label="이메일"
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={loginData.email}
              onChange={handleInputChange}
              autoComplete="username"
            />

            {/* 비밀번호 */}
            <Input
              label="비밀번호"
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={loginData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
            />
          </div>

          {/* 계정 찾기 링크 */}
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <button
              onClick={() => handleFindAccount('id')}
              className="hover:text-gray-900 transition-colors duration-200"
            >
              아이디 찾기
            </button>
            <span className="text-gray-400">|</span>
            <button
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
            onClick={handleLogin}
            loading={isLoading}
            loadingText="로그인 중..."
            className="w-full"
          >
            로그인
          </Button>

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
