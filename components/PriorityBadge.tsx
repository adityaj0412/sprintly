
import React from 'react';
import { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}></span>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
