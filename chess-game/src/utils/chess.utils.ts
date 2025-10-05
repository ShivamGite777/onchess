import { Chess } from 'chess.js';
import type { PieceType, Square, Move, CapturedPieces } from '../types/chess.types';

export const getPieceSymbol = (piece: string): string => {
  const symbols: Record<string, string> = {
    'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
    'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
  };
  return symbols[piece] || piece;
};

export const getPieceName = (piece: string): string => {
  const names: Record<string, string> = {
    'p': 'Pawn', 'r': 'Rook', 'n': 'Knight', 'b': 'Bishop', 'q': 'Queen', 'k': 'King',
    'P': 'Pawn', 'R': 'Rook', 'N': 'Knight', 'B': 'Bishop', 'Q': 'Queen', 'K': 'King'
  };
  return names[piece] || 'Unknown';
};

export const getSquareColor = (square: Square): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
};

export const getSquareCoordinates = (square: Square): { x: number; y: number } => {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  return { x: file, y: 7 - rank }; // Flip rank for display
};

export const getSquareFromCoordinates = (x: number, y: number): Square => {
  const file = String.fromCharCode(97 + x);
  const rank = 8 - y;
  return `${file}${rank}` as Square;
};

export const isLegalMove = (chess: Chess, from: Square, to: Square): boolean => {
  try {
    const moves = chess.moves({ square: from as any, verbose: true });
    return moves.some(move => move.to === to);
  } catch {
    return false;
  }
};

export const getLegalMoves = (chess: Chess, square: Square): Square[] => {
  try {
    const moves = chess.moves({ square: square as any, verbose: true });
    return moves.map(move => move.to as Square);
  } catch {
    return [];
  }
};

export const getCapturedPieces = (moves: Move[]): CapturedPieces => {
  const captured: CapturedPieces = { white: [], black: [] };
  
  moves.forEach(move => {
    if (move.captured) {
      const piece = move.captured.toLowerCase() as PieceType;
      if (move.before.includes(move.to)) {
        // Determine color of captured piece by checking the square
        const pieceOnSquare = move.before.split(' ')[0].split('').find((_, i) => {
          const square = getSquareFromCoordinates(i % 8, Math.floor(i / 8));
          return square === move.to;
        });
        
        if (pieceOnSquare && pieceOnSquare === pieceOnSquare.toUpperCase()) {
          captured.white.push(piece);
        } else {
          captured.black.push(piece);
        }
      }
    }
  });
  
  return captured;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const parseTimeControl = (timeControl: string): { time: number; increment?: number } => {
  const parts = timeControl.split('+');
  const time = parseInt(parts[0]) * 60; // Convert minutes to seconds
  const increment = parts[1] ? parseInt(parts[1]) : undefined;
  return { time, increment };
};

export const getGamePhase = (moveCount: number): 'opening' | 'middlegame' | 'endgame' => {
  if (moveCount < 20) return 'opening';
  if (moveCount < 40) return 'middlegame';
  return 'endgame';
};

export const evaluatePosition = (chess: Chess): number => {
  // Simple material evaluation
  const board = chess.board();
  let evaluation = 0;
  
  const pieceValues: Record<string, number> = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
  };
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type.toLowerCase()] || 0;
        evaluation += piece.color === 'w' ? value : -value;
      }
    }
  }
  
  return evaluation;
};

export const getBestMove = (chess: Chess, depth: number = 2): Move | null => {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  
  let bestMove = moves[0];
  let bestScore = -Infinity;
  
  for (const move of moves) {
    chess.move(move);
    const score = minimax(chess, depth - 1, false);
    chess.undo();
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
};

const minimax = (chess: Chess, depth: number, maximizing: boolean): number => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluatePosition(chess);
  }
  
  const moves = chess.moves({ verbose: true });
  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, false);
      chess.undo();
      maxEval = Math.max(maxEval, score);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, true);
      chess.undo();
      minEval = Math.min(minEval, score);
    }
    return minEval;
  }
};

export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const validateRoomCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};