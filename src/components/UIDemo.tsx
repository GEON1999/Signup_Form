import React, { useState } from 'react';
import { Input, Button, FormContainer, ErrorMessage, Loading } from './ui';

const UIDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingVariant, setLoadingVariant] = useState<'spinner' | 'dots' | 'pulse' | 'skeleton'>('spinner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UI 컴포넌트 데모
          </h1>
          <p className="text-gray-600">
            재사용 가능한 UI 컴포넌트들의 다양한 스타일과 기능을 확인해보세요.
          </p>
        </div>

        {/* Form Container Demo */}
        <FormContainer
          title="폼 컨테이너 데모"
          subtitle="다양한 입력 컴포넌트들을 포함한 폼 예제입니다."
          onSubmit={handleSubmit}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Input Variants */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="기본 입력 필드"
                placeholder="이름을 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="아웃라인 스타일"
                placeholder="이메일을 입력하세요"
                variant="outlined"
                type="email"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="필드 스타일"
                placeholder="전화번호를 입력하세요"
                variant="filled"
                type="tel"
              />
              <Input
                label="에러 상태"
                placeholder="비밀번호를 입력하세요"
                type="password"
                error="비밀번호는 최소 8자 이상이어야 합니다."
              />
            </div>

            <Input
              label="도움말 텍스트"
              placeholder="사용자명을 입력하세요"
              helperText="영문, 숫자, 언더스코어만 사용 가능합니다."
            />

            {/* Button Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">버튼 스타일</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Primary Small</Button>
                <Button variant="secondary" size="md">Secondary Medium</Button>
                <Button variant="outline" size="lg">Outline Large</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  loading={isLoading}
                  loadingText="처리 중..."
                >
                  로딩 테스트
                </Button>
                <Button fullWidth variant="outline">
                  전체 너비 버튼
                </Button>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              폼 제출하기
            </Button>
          </div>
        </FormContainer>

        {/* Error Message Demo */}
        {showError && (
          <ErrorMessage
            title="오류 발생"
            message="폼 제출 중 오류가 발생했습니다. 다시 시도해주세요."
            variant="banner"
            dismissible
            onDismiss={() => setShowError(false)}
          />
        )}

        {/* Loading Demo */}
        <FormContainer title="로딩 컴포넌트 데모" maxWidth="md">
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              {(['spinner', 'dots', 'pulse', 'skeleton'] as const).map((variant) => (
                <Button
                  key={variant}
                  size="sm"
                  variant={loadingVariant === variant ? 'primary' : 'outline'}
                  onClick={() => setLoadingVariant(variant)}
                >
                  {variant}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">기본 로딩</h4>
                <Loading variant={loadingVariant} text="로딩 중..." />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">중앙 정렬</h4>
                <Loading variant={loadingVariant} centered />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <h5 className="font-medium mb-2">Small</h5>
                <Loading size="sm" variant={loadingVariant} />
              </div>
              <div className="text-center">
                <h5 className="font-medium mb-2">Medium</h5>
                <Loading size="md" variant={loadingVariant} />
              </div>
              <div className="text-center">
                <h5 className="font-medium mb-2">Large</h5>
                <Loading size="lg" variant={loadingVariant} />
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                // Overlay loading demo
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
              fullWidth
            >
              오버레이 로딩 테스트
            </Button>
          </div>
        </FormContainer>

        {/* Overlay Loading */}
        {isLoading && (
          <Loading
            overlay
            variant="spinner"
            text="처리 중입니다..."
            size="lg"
            color="white"
          />
        )}

        {/* Error Message Variants */}
        <FormContainer title="에러 메시지 스타일" maxWidth="lg">
          <div className="space-y-4">
            <ErrorMessage
              message="인라인 에러 메시지입니다."
              variant="inline"
            />
            <ErrorMessage
              title="배너 스타일"
              message="중요한 알림이나 경고 메시지에 사용됩니다."
              variant="banner"
            />
            <ErrorMessage
              message="토스트 스타일 메시지입니다."
              variant="toast"
              dismissible
              onDismiss={() => {}}
            />
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default UIDemo;
