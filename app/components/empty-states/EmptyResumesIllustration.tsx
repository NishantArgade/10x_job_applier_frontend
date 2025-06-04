import React from 'react';

interface EmptyResumesIllustrationProps {
  className?: string;
}

export const EmptyResumesIllustration: React.FC<EmptyResumesIllustrationProps> = ({ className = "w-64 h-64" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="currentColor" className="text-indigo-50 dark:text-indigo-900/20" />
      
      {/* Main Document Stack */}
      <g className="animate-float" style={{ animationDelay: '0s' }}>
        <rect x="160" y="80" width="80" height="100" rx="6" fill="currentColor" className="text-white dark:text-gray-800" stroke="currentColor" strokeWidth="2" className="text-indigo-200 dark:text-indigo-700" />
        
        {/* Document Header */}
        <rect x="170" y="95" width="60" height="4" rx="2" fill="currentColor" className="text-indigo-600" />
        <rect x="170" y="105" width="40" height="2" rx="1" fill="currentColor" className="text-gray-400" />
        
        {/* Profile Picture Placeholder */}
        <circle cx="185" cy="125" r="8" fill="currentColor" className="text-indigo-300 dark:text-indigo-600" />
        
        {/* Content Lines */}
        <rect x="170" y="140" width="60" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="170" y="145" width="45" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="170" y="150" width="55" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="170" y="155" width="35" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        
        {/* Section Divider */}
        <rect x="170" y="165" width="60" height="2" rx="1" fill="currentColor" className="text-indigo-400" />
      </g>
      
      {/* Floating PDF Icons */}
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="100" y="60" width="35" height="45" rx="4" fill="currentColor" className="text-red-200 dark:text-red-800" />
        <rect x="105" y="70" width="25" height="2" rx="1" fill="currentColor" className="text-red-500" />
        <rect x="105" y="75" width="20" height="2" rx="1" fill="currentColor" className="text-red-500" />
        <text x="117" y="95" fontSize="8" fill="currentColor" className="text-red-600 font-bold">PDF</text>
      </g>
      
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="270" y="200" width="35" height="45" rx="4" fill="currentColor" className="text-blue-200 dark:text-blue-800" />
        <rect x="275" y="210" width="25" height="2" rx="1" fill="currentColor" className="text-blue-500" />
        <rect x="275" y="215" width="20" height="2" rx="1" fill="currentColor" className="text-blue-500" />
        <text x="287" y="235" fontSize="8" fill="currentColor" className="text-blue-600 font-bold">PDF</text>
      </g>
      
      {/* Floating Stars */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        <polygon points="320,100 322,106 328,106 323,110 325,116 320,112 315,116 317,110 312,106 318,106" fill="currentColor" className="text-yellow-400" />
      </g>
      
      <g className="animate-float" style={{ animationDelay: '1.5s' }}>
        <polygon points="90,180 92,186 98,186 93,190 95,196 90,192 85,196 87,190 82,186 88,186" fill="currentColor" className="text-yellow-400" />
      </g>
      
      {/* Desktop/Folder Icon */}
      <rect x="120" y="190" width="50" height="35" rx="4" fill="currentColor" className="text-indigo-600 dark:text-indigo-400" />
      <rect x="125" y="195" width="40" height="25" rx="2" fill="currentColor" className="text-indigo-500 dark:text-indigo-300" />
      <rect x="130" y="200" width="30" height="2" rx="1" fill="currentColor" className="text-white dark:text-gray-800" />
      <rect x="130" y="205" width="25" height="2" rx="1" fill="currentColor" className="text-white dark:text-gray-800" />
      <rect x="130" y="210" width="30" height="2" rx="1" fill="currentColor" className="text-white dark:text-gray-800" />
      
      {/* Upload Arrow */}
      <g className="animate-bounce">
        <path d="M60 120 L70 130 L60 140" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-green-500" />
        <path d="M55 130 L70 130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-green-500" />
      </g>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
};
