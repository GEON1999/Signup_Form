import { Link } from 'react-router-dom';

const SignupStep3: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        회원가입 - 3단계
      </h1>
      <div className="max-w-md mx-auto">
        <p className="text-center mb-4">
          SNS 계정 연결 (선택사항)
        </p>
        {/* SNS 연동 컴포넌트는 추후 해당 브랜치에서 구현 */}
        
        <div className="flex justify-between mt-8">
          <Link 
            to="/signup/step2" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            이전 단계
          </Link>
          <Link 
            to="/" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            가입 완료
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupStep3;
