import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // 사이즈 클래스
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    // 버튼 variant 클래스
    const variantClasses = {
      primary:
        'bg-gray-900 hover:bg-gray-800 focus:ring-gray-500 text-white border-transparent shadow-sm hover:shadow-md',
      secondary:
        'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white border-transparent shadow-sm hover:shadow-md',
      outline:
        'bg-transparent hover:bg-gray-50 focus:ring-gray-400 text-gray-700 border border-gray-300 hover:border-gray-400',
      ghost:
        'bg-transparent hover:bg-gray-100 focus:ring-gray-400 text-gray-600 border-transparent',
      danger:
        'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent shadow-sm hover:shadow-md',
    };

    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-lg
      border transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-opacity-50
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${widthClasses}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const isDisabled = disabled || loading;

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4 mr-2"
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

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
