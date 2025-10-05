import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { 
  GameState, 
  GameSettings, 
  Player, 
  GameResult, 
  TimerState, 
  CapturedPieces,
  GameStats,
  SoundSettings
} from '../types/chess.types';

interface GameStore {
  // Game state
  chess: Chess;
  gameState: GameState;
  players: Player[];
  timer: TimerState;
  capturedPieces: CapturedPieces;
  gameStats: GameStats;
  
  // Game settings
  settings: GameSettings;
  soundSettings: SoundSettings;
  
  // UI state
  isGameActive: boolean;
  isPaused: boolean;
  showPromotionDialog: boolean;
  promotionSquare: string | null;
  selectedSquare: string | null;
  legalMoves: string[];
  
  // Game result
  gameResult: GameResult | null;
  
  // Actions
  initializeGame: (settings: GameSettings) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  selectSquare: (square: string | null) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (result: GameResult) => void;
  
  // Timer actions
  startTimer: () => void;
  stopTimer: () => void;
  updateTimer: (deltaTime: number) => void;
  switchTurn: () => void;
  
  // Settings actions
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  updateSoundSettings: (newSettings: Partial<SoundSettings>) => void;
  
  // UI actions
  setShowPromotionDialog: (show: boolean, square?: string) => void;
  setGameActive: (active: boolean) => void;
}

const initialGameState: GameState = {
  position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  moveHistory: [],
  turn: 'w',
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  isDraw: false,
  isGameOver: false,
  legalMoves: [],
  selectedSquare: null,
};

const initialTimer: TimerState = {
  whiteTime: 600, // 10 minutes default
  blackTime: 600,
  isRunning: false,
  activePlayer: null,
};

const initialCapturedPieces: CapturedPieces = {
  white: [],
  black: [],
};

const initialGameStats: GameStats = {
  movesPlayed: 0,
  timeElapsed: 0,
  captures: initialCapturedPieces,
  checks: 0,
  averageMoveTime: 0,
};

const initialSettings: GameSettings = {
  timeControl: {
    type: 'rapid',
    timePerPlayer: 600,
    increment: 0,
  },
  gameMode: 'local',
  difficulty: 'medium',
  soundEnabled: true,
  showLegalMoves: true,
  boardOrientation: 'white',
};

