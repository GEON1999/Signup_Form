import { Link } from 'react-router-dom';

const SignupStep1: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        회원가입 - 1단계
      </h1>
      <div className="max-w-md mx-auto">
        <p className="text-center mb-4">
          아이디, 비밀번호, 이메일, 전화번호 입력
        </p>
        {/* 폼 컴포넌트는 추후 해당 브랜치에서 구현 */}
        
        <div className="flex justify-between mt-8">
          <Link 
            to="/" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            홈으로
          </Link>
          <Link 
            to="/signup/step2" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            다음 단계
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupStep1;
