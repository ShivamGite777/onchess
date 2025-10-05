import React from 'react';
import { cn } from '../../utils/cn';
import { Crown, User } from 'lucide-react';
import type { Player } from '../../types/chess.types';

interface PlayerInfoProps {
  player: Player;
  isActive: boolean;
  isWinner?: boolean;
  className?: string;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  isActive,
  isWinner = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center space-x-3 p-3 rounded-lg transition-all duration-200',
        isActive ? 'bg-accent/20 border border-accent' : 'bg-bg-secondary',
        isWinner && 'bg-success/20 border border-success',
        className
      )}
    >
      <div className="flex-shrink-0">
        {isWinner ? (
          <Crown className="h-6 w-6 text-yellow-400" />
        ) : (
          <User className={cn(
            'h-6 w-6',
            player.color === 'w' ? 'text-white' : 'text-gray-300'
          )} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className={cn(
            'text-sm font-medium truncate',
            player.color === 'w' ? 'text-white' : 'text-gray-300'
          )}>
            {player.name}
          </h3>
          {isWinner && (
            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-medium">
              Winner
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">
          {player.color === 'w' ? 'White' : 'Black'} pieces
        </p>
      </div>
      
      {isActive && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-highlight rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};