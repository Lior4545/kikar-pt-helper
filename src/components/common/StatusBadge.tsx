
import React from 'react';
import { cn } from '@/lib/utils';

type Status = 'open' | 'closed' | 'filtered' | 'vulnerable' | 'secure' | 'unknown' | 'running' | 'stopped';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'open':
        return 'bg-cyber-green/20 text-cyber-green border-cyber-green/40';
      case 'closed':
        return 'bg-cyber-red/20 text-cyber-red border-cyber-red/40';
      case 'filtered':
        return 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/40';
      case 'vulnerable':
        return 'bg-cyber-red/20 text-cyber-red border-cyber-red/40';
      case 'secure':
        return 'bg-cyber-green/20 text-cyber-green border-cyber-green/40';
      case 'running':
        return 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40';
      case 'stopped':
        return 'bg-cyber-red/20 text-cyber-red border-cyber-red/40';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-xs border',
      getStatusStyles(),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
