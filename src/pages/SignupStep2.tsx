import { Link } from 'react-router-dom';

const SignupStep2: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        회원가입 - 2단계
      </h1>
      <div className="max-w-md mx-auto">
        <p className="text-center mb-4">
          생년월일, 성별, 프로필 사진 업로드
        </p>
        {/* 폼 컴포넌트는 추후 해당 브랜치에서 구현 */}
        
        <div className="flex justify-between mt-8">
          <Link 
            to="/signup/step1" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            이전 단계
          </Link>
          <Link 
            to="/signup/step3" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            다음 단계
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupStep2;
