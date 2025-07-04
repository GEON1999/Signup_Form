import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  centered?: boolean;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  centered = false,
  overlay = false,
  color = 'primary',
  className = '',
}) => {
  // 사이즈 클래스
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // 컬러 클래스
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  // Spinner 컴포넌트
  const Spinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Dots 컴포넌트
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            bg-current rounded-full animate-pulse
          `}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );

  // Pulse 컴포넌트
  const Pulse = () => (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        bg-current rounded-full animate-ping
      `}
    />
  );

  // Skeleton 컴포넌트
  const Skeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );

  // 로딩 컴포넌트 가져오기
  const getLoadingComponent = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner />;
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'skeleton':
        return <Skeleton />;
      default:
        return <Spinner />;
    }
  };

  const content = (
    <div
      className={`
        flex flex-col items-center justify-center space-y-3
        ${centered ? 'min-h-[200px]' : ''}
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
    >
      {getLoadingComponent()}
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>{text}</p>
      )}
    </div>
  );

  // 오버레이가 true이면 오버레이 배경으로 렌더링
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">{content}</div>
      </div>
    );
  }

  return content;
};

export default Loading;
