import { useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound.utils';
import { makeComputerMove } from '../utils/ai.utils';

export const useChessGame = () => {
  const {
    chess,
    gameState,
    players,
    timer,
    capturedPieces,
    gameStats,
    settings,
    soundSettings,
    isGameActive,
    isPaused,
    showPromotionDialog,
    promotionSquare,
    selectedSquare,
    legalMoves,
    gameResult,
    makeMove: storeMakeMove,
    selectSquare,
    resetGame,
    pauseGame,
    resumeGame,
    endGame,
    startTimer,
    stopTimer,
    updateTimer,
    switchTurn,
    setShowPromotionDialog,
    setGameActive,
    initializeGame,
  } = useGameStore();

  // Handle computer moves
  useEffect(() => {
    if (
      settings.gameMode === 'computer' &&
      isGameActive &&
      !isPaused &&
      !gameResult &&
      gameState.turn === 'b' &&
      !showPromotionDialog
    ) {
      const timer = setTimeout(() => {
        const computerMove = makeComputerMove(chess, settings.difficulty || 'medium');
        if (computerMove) {
          handleMove(computerMove.from, computerMove.to);
        }
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [gameState.turn, isGameActive, isPaused, gameResult, settings.gameMode, settings.difficulty, showPromotionDialog]);

  // Timer effect
  useEffect(() => {
    if (!isGameActive || isPaused || gameResult) return;

    const interval = setInterval(() => {
      updateTimer(1); // Update every second
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isPaused, gameResult, updateTimer]);

  const handleMove = useCallback((from: string, to: string, promotion?: string) => {
    if (!isGameActive || isPaused || gameResult) return false;

    const success = storeMakeMove(from, to, promotion);
    
    if (success) {
      // Play sound effects
      if (soundSettings.move) {
        playSound('move');
      }
      
      // Check for special moves
      const move = chess.history({ verbose: true }).slice(-1)[0];
      if (move?.captured && soundSettings.capture) {
        playSound('capture');
      }
      
      if (gameState.isCheck && soundSettings.check) {
        playSound('check');
      }
      
      if (gameState.isCheckmate && soundSettings.checkmate) {
        playSound('checkmate');
      }
      
      if (gameState.isDraw && soundSettings.draw) {
        playSound('draw');
      }
    }

    return success;
  }, [isGameActive, isPaused, gameResult, storeMakeMove, soundSettings, chess, gameState]);

  const handleSquareClick = useCallback((square: string) => {
    if (!isGameActive || isPaused || gameResult) return;

    if (selectedSquare === square) {
      // Deselect if clicking the same square
      selectSquare(null);
      return;
    }

    if (selectedSquare) {
      // Try to make a move
      const success = handleMove(selectedSquare, square);
      if (success) {
        selectSquare(null);
      } else {
        // If move failed, select the new square
        selectSquare(square);
      }
    } else {
      // Select the square
      selectSquare(square);
    }
  }, [selectedSquare, isGameActive, isPaused, gameResult, handleMove, selectSquare]);

  const handlePromotion = useCallback((piece: string) => {
    if (!promotionSquare) return;

    const success = handleMove(selectedSquare || '', promotionSquare, piece);
    if (success) {
      setShowPromotionDialog(false);
    }
  }, [promotionSquare, selectedSquare, handleMove, setShowPromotionDialog]);

  const startNewGame = useCallback(() => {
    resetGame();
    setGameActive(true);
    startTimer();
  }, [resetGame, setGameActive, startTimer]);

  const resign = useCallback(() => {
    if (!isGameActive || gameResult) return;

    const result = {
      result: gameState.turn === 'w' ? 'loss' : 'win' as const,
      reason: 'resignation' as const,
      winner: gameState.turn === 'w' ? 'b' : 'w' as const,
    };
    
    endGame(result);
  }, [isGameActive, gameResult, gameState.turn, endGame]);

  const offerDraw = useCallback(() => {
    if (!isGameActive || gameResult) return;

    const result = {
      result: 'draw' as const,
      reason: 'draw' as const,
    };
    
    endGame(result);
  }, [isGameActive, gameResult, endGame]);

  const getLegalMoves = useCallback((square: string) => {
    return chess.moves({ square, verbose: true }).map(move => move.to);
  }, [chess]);

  const isLegalMove = useCallback((from: string, to: string) => {
    const moves = chess.moves({ square: from, verbose: true });
    return moves.some(move => move.to === to);
  }, [chess]);

  const getCurrentPlayer = useCallback(() => {
    return players.find(player => player.color === gameState.turn);
  }, [players, gameState.turn]);

  const getOpponentPlayer = useCallback(() => {
    return players.find(player => player.color !== gameState.turn);
  }, [players, gameState.turn]);

  const canMakeMove = useCallback((from: string, to: string) => {
    if (!isGameActive || isPaused || gameResult) return false;
    if (settings.gameMode === 'computer' && gameState.turn === 'b') return false;
    return isLegalMove(from, to);
  }, [isGameActive, isPaused, gameResult, settings.gameMode, gameState.turn, isLegalMove]);

  return {
    // Game state
    chess,
    gameState,
    players,
    timer,
    capturedPieces,
    gameStats,
    settings,
    soundSettings,
    isGameActive,
    isPaused,
    showPromotionDialog,
    promotionSquare,
    selectedSquare,
    legalMoves,
    gameResult,
    
    // Actions
    handleMove,
    handleSquareClick,
    handlePromotion,
    startNewGame,
    resetGame,
    pauseGame,
    resumeGame,
    resign,
    offerDraw,
    selectSquare,
    initializeGame,
    
    // Utilities
    getLegalMoves,
    isLegalMove,
    getCurrentPlayer,
    getOpponentPlayer,
    canMakeMove,
  };
};