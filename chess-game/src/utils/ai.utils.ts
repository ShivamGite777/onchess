import { Chess } from 'chess.js';
import { AIDifficulty, Move } from '../types/chess.types';

export const makeComputerMove = (chess: Chess, difficulty: AIDifficulty): Move | null => {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  switch (difficulty) {
    case 'easy':
      return makeRandomMove(chess, moves);
    case 'medium':
      return makeMinimaxMove(chess, moves, 2);
    case 'hard':
      return makeMinimaxMove(chess, moves, 3);
    default:
      return makeRandomMove(chess, moves);
  }
};

const makeRandomMove = (chess: Chess, moves: Move[]): Move => {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

const makeMinimaxMove = (chess: Chess, moves: Move[], depth: number): Move => {
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

const evaluatePosition = (chess: Chess): number => {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -10000 : 10000;
  }
  
  if (chess.isDraw()) {
    return 0;
  }

  // Material evaluation
  const board = chess.board();
  let evaluation = 0;
  
  const pieceValues: Record<string, number> = {
    'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
  };

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type.toLowerCase()] || 0;
        const positionValue = getPositionValue(piece.type.toLowerCase(), i, j, piece.color);
        evaluation += piece.color === 'w' ? (value + positionValue) : -(value + positionValue);
      }
    }
  }

  // Mobility bonus
  const whiteMoves = chess.moves({ verbose: true }).length;
  chess.turn = () => 'b';
  const blackMoves = chess.moves({ verbose: true }).length;
  chess.turn = () => 'w';
  
  evaluation += (whiteMoves - blackMoves) * 10;

  // Center control bonus
  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  for (const square of centerSquares) {
    const piece = chess.get(square as any);
    if (piece) {
      evaluation += piece.color === 'w' ? 20 : -20;
    }
  }

  return evaluation;
};

const getPositionValue = (piece: string, row: number, col: number, color: string): number => {
  const positionTables: Record<string, number[][]> = {
    'p': [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5, 10, 25, 25, 10,  5,  5],
      [0,  0,  0, 20, 20,  0,  0,  0],
      [5, -5,-10,  0,  0,-10, -5,  5],
      [5, 10, 10,-20,-20, 10, 10,  5],
      [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    'n': [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    'b': [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    'r': [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [5, 10, 10, 10, 10, 10, 10,  5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [0,  0,  0,  5,  5,  0,  0,  0]
    ],
    'q': [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [-5,  0,  5,  5,  5,  5,  0, -5],
      [0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    'k': [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-30,-20],
      [-10,-20,-20,-20,-20,-20,-20,-10],
      [20, 20,  0,  0,  0,  0, 20, 20],
      [20, 30, 10,  0,  0, 10, 30, 20]
    ]
  };

  const table = positionTables[piece];
  if (!table) return 0;

  // Flip table for black pieces
  const actualRow = color === 'w' ? row : 7 - row;
  const actualCol = color === 'w' ? col : 7 - col;
  
  return table[actualRow][actualCol];
};