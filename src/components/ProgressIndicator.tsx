import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  steps,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Mobile: Simplified progress bar */}
      <div className="block sm:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            단계 {currentStep} / {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {steps.find(step => step.number === currentStep)?.title}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Full step indicator */}
      <div className="hidden sm:block">
        <nav aria-label="회원가입 진행 단계">
          <ol className="flex items-center justify-center">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <li key={step.number} className={`${index === steps.length - 1 ? 'flex-none' : 'flex-1'} group`}>
                  <div className="flex items-center">
                    {/* Step Circle */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200
                          ${
                            isCompleted
                              ? 'bg-gray-900 border-gray-900 text-white'
                              : isCurrent
                              ? 'bg-white border-gray-900 text-gray-900 shadow-md'
                              : 'bg-white border-gray-300 text-gray-400'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="text-sm font-semibold">
                            {step.number}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="ml-4 min-w-0 flex-1">
                      <div
                        className={`
                          text-sm font-medium
                          ${
                            isCompleted || isCurrent
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }
                        `}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`
                          text-xs mt-1
                          ${
                            isCompleted || isCurrent
                              ? 'text-gray-600'
                              : 'text-gray-400'
                          }
                        `}
                      >
                        {step.description}
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 ml-6 mr-8">
                        <div
                          className={`
                            h-px w-full transition-all duration-200
                            ${
                              isCompleted
                                ? 'bg-gray-900'
                                : 'bg-gray-300'
                            }
                          `}
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ProgressIndicator;
