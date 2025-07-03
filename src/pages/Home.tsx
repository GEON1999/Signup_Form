import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthTest from '../components/AuthTest';

const Home: React.FC = () => {
  const [showAuthTest, setShowAuthTest] = useState(false);

  const testSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('test').select('*').limit(1);
      if (error) {
        if (
          error.message.includes('does not exist') &&
          (error.message.includes('test') ||
            error.message.includes('public.test'))
        ) {
          console.log('Supabase 연결 성공');
        } else {
          console.log(`Supabase 연결 실패: ${error.message}`);
        }
      } else {
        console.log('Supabase 연결 및 테이블 접근 성공');
      }
    } catch (err) {
      console.log(`Supabase 연결 오류: ${err}`);
    }
  };

  if (showAuthTest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <button
            onClick={() => setShowAuthTest(false)}
            className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            ← 홈으로 돌아가기
          </button>
          <AuthTest />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          회원가입 시스템
        </h1>
        
        <div className="space-y-4">
          <Link
            to="/signup/step1"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 text-center block"
          >
            회원가입 시작하기
          </Link>
          
          <button
            onClick={testSupabaseConnection}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Supabase 연결 테스트
          </button>
          
          <button
            onClick={() => setShowAuthTest(true)}
            className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition duration-200"
          >
            인증 스토어 테스트
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
