
import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalOutputProps {
  content: string[];
  loading?: boolean;
  className?: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ 
  content,
  loading = false,
  className
}) => {
  return (
    <div className={cn(
      "bg-black/60 rounded-md p-4 font-mono text-sm overflow-auto max-h-64", 
      className
    )}>
      {content.map((line, index) => (
        <p key={index} className="text-cyber-green mb-1">
          <span className="text-cyber-blue mr-2">&gt;</span> {line}
        </p>
      ))}
      {loading && (
        <p className="text-cyber-green flex items-center">
          <span className="text-cyber-blue mr-2">&gt;</span> 
          <span className="animate-pulse">_</span>
        </p>
      )}
    </div>
  );
};

export default TerminalOutput;
