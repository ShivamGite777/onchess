import { useCallback, useState } from 'react';
import { Chess } from 'chess.js';
import { AIDifficulty, Move } from '../types/chess.types';
import { makeComputerMove } from '../utils/ai.utils';

export const useAI = (difficulty: AIDifficulty = 'medium') => {
  const [isThinking, setIsThinking] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState<number>(0);

  const getBestMove = useCallback(async (chess: Chess): Promise<Move | null> => {
    if (chess.isGameOver()) return null;

    setIsThinking(true);
    const startTime = Date.now();

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const move = makeComputerMove(chess, difficulty);
      
      const endTime = Date.now();
      setLastMoveTime(endTime - startTime);
      
      return move;
    } catch (error) {
      console.error('AI move generation failed:', error);
      return null;
    } finally {
      setIsThinking(false);
    }
  }, [difficulty]);

  const makeMove = useCallback(async (chess: Chess): Promise<boolean> => {
    const move = await getBestMove(chess);
    if (!move) return false;

    try {
      const result = chess.move(move);
      return !!result;
    } catch (error) {
      console.error('Failed to make AI move:', error);
      return false;
    }
  }, [getBestMove]);

  const getMoveStrength = useCallback((difficulty: AIDifficulty): number => {
    const strengths = {
      easy: 1,
      medium: 2,
      hard: 3,
    };
    return strengths[difficulty];
  }, []);

  const getDifficultyName = useCallback((difficulty: AIDifficulty): string => {
    const names = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    };
    return names[difficulty];
  }, []);

  const getDifficultyDescription = useCallback((difficulty: AIDifficulty): string => {
    const descriptions = {
      easy: 'Random moves - suitable for beginners',
      medium: 'Basic strategy - good for intermediate players',
      hard: 'Advanced strategy - challenging for experienced players',
    };
    return descriptions[difficulty];
  }, []);

  const estimateMoveTime = useCallback((difficulty: AIDifficulty): number => {
    // Estimated time in milliseconds
    const times = {
      easy: 200,
      medium: 1000,
      hard: 3000,
    };
    return times[difficulty];
  }, []);

  const getThinkingMessage = useCallback((difficulty: AIDifficulty): string => {
    const messages = {
      easy: 'AI is making a move...',
      medium: 'AI is thinking...',
      hard: 'AI is calculating the best move...',
    };
    return messages[difficulty];
  }, []);

  const isDifficultyAvailable = useCallback((difficulty: AIDifficulty): boolean => {
    return ['easy', 'medium', 'hard'].includes(difficulty);
  }, []);

  const getNextDifficulty = useCallback((currentDifficulty: AIDifficulty): AIDifficulty => {
    const difficulties: AIDifficulty[] = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    return difficulties[nextIndex];
  }, []);

  const getPreviousDifficulty = useCallback((currentDifficulty: AIDifficulty): AIDifficulty => {
    const difficulties: AIDifficulty[] = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    const prevIndex = currentIndex === 0 ? difficulties.length - 1 : currentIndex - 1;
    return difficulties[prevIndex];
  }, []);

  return {
    // State
    isThinking,
    lastMoveTime,
    
    // Actions
    getBestMove,
    makeMove,
    
    // Utilities
    getMoveStrength,
    getDifficultyName,
    getDifficultyDescription,
    estimateMoveTime,
    getThinkingMessage,
    isDifficultyAvailable,
    getNextDifficulty,
    getPreviousDifficulty,
  };
};