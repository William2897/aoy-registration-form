import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Welcome',
    'Personal Info',
    'Children',
    'T-Shirt',
    'Health',
    'TnC',
    'Payment'
  ];

  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-100 dark:bg-gray-700">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500 dark:bg-orange-600 transition-all duration-500"
          />
        </div>
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                index <= currentStep
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div
                className={`rounded-full transition-colors duration-200 ${
                  index <= currentStep
                    ? 'bg-orange-600 dark:bg-orange-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                } h-5 w-5 flex items-center justify-center`}
              >
                <span className="text-white text-xs">{index + 1}</span>
              </div>
              <span className="text-xs mt-1 hidden sm:block">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;