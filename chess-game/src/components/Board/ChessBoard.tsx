import React, { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { cn } from '../../utils/cn';

interface ChessBoardProps {
  position: string;
  onMove: (square: string) => void;
  orientation?: 'white' | 'black';
  showLegalMoves?: boolean;
  selectedSquare?: string | null;
  legalMoves?: string[];
  isInteractive?: boolean;
  className?: string;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  position,
  onMove,
  orientation = 'white',
  showLegalMoves = true,
  selectedSquare,
  legalMoves = [],
  isInteractive = true,
  className,
}) => {
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, any>>({});
  const [moveFrom, setMoveFrom] = useState<string>('');
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    if (!isInteractive) return false;
    
    // For drag and drop, we need to handle the move differently
    // This will be handled by the parent component
    return false;
  }, [isInteractive]);

  const onSquareClick = useCallback((square: string) => {
    if (!isInteractive) return;

    // Call the parent's onMove handler with the clicked square
    onMove(square);
  }, [onMove, isInteractive]);

  const onSquareRightClick = useCallback((square: string) => {
    const color = 'rgba(255, 0, 0, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === color
        ? undefined
        : { backgroundColor: color },
    });
  }, [rightClickedSquares]);

  const getSquareStyles = useCallback(() => {
    const styles: Record<string, any> = {
      ...optionSquares,
      ...rightClickedSquares,
    };

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        ...styles[selectedSquare],
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      };
    }

    return styles;
  }, [optionSquares, rightClickedSquares, selectedSquare]);

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <div className="relative">
        <Chessboard
          position={position}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          boardOrientation={orientation}
          customSquareStyles={getSquareStyles()}
          boardWidth={600}
          arePiecesDraggable={isInteractive}
          areArrowsAllowed={false}
          showBoardNotation={true}
          customBoardStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          customDarkSquareStyle={{
            backgroundColor: '#b58863',
          }}
          customLightSquareStyle={{
            backgroundColor: '#f0d9b5',
          }}
          customPieces={{
            wP: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♙
              </div>
            ),
            wR: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♖
              </div>
            ),
            wN: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♘
              </div>
            ),
            wB: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♗
              </div>
            ),
            wQ: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♕
              </div>
            ),
            wK: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♔
              </div>
            ),
            bP: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♟
              </div>
            ),
            bR: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♜
              </div>
            ),
            bN: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♞
              </div>
            ),
            bB: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♝
              </div>
            ),
            bQ: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♛
              </div>
            ),
            bK: ({ squareWidth }) => (
              <div
                style={{
                  width: squareWidth,
                  height: squareWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: squareWidth * 0.6,
                  cursor: isInteractive ? 'grab' : 'default',
                }}
              >
                ♚
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};