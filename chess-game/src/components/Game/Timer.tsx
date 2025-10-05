import React from 'react';
import { cn } from '../../utils/cn';
import { Clock } from 'lucide-react';

interface TimerProps {
  time: number;
  isActive: boolean;
  isLowTime?: boolean;
  color: 'w' | 'b';
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  time,
  isActive,
  isLowTime = false,
  color,
  className,
}) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className={cn(
        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
        isActive ? 'bg-accent/20 border border-accent' : 'bg-bg-secondary',
        isLowTime && isActive && 'animate-pulse bg-red-500/20 border-red-500',
        className
      )}
    >
      <Clock className={cn(
        'h-5 w-5',
        color === 'w' ? 'text-white' : 'text-gray-300'
      )} />
      <div
        className={cn(
          'text-2xl font-mono font-bold',
          color === 'w' ? 'text-white' : 'text-gray-300',
          isLowTime && isActive && 'text-red-400'
        )}
      >
        {formattedTime}
      </div>
    </div>
  );
};