const initialSoundSettings: SoundSettings = {
  move: true,
  capture: true,
  check: true,
  checkmate: true,
  draw: true,
  volume: 0.7,
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  chess: new Chess(),
  gameState: initialGameState,
  players: [],
  timer: initialTimer,
  capturedPieces: initialCapturedPieces,
  gameStats: initialGameStats,
  settings: initialSettings,
  soundSettings: initialSoundSettings,
  isGameActive: false,
  isPaused: false,
  showPromotionDialog: false,
  promotionSquare: null,
  selectedSquare: null,
  legalMoves: [],
  gameResult: null,

  // Game actions
  initializeGame: (settings: GameSettings) => {
    const chess = new Chess();
    const timePerPlayer = settings.timeControl.timePerPlayer;
    
    set({
      chess,
      gameState: {
        ...initialGameState,
        position: chess.fen(),
      },
      players: [
        { id: 'white', name: 'White', color: 'w', timeRemaining: timePerPlayer, isActive: true },
        { id: 'black', name: 'Black', color: 'b', timeRemaining: timePerPlayer, isActive: false },
      ],
      timer: {
        ...initialTimer,
        whiteTime: timePerPlayer,
        blackTime: timePerPlayer,
        activePlayer: 'w',
      },
      capturedPieces: initialCapturedPieces,
      gameStats: initialGameStats,
      settings,
      isGameActive: true,
      isPaused: false,
      gameResult: null,
      selectedSquare: null,
      legalMoves: [],
    });
  },

  makeMove: (from: string, to: string, promotion?: string) => {
    const { chess, gameState, gameStats } = get();
    
    try {
      const move = chess.move({ from, to, promotion: promotion || 'q' });
      if (!move) return false;

      const newPosition = chess.fen();
      const newMoveHistory = chess.history({ verbose: true });
      const isCheck = chess.isCheck();
      const isCheckmate = chess.isCheckmate();
      const isStalemate = chess.isStalemate();
      const isDraw = chess.isDraw();
      const isGameOver = chess.isGameOver();
      const turn = chess.turn();

      // Update captured pieces
      const newCapturedPieces = { ...gameStats.captures };
      if (move.captured) {
        if (move.color === 'w') {
          newCapturedPieces.black.push(move.captured as any);
        } else {
          newCapturedPieces.white.push(move.captured as any);
        }
      }

      // Update game stats
      const newGameStats = {
        ...gameStats,
        movesPlayed: gameStats.movesPlayed + 1,
        captures: newCapturedPieces,
        checks: isCheck ? gameStats.checks + 1 : gameStats.checks,
      };

      set({
        gameState: {
          ...gameState,
          position: newPosition,
          moveHistory: newMoveHistory,
          turn,
          isCheck,
          isCheckmate,
          isStalemate,
          isDraw,
          isGameOver,
          selectedSquare: null,
          legalMoves: [],
        },
        capturedPieces: newCapturedPieces,
        gameStats: newGameStats,
        selectedSquare: null,
        legalMoves: [],
      });

      // Switch timer
      get().switchTurn();

      // Check for game end
      if (isGameOver) {
        let result: GameResult;
        if (isCheckmate) {
          result = { result: turn === 'w' ? 'loss' : 'win', reason: 'checkmate', winner: turn === 'w' ? 'b' : 'w' };
        } else if (isStalemate) {
          result = { result: 'draw', reason: 'stalemate' };
        } else if (isDraw) {
          result = { result: 'draw', reason: 'draw' };
        } else {
          result = { result: 'draw', reason: 'draw' };
        }
        get().endGame(result);
      }

      return true;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  },

  selectSquare: (square: string | null) => {
    const { chess } = get();
    
    if (!square) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }

    const legalMoves = chess.moves({ square: square as any, verbose: true }).map(move => move.to as string);
    
    set({
      selectedSquare: square,
      legalMoves,
    });
  },

  resetGame: () => {
    const { settings } = get();
    get().initializeGame(settings);
  },

  pauseGame: () => {
    set({ isPaused: true });
    get().stopTimer();
  },

  resumeGame: () => {
    set({ isPaused: false });
    get().startTimer();
  },

  endGame: (result: GameResult) => {
    set({
      gameResult: result,
      isGameActive: false,
    });
    get().stopTimer();
  },

  // Timer actions
  startTimer: () => {
    set(state => ({
      timer: { ...state.timer, isRunning: true }
    }));
  },

  stopTimer: () => {
    set(state => ({
      timer: { ...state.timer, isRunning: false }
    }));
  },

  updateTimer: (deltaTime: number) => {
    const { timer } = get();
    if (!timer.isRunning || !timer.activePlayer) return;

    const newTime = timer.activePlayer === 'w' 
      ? Math.max(0, timer.whiteTime - deltaTime)
      : Math.max(0, timer.blackTime - deltaTime);

    if (newTime === 0) {
      // Time's up
      const result: GameResult = {
        result: timer.activePlayer === 'w' ? 'loss' : 'win',
        reason: 'timeout',
        winner: timer.activePlayer === 'w' ? 'b' : 'w'
      };
      get().endGame(result);
      return;
    }

    set(state => ({
      timer: {
        ...state.timer,
        whiteTime: timer.activePlayer === 'w' ? newTime : state.timer.whiteTime,
        blackTime: timer.activePlayer === 'b' ? newTime : state.timer.blackTime,
      }
    }));
  },

  switchTurn: () => {
    const { gameState } = get();
    const newActivePlayer = gameState.turn;
    
    set(state => ({
      timer: {
        ...state.timer,
        activePlayer: newActivePlayer,
      },
      players: state.players.map(player => ({
        ...player,
        isActive: player.color === newActivePlayer,
      })),
    }));
  },

  // Settings actions
  updateSettings: (newSettings: Partial<GameSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  updateSoundSettings: (newSettings: Partial<SoundSettings>) => {
    set(state => ({
      soundSettings: { ...state.soundSettings, ...newSettings }
    }));
  },

  // UI actions
  setShowPromotionDialog: (show: boolean, square?: string) => {
    set({
      showPromotionDialog: show,
      promotionSquare: square || null,
    });
  },

  setGameActive: (active: boolean) => {
    set({ isGameActive: active });
  },
}));