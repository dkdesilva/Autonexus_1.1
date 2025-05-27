import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  onClick,
  hoverEffect = true,
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200 
        ${hoverEffect ? 'hover:shadow-lg transform hover:-translate-y-1' : ''} 
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
      )}
      <div className={`${title ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;