import React from 'react';
import { cn } from '../../utils/cn';
import type { CapturedPieces as CapturedPiecesType, PieceType } from '../../types/chess.types';

interface CapturedPiecesProps {
  capturedPieces: CapturedPiecesType;
  className?: string;
}

const pieceSymbols: Record<PieceType, string> = {
  p: '♟',
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
};

const pieceNames: Record<PieceType, string> = {
  p: 'Pawn',
  r: 'Rook',
  n: 'Knight',
  b: 'Bishop',
  q: 'Queen',
  k: 'King',
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  capturedPieces,
  className,
}) => {
  const renderCapturedPieces = (pieces: PieceType[], color: 'w' | 'b') => {
    const pieceCounts: Record<PieceType, number> = {
      p: 0, r: 0, n: 0, b: 0, q: 0, k: 0,
    };

    pieces.forEach(piece => {
      pieceCounts[piece]++;
    });

    return (
      <div className="space-y-2">
        <h4 className={cn(
          'text-sm font-medium',
          color === 'w' ? 'text-white' : 'text-gray-300'
        )}>
          {color === 'w' ? 'White' : 'Black'} Captured
        </h4>
        <div className="flex flex-wrap gap-1">
          {Object.entries(pieceCounts).map(([piece, count]) => {
            if (count === 0) return null;
            
            return (
              <div
                key={piece}
                className="flex items-center space-x-1 bg-bg-primary rounded px-2 py-1"
                title={`${count} ${pieceNames[piece as PieceType]}${count > 1 ? 's' : ''}`}
              >
                <span className="text-lg">
                  {pieceSymbols[piece as PieceType]}
                </span>
                {count > 1 && (
                  <span className="text-xs text-gray-400">
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {renderCapturedPieces(capturedPieces.white, 'w')}
      {renderCapturedPieces(capturedPieces.black, 'b')}
    </div>
  );
};