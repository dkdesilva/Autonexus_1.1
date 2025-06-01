import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Reset refs array
    progressRefs.current = progressRefs.current.slice(0, totalSteps - 1);
    
    // Animate the current progress line
    if (currentStep > 1 && currentStep <= totalSteps) {
      const lineIndex = currentStep - 2; // Adjust index to match the line before current step
      const line = progressRefs.current[lineIndex];
      if (line) {
        line.style.width = '100%';
      }
    }
  }, [currentStep, totalSteps]);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="relative flex justify-between">
        {/* Step circles */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum <= currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                } ${
                  isCompleted ? 'scale-110' : ''
                }`}
              >
                {stepNum}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                isActive ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {stepNum === 1 && 'Personal'}
                {stepNum === 2 && 'Contact'}
                {stepNum === 3 && 'Images'}
                {stepNum === 4 && 'Security'}
              </span>
            </div>
          );
        })}

        {/* Connection lines between circles */}
        <div className="absolute top-5 left-0 right-0 z-0 flex transform translate-y-0">
          {Array.from({ length: totalSteps - 1 }).map((_, index) => {
            const isActive = index < currentStep - 1;
            
            return (
              <div key={index} className="flex-1 mx-2 relative">
                {/* Background line (gray) */}
                <div className="h-1 bg-gray-200 absolute left-0 right-0 top-0"></div>
                
                {/* Foreground line (blue) that animates */}
                <div
                  ref={el => progressRefs.current[index] = el}
                  className={`h-1 bg-blue-500 absolute left-0 right-0 top-0 transition-all duration-500 ease-out ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;