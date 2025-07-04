import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, FormContainer } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const SignupStep1: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const steps = [
    {
      number: 1,
      title: '기본 정보',
      description: '아이디, 이메일, 비밀번호',
    },
    {
      number: 2,
      title: '개인 정보',
      description: '생년월일, 성별, 프로필',
    },
    {
      number: 3,
      title: 'SNS 연동',
      description: '소셜 계정 연결 (선택)',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // 데이터 저장 (선택사항)
    localStorage.setItem('signupStep1Data', JSON.stringify(formData));
    // 다음 단계로 이동
    navigate('/signup/step2');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 진행 상태 표시 */}
        <ProgressIndicator currentStep={1} steps={steps} className="mb-8" />

        <FormContainer
          title="기본 정보 입력"
          subtitle="회원가입을 위한 기본 정보를 입력해주세요"
          maxWidth="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 아이디 */}
            <Input
              label="아이디"
              name="username"
              type="text"
              placeholder="아이디를 입력해주세요"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
            />

            {/* 이메일 */}
            <Input
              label="이메일"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 비밀번호 */}
            <Input
              label="비밀번호"
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
            />

            {/* 비밀번호 확인 */}
            <Input
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 확인해 주세요"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
          </div>

          {/* 전화번호 */}
          <Input
            label="전화번호"
            name="phone"
            type="tel"
            placeholder="01012345678"
            value={formData.phone}
            onChange={handleInputChange}
            autoComplete="tel"
          />

          {/* 네비게이션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 border-transparent"
            >
              홈으로 돌아가기
            </Link>

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="sm:min-w-[120px]"
            >
              다음 단계
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupStep1;
