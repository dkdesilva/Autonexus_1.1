import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    progressRefs.current = progressRefs.current.slice(0, totalSteps - 1);

    if (currentStep > 1 && currentStep <= totalSteps) {
      const line = progressRefs.current[currentStep - 2];
      if (line) line.style.width = '100%';
    }
  }, [currentStep, totalSteps]);

  const getStepLabel = (stepNum: number) => {
    switch (stepNum) {
      case 1: return 'Personal';
      case 2: return 'Contact';
      case 3: return 'Images';
      case 4: return 'Security';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="relative flex justify-between">
        {/* Step Circles */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum <= currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
                  ${isCompleted ? 'scale-110' : ''}`}
              >
                {stepNum}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {getStepLabel(stepNum)}
              </span>
            </div>
          );
        })}

        {/* Connecting Lines */}
        <div className="absolute top-5 left-0 right-0 z-0 flex">
          {Array.from({ length: totalSteps - 1 }).map((_, index) => {
            const isActive = index < currentStep - 1;
            return (
              <div key={index} className="flex-1 mx-2 relative">
                {/* Gray base line */}
                <div className="h-1 bg-gray-200 absolute inset-0"></div>

                {/* Animated blue line */}
                <div
                  ref={el => progressRefs.current[index] = el}
                  className={`h-1 bg-blue-500 absolute inset-0 transition-all duration-500 ease-out ${isActive ? 'w-full' : 'w-0'}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
