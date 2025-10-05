import React from 'react';
import { Chessboard } from 'react-chessboard';
import { cn } from '../../utils/cn';

interface ChessBoardProps {
  position: string;
  onMove: (square: string) => void;
  orientation?: 'white' | 'black';
  selectedSquare?: string | null;
  isInteractive?: boolean;
  className?: string;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  position: _position,
  onMove: _onMove,
  orientation: _orientation = 'white',
  selectedSquare: _selectedSquare,
  isInteractive: _isInteractive = true,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <div className="relative">
        <Chessboard />
      </div>
    </div>
  );
};