import React from 'react';

function UrgentButton({ onClick, isActive, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform
        ${isActive
          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-2xl scale-105 ring-4 ring-red-300'
          : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-xl hover:scale-102 active:scale-98'
        }
        disabled:bg-gradient-to-r disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:text-gray-500 disabled:shadow-none disabled:scale-100
        flex items-center justify-center gap-3
      `}
    >
      <svg
        className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>{isActive ? 'URGENT MODE ACTIVE' : 'I Need To Go Now!'}</span>
    </button>
  );
}

export default UrgentButton;
