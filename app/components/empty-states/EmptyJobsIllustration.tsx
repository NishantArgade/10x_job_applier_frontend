import React from 'react';

interface EmptyJobsIllustrationProps {
  className?: string;
}

export const EmptyJobsIllustration: React.FC<EmptyJobsIllustrationProps> = ({ className = "w-64 h-64" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="currentColor" className="text-blue-50 dark:text-blue-900/20" />
      
      {/* Desk */}
      <rect x="80" y="200" width="240" height="8" rx="4" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
      
      {/* Computer Monitor */}
      <rect x="140" y="120" width="120" height="80" rx="8" fill="currentColor" className="text-gray-800 dark:text-gray-200" />
      <rect x="150" y="130" width="100" height="60" rx="4" fill="currentColor" className="text-white dark:text-gray-800" />
      
      {/* Monitor Stand */}
      <rect x="190" y="200" width="20" height="20" rx="2" fill="currentColor" className="text-gray-600 dark:text-gray-400" />
      <rect x="180" y="220" width="40" height="4" rx="2" fill="currentColor" className="text-gray-600 dark:text-gray-400" />
      
      {/* Search Icon on Screen */}
      <circle cx="200" cy="160" r="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
      <path d="m210 170 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500" />
      
      {/* Floating Documents */}
      <g className="animate-float" style={{ animationDelay: '0s' }}>
        <rect x="60" y="80" width="40" height="50" rx="4" fill="currentColor" className="text-orange-200 dark:text-orange-800" />
        <rect x="65" y="90" width="30" height="2" rx="1" fill="currentColor" className="text-orange-400" />
        <rect x="65" y="95" width="25" height="2" rx="1" fill="currentColor" className="text-orange-400" />
        <rect x="65" y="100" width="30" height="2" rx="1" fill="currentColor" className="text-orange-400" />
      </g>
      
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="300" y="60" width="40" height="50" rx="4" fill="currentColor" className="text-green-200 dark:text-green-800" />
        <rect x="305" y="70" width="30" height="2" rx="1" fill="currentColor" className="text-green-400" />
        <rect x="305" y="75" width="25" height="2" rx="1" fill="currentColor" className="text-green-400" />
        <rect x="305" y="80" width="30" height="2" rx="1" fill="currentColor" className="text-green-400" />
      </g>
      
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="320" y="180" width="40" height="50" rx="4" fill="currentColor" className="text-purple-200 dark:text-purple-800" />
        <rect x="325" y="190" width="30" height="2" rx="1" fill="currentColor" className="text-purple-400" />
        <rect x="325" y="195" width="25" height="2" rx="1" fill="currentColor" className="text-purple-400" />
        <rect x="325" y="200" width="30" height="2" rx="1" fill="currentColor" className="text-purple-400" />
      </g>
      
      {/* Briefcase */}
      <rect x="40" y="180" width="60" height="40" rx="6" fill="currentColor" className="text-blue-600 dark:text-blue-400" />
      <rect x="45" y="185" width="50" height="30" rx="3" fill="currentColor" className="text-blue-500 dark:text-blue-300" />
      <rect x="65" y="175" width="20" height="8" rx="2" fill="currentColor" className="text-blue-700 dark:text-blue-500" />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
};
