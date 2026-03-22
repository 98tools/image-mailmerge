import React from 'react';

interface SuccessNotificationProps {
  show: boolean;
  imagesCount: number;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({ show, imagesCount }) => {
  if (!show) return null;

  return (
    <div 
      className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50"
      style={{
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Successfully generated {imagesCount} images!
      </div>
    </div>
  );
};
