import React from 'react';

interface ErrorMessageProps {
  message?: string;
  title?: string;
  variant?: 'inline' | 'banner' | 'toast';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title,
  variant = 'inline',
  size = 'md',
  dismissible = false,
  onDismiss,
  icon,
  className = '',
}) => {
  if (!message && !title) return null;

  // 기본 에러 아이콘
  const DefaultErrorIcon = () => (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  // 닫기 아이콘
  const CloseIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  // 사이즈 클래스
  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4',
  };

  // variant 클래스
  const variantClasses = {
    inline: 'bg-red-50 border border-red-200 text-red-800 rounded-lg',
    banner: 'bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3',
    toast: 'bg-red-500 text-white rounded-lg shadow-lg border border-red-600',
  };

  const baseClasses = `
    flex items-start space-x-3
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={baseClasses} role="alert">
      {/* Icon */}
      <div className="flex-shrink-0">{icon || <DefaultErrorIcon />}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        {message && (
          <p className={title ? 'text-sm opacity-90' : ''}>{message}</p>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button
          type="button"
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          onClick={onDismiss}
          aria-label="에러 메시지 닫기"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
