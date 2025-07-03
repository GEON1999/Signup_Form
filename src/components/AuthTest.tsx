import React from 'react';
import { useAuthStore } from '../stores/authStore';
import type { SignupData } from '../types/auth';

const AuthTest: React.FC = () => {
  const { isAuthenticated, isLoading, error, login, signup, logout } =
    useAuthStore();

  // 로그인 테스트
  const testLogin = async () => {
    try {
      await login('test@example.com', 'password123');
    } catch (error: any) {
      console.error('로그인 실패:', error.message);
    }
  };

  // 회원가입 테스트
  const testSignup = async () => {
    try {
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        phone: '010-1234-5678',
        birth_date: '2000-01-01',
        gender: 'prefer_not_to_say',
        profile_image_url: '',
      };

      console.log('회원가입 정보:', testUser);
      await signup(testUser as SignupData);
      console.log('회원가입 성공');
    } catch (error: any) {
      console.error('회원가입 실패:', error.message);
    }
  };

  // 로그아웃 테스트
  const testLogout = async () => {
    try {
      await logout();
      console.log('로그아웃 성공');
    } catch (error: any) {
      console.error('로그아웃 실패:', error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">인증 테스트</h1>

      <div className="bg-gray-100 p-3 rounded text-sm">
        <p>인증 상태: {isAuthenticated ? '인증됨' : '미인증'}</p>
        <p>로딩 상태: {isLoading ? '로딩 중' : '완료'}</p>
        {error && <p className="text-red-500">에러: {error}</p>}
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={testSignup}
          disabled={isLoading}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          회원가입 테스트
        </button>

        <button
          onClick={testLogin}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          로그인 테스트
        </button>

        <button
          onClick={testLogout}
          disabled={isLoading || !isAuthenticated}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          로그아웃 테스트
        </button>
      </div>
    </div>
  );
};

export default AuthTest;
