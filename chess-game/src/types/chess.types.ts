export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type Square = string; // e.g., 'e4', 'a1'

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Move {
  from: Square;
  to: Square;
  promotion?: PieceType;
  san: string; // Standard Algebraic Notation
  lan: string; // Long Algebraic Notation
  before: string; // FEN before move
  after: string; // FEN after move
  captured?: PieceType;
  flags: string;
}

export interface GameState {
  position: string; // FEN string
  moveHistory: Move[];
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  legalMoves: string[];
  selectedSquare: Square | null;
}

export interface Player {
  id: string;
  name: string;
  color: PieceColor;
  timeRemaining: number; // in seconds
  isActive: boolean;
}

export interface GameSettings {
  timeControl: TimeControl;
  gameMode: GameMode;
  difficulty?: AIDifficulty;
  soundEnabled: boolean;
  showLegalMoves: boolean;
  boardOrientation: 'white' | 'black';
}

export interface TimeControl {
  type: 'blitz' | 'rapid' | 'classical' | 'custom';
  timePerPlayer: number; // in seconds
  increment?: number; // in seconds
}

export type GameMode = 'local' | 'computer' | 'online';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface GameResult {
  result: 'win' | 'loss' | 'draw';
  reason: 'checkmate' | 'resignation' | 'timeout' | 'stalemate' | 'draw' | 'abandonment';
  winner?: PieceColor;
}

export interface Room {
  id: string;
  code: string;
  players: Player[];
  gameState: GameState;
  settings: GameSettings;
  isActive: boolean;
  createdAt: Date;
}

export interface MultiplayerMove {
  roomId: string;
  move: Move;
  playerId: string;
  timestamp: Date;
}

export interface SoundSettings {
  move: boolean;
  capture: boolean;
  check: boolean;
  checkmate: boolean;
  draw: boolean;
  volume: number; // 0-1
}

export interface TimerState {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  activePlayer: PieceColor | null;
}

export interface CapturedPieces {
  white: PieceType[];
  black: PieceType[];
}

export interface GameStats {
  movesPlayed: number;
  timeElapsed: number;
  captures: CapturedPieces;
  checks: number;
  averageMoveTime: number;
}

// Event types for Socket.io
export interface SocketEvents {
  // Client to Server
  'create_room': (roomCode: string) => void;
  'join_room': (roomCode: string) => void;
  'leave_room': (roomId: string) => void;
  'make_move': (move: MultiplayerMove) => void;
  'offer_draw': (roomId: string) => void;
  'resign': (roomId: string) => void;
  'rematch': (roomId: string) => void;
  
  // Server to Client
  'room_created': (room: Room) => void;
  'room_joined': (room: Room) => void;
  'player_joined': (player: Player) => void;
  'player_left': (playerId: string) => void;
  'move_made': (move: MultiplayerMove) => void;
  'game_ended': (result: GameResult) => void;
  'draw_offered': (fromPlayerId: string) => void;
  'draw_declined': (fromPlayerId: string) => void;
  'error': (message: string) => void;
}