import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatTime } from '../utils/chess.utils';

export const useTimer = () => {
  const { timer, isGameActive, isPaused, gameResult, updateTimer, switchTurn } = useGameStore();

  // Timer effect
  useEffect(() => {
    if (!isGameActive || isPaused || gameResult) return;

    const interval = setInterval(() => {
      updateTimer(1); // Update every second
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isPaused, gameResult, updateTimer]);

  const getFormattedTime = useCallback((color: 'w' | 'b') => {
    const time = color === 'w' ? timer.whiteTime : timer.blackTime;
    return formatTime(time);
  }, [timer.whiteTime, timer.blackTime]);

  const getTimeRemaining = useCallback((color: 'w' | 'b') => {
    return color === 'w' ? timer.whiteTime : timer.blackTime;
  }, [timer.whiteTime, timer.blackTime]);

  const isLowTime = useCallback((color: 'w' | 'b', threshold: number = 30) => {
    const time = getTimeRemaining(color);
    return time <= threshold && time > 0;
  }, [getTimeRemaining]);

  const isTimeUp = useCallback((color: 'w' | 'b') => {
    return getTimeRemaining(color) <= 0;
  }, [getTimeRemaining]);

  const getActivePlayerTime = useCallback(() => {
    if (!timer.activePlayer) return 0;
    return getTimeRemaining(timer.activePlayer);
  }, [timer.activePlayer, getTimeRemaining]);

  const getInactivePlayerTime = useCallback(() => {
    if (!timer.activePlayer) return 0;
    const inactiveColor = timer.activePlayer === 'w' ? 'b' : 'w';
    return getTimeRemaining(inactiveColor);
  }, [timer.activePlayer, getTimeRemaining]);

  const getTimeDifference = useCallback(() => {
    return Math.abs(timer.whiteTime - timer.blackTime);
  }, [timer.whiteTime, timer.blackTime]);

  const getTimeAdvantage = useCallback(() => {
    const diff = timer.whiteTime - timer.blackTime;
    if (diff > 0) return { color: 'w' as const, advantage: diff };
    if (diff < 0) return { color: 'b' as const, advantage: Math.abs(diff) };
    return { color: null, advantage: 0 };
  }, [timer.whiteTime, timer.blackTime]);

  const isTimeControlActive = useCallback(() => {
    return timer.isRunning && isGameActive && !isPaused && !gameResult;
  }, [timer.isRunning, isGameActive, isPaused, gameResult]);

  const getTimePercentage = useCallback((color: 'w' | 'b', initialTime: number) => {
    const currentTime = getTimeRemaining(color);
    return Math.max(0, (currentTime / initialTime) * 100);
  }, [getTimeRemaining]);

  return {
    // Timer state
    timer,
    isActive: isTimeControlActive(),
    
    // Time getters
    getFormattedTime,
    getTimeRemaining,
    getActivePlayerTime,
    getInactivePlayerTime,
    getTimeDifference,
    getTimeAdvantage,
    getTimePercentage,
    
    // Time checks
    isLowTime,
    isTimeUp,
    
    // Actions
    switchTurn,
  };
};