import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'md',
  className = '',
  onSubmit,
}) => {
  // 최대 너비 클래스
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const containerClasses = `
    ${maxWidthClasses[maxWidth]} mx-auto
    bg-white rounded-xl shadow-lg
    p-8 sm:p-10
    border border-gray-200
  `
    .trim()
    .replace(/\s+/g, ' ');

  const formClassName = 'space-y-6';

  return (
    <div className={`${containerClasses} ${className}`}>
      {title && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>
      )}

      {onSubmit ? (
        <form onSubmit={onSubmit} className={formClassName}>
          {children}
        </form>
      ) : (
        <div className={formClassName}>{children}</div>
      )}
    </div>
  );
};

export default FormContainer;
