
import React from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  className?: string;
  headerClassName?: string;
}

const CyberCard: React.FC<CyberCardProps> = ({ 
  children, 
  title, 
  className,
  headerClassName,
  ...props 
}) => {
  return (
    <div className={cn("cyber-card", className)} {...props}>
      {title && (
        <div className={cn("border-b border-cyber-blue/30 p-4 flex items-center justify-between", headerClassName)}>
          <h3 className="font-bold text-cyber-blue">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className="cyber-dot-red"></div>
            <div className="cyber-dot-yellow"></div>
            <div className="cyber-dot"></div>
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default CyberCard;
