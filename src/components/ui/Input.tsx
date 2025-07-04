import React, { forwardRef } from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // 사이즈 클래스
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    // variant 클래스
    const variantClasses = {
      default:
        'border-gray-200 focus:ring-gray-400 focus:border-gray-400 bg-white shadow-sm',
      filled:
        'border-transparent bg-gray-50 focus:ring-gray-400 focus:bg-gray-100 hover:bg-gray-75',
      outlined:
        'border-2 border-gray-200 focus:ring-gray-400 focus:border-gray-400 bg-white hover:border-gray-300',
    };

    const baseClasses = `
      w-full rounded-xl transition-all duration-200
      focus:ring-2 focus:ring-offset-0 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      placeholder:text-gray-400
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-400 bg-red-50' : ''}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${baseClasses} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">{rightIcon}</div>
            </div>
          )}
        </div>
        <div className="min-h-[1.5rem]">
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {helperText && (
            <p className="mt-2 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
