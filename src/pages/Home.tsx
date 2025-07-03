import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Home: React.FC = () => {
  const testSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('test').select('*').limit(1);
      if (error) {
        // 테이블이 없어도 연결은 성공한 것으로 간주
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
      console.log(`Supabase 연결 실패: ${err}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">회원가입 시스템</h1>
      <div className="text-center">
        <p className="mb-4">3단계 회원가입 시스템에 오신 것을 환영합니다.</p>
        <Link
          to="/signup/step1"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded inline-block mr-4"
        >
          회원가입 시작하기
        </Link>
        <button
          onClick={testSupabaseConnection}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded inline-block"
        >
          Supabase 연결 테스트
        </button>
      </div>
    </div>
  );
};

export default Home;
