import React from 'react';

interface EmptyTemplatesIllustrationProps {
  className?: string;
}

export const EmptyTemplatesIllustration: React.FC<EmptyTemplatesIllustrationProps> = ({ className = "w-64 h-64" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="currentColor" className="text-emerald-50 dark:text-emerald-900/20" />
      
      {/* Main Template Grid */}
      <g className="animate-float" style={{ animationDelay: '0s' }}>
        {/* Template 1 */}
        <rect x="140" y="90" width="50" height="65" rx="4" fill="currentColor" className="text-white dark:text-gray-800" stroke="currentColor" strokeWidth="2" className="text-emerald-300 dark:text-emerald-600" />
        <rect x="145" y="100" width="40" height="3" rx="1" fill="currentColor" className="text-emerald-500" />
        <rect x="145" y="108" width="25" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="145" y="113" width="35" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="145" y="118" width="20" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="145" y="125" width="40" height="2" rx="1" fill="currentColor" className="text-emerald-400" />
        <rect x="145" y="130" width="30" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="145" y="135" width="35" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="145" y="140" width="25" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
      </g>
      
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        {/* Template 2 */}
        <rect x="210" y="100" width="50" height="65" rx="4" fill="currentColor" className="text-white dark:text-gray-800" stroke="currentColor" strokeWidth="2" className="text-emerald-300 dark:text-emerald-600" />
        <rect x="215" y="110" width="40" height="3" rx="1" fill="currentColor" className="text-emerald-500" />
        <rect x="215" y="118" width="30" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="215" y="123" width="35" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="215" y="128" width="25" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="215" y="135" width="40" height="2" rx="1" fill="currentColor" className="text-emerald-400" />
        <rect x="215" y="140" width="28" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="215" y="145" width="35" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="215" y="150" width="30" height="2" rx="1" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
      </g>
      
      {/* Floating Template Elements */}
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="80" y="60" width="40" height="50" rx="4" fill="currentColor" className="text-teal-200 dark:text-teal-800" />
        <rect x="85" y="70" width="30" height="2" rx="1" fill="currentColor" className="text-teal-500" />
        <rect x="85" y="75" width="20" height="2" rx="1" fill="currentColor" className="text-teal-500" />
        <rect x="85" y="80" width="25" height="2" rx="1" fill="currentColor" className="text-teal-500" />
        <circle cx="100" cy="95" r="6" fill="currentColor" className="text-teal-400" />
      </g>
      
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="280" y="190" width="40" height="50" rx="4" fill="currentColor" className="text-cyan-200 dark:text-cyan-800" />
        <rect x="285" y="200" width="30" height="2" rx="1" fill="currentColor" className="text-cyan-500" />
        <rect x="285" y="205" width="25" height="2" rx="1" fill="currentColor" className="text-cyan-500" />
        <rect x="285" y="210" width="20" height="2" rx="1" fill="currentColor" className="text-cyan-500" />
        <rect x="285" y="215" width="30" height="2" rx="1" fill="currentColor" className="text-cyan-500" />
      </g>
      
      {/* Writing/Pen Icon */}
      <g className="animate-bounce">
        <path d="M340 80 L345 85 L330 100 L325 95 Z" fill="currentColor" className="text-orange-500" />
        <path d="M325 95 L320 100 L325 105 L330 100 Z" fill="currentColor" className="text-orange-600" />
        <circle cx="347" cy="82" r="3" fill="currentColor" className="text-yellow-400" />
      </g>
      
      {/* Grid/Layout Icons */}
      <g className="animate-float" style={{ animationDelay: '1.5s' }}>
        <rect x="60" y="180" width="15" height="15" rx="2" fill="currentColor" className="text-emerald-400" />
        <rect x="80" y="180" width="15" height="15" rx="2" fill="currentColor" className="text-emerald-300" />
        <rect x="60" y="200" width="15" height="15" rx="2" fill="currentColor" className="text-emerald-300" />
        <rect x="80" y="200" width="15" height="15" rx="2" fill="currentColor" className="text-emerald-400" />
      </g>
      
      {/* Design Elements */}
      <g className="animate-pulse">
        <rect x="320" y="130" width="20" height="3" rx="1" fill="currentColor" className="text-pink-400" />
        <rect x="320" y="140" width="15" height="3" rx="1" fill="currentColor" className="text-purple-400" />
        <rect x="320" y="150" width="18" height="3" rx="1" fill="currentColor" className="text-blue-400" />
      </g>
      
      {/* Magic Wand/Creation Icon */}
      <g className="animate-float" style={{ animationDelay: '2.5s' }}>
        <path d="M80 120 L95 135" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-yellow-500" />
        <circle cx="83" cy="123" r="2" fill="currentColor" className="text-yellow-300" />
        <circle cx="92" cy="132" r="2" fill="currentColor" className="text-yellow-300" />
        <polygon points="75,115 77,119 81,119 78,122 79,126 75,124 71,126 72,122 69,119 73,119" fill="currentColor" className="text-yellow-400" />
      </g>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(5deg); }
        }
        .animate-bounce {
          animation: bounce 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
};
