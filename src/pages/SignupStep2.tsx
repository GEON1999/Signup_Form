import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, FormContainer } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';
import { step2Schema, type Step2FormData } from '../schemas/signupSchemas';

const SignupStep2: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
    defaultValues: {
      birthDate: '',
      gender: undefined,
      profileImage: undefined,
    },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Step2FormData) => {
    try {
      // TODO: 데이터 보존 로직 추가 예정
      console.log('2단계 데이터:', data);
      
      // 다음 단계로 이동
      navigate('/signup/step3');
    } catch (error) {
      console.error('2단계 폼 제출 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 진행 상태 표시 */}
        <ProgressIndicator currentStep={2} steps={steps} className="mb-8" />

        <FormContainer
          title="개인 정보 입력"
          subtitle="프로필 설정을 위한 개인 정보를 입력해주세요"
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 생년월일 */}
              <div>
                <Input
                  label="생년월일"
                  {...register("birthDate")}
                  type="date"
                  max={new Date().toISOString().split('T')[0]} // 오늘 날짜까지만 선택 가능
                  error={errors.birthDate?.message}
                />
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  성별 <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("gender")}
                  className="block w-full px-3 py-3 text-base border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">성별을 선택해주세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                  <option value="prefer_not_to_say">응답하지 않음</option>
                </select>
                {errors.gender?.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* 프로필 이미지 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                프로필 이미지 (선택사항)
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="프로필 미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || undefined;
                      setValue("profileImage", file);
                      handleFileChange(e);
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-colors duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF 형식, 최대 5MB
                  </p>
                  {errors.profileImage?.message && (
                    <p className="text-sm text-red-500 mt-1">{errors.profileImage.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              <Link
                to="/signup/step1"
                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 border-transparent"
              >
                이전 단계
              </Link>

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting}
                className="sm:min-w-[120px]"
              >
                {isSubmitting ? "처리 중..." : "다음 단계"}
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupStep2;
