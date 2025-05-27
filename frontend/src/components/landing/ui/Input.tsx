import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = `px-3 py-2 bg-white dark:bg-gray-800 border ${
    error 
      ? 'border-error-500 focus:ring-error-500' 
      : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500'
  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:text-white ${className}`;
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input className={`${inputClasses} ${widthClass}`} {...props} />
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
    </div>
  );
};

export default Input;