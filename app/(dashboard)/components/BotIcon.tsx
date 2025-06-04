import React from 'react';

interface BotIconProps {
  className?: string;
}

const BotIcon: React.FC<BotIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Robot head */}
      <rect x="4" y="6" width="16" height="12" rx="3" ry="3" />
      
      {/* Robot antenna */}
      <line x1="12" y1="2" x2="12" y2="6" />
      <circle cx="12" cy="2" r="1" />
      
      {/* Robot eyes */}
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      
      {/* Robot mouth */}
      <path d="M9 14h6" />
      
      {/* Robot arms */}
      <line x1="4" y1="12" x2="2" y2="14" />
      <line x1="20" y1="12" x2="22" y2="14" />
      
      {/* Robot legs */}
      <line x1="8" y1="18" x2="8" y2="22" />
      <line x1="16" y1="18" x2="16" y2="22" />
    </svg>
  );
};

export default BotIcon;
