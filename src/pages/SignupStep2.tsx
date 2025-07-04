import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, FormContainer } from '../components/ui';
import ProgressIndicator from '../components/ProgressIndicator';
import { step2Schema, type Step2FormData } from '../schemas/signupSchemas';
import { useSignupStore } from '../stores/signupStore';
import { uploadProfileImage, dataUrlToFile } from '../api/storage';

const SignupStep2: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Zustand 스토어에서 데이터 가져오기
  const { 
    step2Data, 
    setStep2Data, 
    setCurrentStep 
  } = useSignupStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
    // 스토어에 저장된 데이터가 있으면 사용, 없으면 빈 값으로 초기화
    defaultValues: {
      birthDate: step2Data?.birthDate || '',
      gender: step2Data?.gender,
      // File 객체는 저장되지 않으므로 항상 undefined로 초기화
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

  // 스토어에 저장된 이미지 미리보기 또는 URL 복원
  useEffect(() => {
    // 이미지 미리보기가 있으면 복원
    if (step2Data?.profileImagePreview) {
      setImagePreview(step2Data.profileImagePreview);
    }
    // 업로드된 이미지 URL이 있고 미리보기가 없으면 URL을 미리보기로 사용
    else if (step2Data?.profileImageUrl && !step2Data?.profileImagePreview) {
      setImagePreview(step2Data.profileImageUrl);
    }
  }, [step2Data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        const imagePreview = event.target?.result as string;
        setImagePreview(imagePreview);
        
        // 미리보기 URL도 스토어에 저장
        if (step2Data) {
          setStep2Data({
            ...step2Data,
            profileImagePreview: imagePreview
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Step2FormData) => {
    try {
      let profileImageUrl = '';
      
      // 프로필 이미지 업로드 (있는 경우)
      if (imagePreview) {
        try {
          setIsUploading(true);
          setUploadError(null);
          
          // 이미지가 File 객체인 경우 직접 업로드, base64 URL인 경우 File로 변환 후 업로드
          if (data.profileImage instanceof File) {
            profileImageUrl = await uploadProfileImage(data.profileImage);
          } else if (imagePreview) {
            // base64 이미지 URL을 File 객체로 변환
            const file = await dataUrlToFile(imagePreview, 'profile.jpg');
            profileImageUrl = await uploadProfileImage(file);
          }
          
          console.log('이미지 업로드 완료:', profileImageUrl);
        } catch (error: any) {
          console.error('이미지 업로드 오류:', error);
          setUploadError(error.message || '이미지 업로드 중 오류가 발생했습니다.');
          return; // 업로드 실패 시 제출 중단
        } finally {
          setIsUploading(false);
        }
      }
      
      // 입력 데이터를 스토어에 저장
      setStep2Data({
        ...data,
        profileImagePreview: imagePreview,
        profileImageUrl: profileImageUrl // Supabase에 업로드된 이미지 URL 저장
      });
      
      // 현재 단계 업데이트
      setCurrentStep(2);
      console.log('2단계 데이터:', data, { profileImageUrl });
      
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
                    key={"profile-image-input"} // 키 추가로 컴포넌트 항상 새로 렌더링 (value 초기화)
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
                  {/* 업로드 오류 메시지 */}
                  {uploadError && (
                    <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              <Link
                to="/signup/step1"
                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 border-transparent"
                onClick={() => {
                  // 현재 입력된 데이터 저장
                  const currentData = {
                    birthDate: String(getValues('birthDate') || ''),
                    gender: getValues('gender'),
                    profileImage: getValues('profileImage'),
                    profileImagePreview: imagePreview
                  };
                  setStep2Data(currentData);
                }}
              >
                이전 단계
              </Link>

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting || isUploading}
                className="sm:min-w-[120px]"
              >
                {isSubmitting || isUploading ? "처리 중..." : "다음 단계"}
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupStep2;
