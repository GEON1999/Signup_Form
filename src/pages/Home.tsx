import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">회원가입 시스템</h1>
      <div className="text-center">
        <p className="mb-4">3단계 회원가입 시스템에 오신 것을 환영합니다.</p>
        <Link 
          to="/signup/step1" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded inline-block"
        >
          회원가입 시작하기
        </Link>
      </div>
    </div>
  );
};

export default Home;
