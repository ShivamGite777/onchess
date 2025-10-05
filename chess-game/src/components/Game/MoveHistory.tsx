import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Move } from '../../types/chess.types';

interface MoveHistoryProps {
  moves: Move[];
  className?: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  const formatMove = (move: Move, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    
    return (
      <div
        key={index}
        className={cn(
          'flex items-center space-x-2 py-1 px-2 rounded text-sm',
          isWhiteMove ? 'bg-bg-primary' : 'bg-bg-secondary'
        )}
      >
        {isWhiteMove && (
          <span className="text-gray-400 font-mono text-xs w-8">
            {moveNumber}.
          </span>
        )}
        <span
          className={cn(
            'font-mono',
            isWhiteMove ? 'text-white' : 'text-gray-300'
          )}
        >
          {move.san}
        </span>
        {move.captured && (
          <span className="text-highlight text-xs">
            (captures {move.captured})
          </span>
        )}
        {move.flags.includes('+') && (
          <span className="text-yellow-400 text-xs">+</span>
        )}
        {move.flags.includes('#') && (
          <span className="text-red-400 text-xs">#</span>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'h-96 overflow-y-auto bg-bg-secondary rounded-lg border border-accent',
        className
      )}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Move History</h3>
        <div ref={scrollRef} className="space-y-1">
          {moves.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No moves yet
            </p>
          ) : (
            moves.map((move, index) => formatMove(move, index))
          )}
        </div>
      </div>
    </div>
  );
};