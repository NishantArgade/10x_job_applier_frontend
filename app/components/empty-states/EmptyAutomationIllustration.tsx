import React from 'react';

interface EmptyAutomationIllustrationProps {
  className?: string;
}

export const EmptyAutomationIllustration: React.FC<EmptyAutomationIllustrationProps> = ({ className = "w-64 h-64" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="currentColor" className="text-violet-50 dark:text-violet-900/20" />
      
      {/* Main Robot */}
      <g className="animate-float" style={{ animationDelay: '0s' }}>
        {/* Robot Head */}
        <rect x="175" y="100" width="50" height="40" rx="8" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
        <rect x="170" y="95" width="60" height="50" rx="10" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
        
        {/* Robot Eyes */}
        <circle cx="185" cy="115" r="4" fill="currentColor" className="text-blue-500" />
        <circle cx="215" cy="115" r="4" fill="currentColor" className="text-blue-500" />
        <circle cx="185" cy="115" r="2" fill="currentColor" className="text-white" />
        <circle cx="215" cy="115" r="2" fill="currentColor" className="text-white" />
        
        {/* Robot Mouth */}
        <rect x="190" y="125" width="20" height="8" rx="4" fill="currentColor" className="text-gray-600 dark:text-gray-400" />
        
        {/* Robot Body */}
        <rect x="160" y="145" width="80" height="60" rx="12" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
        
        {/* Robot Chest Panel */}
        <rect x="175" y="160" width="50" height="30" rx="6" fill="currentColor" className="text-gray-500 dark:text-gray-400" />
        <circle cx="200" cy="175" r="8" fill="currentColor" className="text-violet-500" />
        <circle cx="200" cy="175" r="4" fill="currentColor" className="text-violet-300" />
        
        {/* Robot Arms */}
        <rect x="140" y="155" width="15" height="40" rx="7" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
        <rect x="245" y="155" width="15" height="40" rx="7" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
        
        {/* Robot Legs */}
        <rect x="170" y="205" width="15" height="30" rx="7" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
        <rect x="215" y="205" width="15" height="30" rx="7" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
      </g>
      
      {/* Floating Gears */}
      <g className="animate-spin-slow" style={{ animationDelay: '0s' }}>
        <circle cx="120" cy="80" r="15" fill="currentColor" className="text-orange-400" />
        <circle cx="120" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="3" className="text-white dark:text-gray-800" />
        <path d="M120 65 L125 70 L120 75 L115 70 Z" fill="currentColor" className="text-orange-500" />
        <path d="M135 80 L130 85 L125 80 L130 75 Z" fill="currentColor" className="text-orange-500" />
        <path d="M120 95 L115 90 L120 85 L125 90 Z" fill="currentColor" className="text-orange-500" />
        <path d="M105 80 L110 75 L115 80 L110 85 Z" fill="currentColor" className="text-orange-500" />
      </g>
      
      <g className="animate-spin-slow" style={{ animationDelay: '1s' }}>
        <circle cx="300" cy="200" r="12" fill="currentColor" className="text-purple-400" />
        <circle cx="300" cy="200" r="6" fill="none" stroke="currentColor" strokeWidth="2" className="text-white dark:text-gray-800" />
        <path d="M300 188 L303 192 L300 196 L297 192 Z" fill="currentColor" className="text-purple-500" />
        <path d="M312 200 L308 203 L304 200 L308 197 Z" fill="currentColor" className="text-purple-500" />
        <path d="M300 212 L297 208 L300 204 L303 208 Z" fill="currentColor" className="text-purple-500" />
        <path d="M288 200 L292 197 L296 200 L292 203 Z" fill="currentColor" className="text-purple-500" />
      </g>
      
      {/* Automation Flow Lines */}
      <g className="animate-pulse">
        <path d="M80 150 Q120 130 160 150" stroke="currentColor" strokeWidth="3" strokeDasharray="8,4" fill="none" className="text-blue-400" />
        <path d="M240 150 Q280 130 320 150" stroke="currentColor" strokeWidth="3" strokeDasharray="8,4" fill="none" className="text-green-400" />
      </g>
      
      {/* Task/Process Nodes */}
      <g className="animate-float" style={{ animationDelay: '1.5s' }}>
        <rect x="65" y="140" width="30" height="20" rx="10" fill="currentColor" className="text-blue-500" />
        <circle cx="80" cy="150" r="4" fill="currentColor" className="text-white" />
      </g>
      
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="305" y="140" width="30" height="20" rx="10" fill="currentColor" className="text-green-500" />
        <circle cx="320" cy="150" r="4" fill="currentColor" className="text-white" />
      </g>
      
      {/* Lightning/Power Icons */}
      <g className="animate-flash">
        <path d="M350 100 L345 110 L350 110 L348 120 L355 110 L350 110 Z" fill="currentColor" className="text-yellow-400" />
      </g>
      
      <g className="animate-flash" style={{ animationDelay: '1s' }}>
        <path d="M60 220 L55 230 L60 230 L58 240 L65 230 L60 230 Z" fill="currentColor" className="text-yellow-400" />
      </g>
      
      {/* Binary/Code Elements */}
      <g className="animate-float" style={{ animationDelay: '2.5s' }}>
        <text x="340" y="180" fontSize="12" fill="currentColor" className="text-green-500 font-mono">101</text>
        <text x="50" y="100" fontSize="12" fill="currentColor" className="text-blue-500 font-mono">010</text>
        <text x="280" y="70" fontSize="12" fill="currentColor" className="text-purple-500 font-mono">110</text>
      </g>
      
      {/* Antenna/Signal Lines */}
      <g className="animate-pulse">
        <path d="M200 95 L200 85" stroke="currentColor" strokeWidth="2" className="text-violet-500" />
        <circle cx="200" cy="82" r="2" fill="currentColor" className="text-violet-400" />
        <circle cx="200" cy="78" r="3" fill="none" stroke="currentColor" strokeWidth="1" className="text-violet-300" />
        <circle cx="200" cy="74" r="5" fill="none" stroke="currentColor" strokeWidth="1" className="text-violet-200" />
      </g>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-flash {
          animation: flash 1.5s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
};
