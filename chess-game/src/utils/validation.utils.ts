import type { Square, PieceColor, GameMode, AIDifficulty, TimeControl } from '../types/chess.types';

export const isValidSquare = (square: string): square is Square => {
  if (typeof square !== 'string' || square.length !== 2) return false;
  
  const file = square[0];
  const rank = square[1];
  
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
};

export const isValidMove = (from: string, to: string): boolean => {
  return isValidSquare(from) && isValidSquare(to) && from !== to;
};

export const isValidColor = (color: string): color is PieceColor => {
  return color === 'w' || color === 'b';
};

export const isValidGameMode = (mode: string): mode is GameMode => {
  return ['local', 'computer', 'online'].includes(mode);
};

export const isValidAIDifficulty = (difficulty: string): difficulty is AIDifficulty => {
  return ['easy', 'medium', 'hard'].includes(difficulty);
};

export const isValidTimeControl = (timeControl: TimeControl): boolean => {
  if (!timeControl || typeof timeControl !== 'object') return false;
  
  const validTypes = ['blitz', 'rapid', 'classical', 'custom'];
  if (!validTypes.includes(timeControl.type)) return false;
  
  if (typeof timeControl.timePerPlayer !== 'number' || timeControl.timePerPlayer <= 0) {
    return false;
  }
  
  if (timeControl.increment !== undefined) {
    if (typeof timeControl.increment !== 'number' || timeControl.increment < 0) {
      return false;
    }
  }
  
  return true;
};

export const isValidRoomCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePlayerName = (name: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: 'Player name cannot be empty' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Player name must be at least 2 characters' };
  }
  
  if (sanitized.length > 20) {
    return { isValid: false, error: 'Player name must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9\s_-]+$/.test(sanitized)) {
    return { isValid: false, error: 'Player name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validateTimeControl = (timeControl: TimeControl): { isValid: boolean; error?: string } => {
  if (!isValidTimeControl(timeControl)) {
    return { isValid: false, error: 'Invalid time control format' };
  }
  
  const maxTime = 24 * 60 * 60; // 24 hours in seconds
  if (timeControl.timePerPlayer > maxTime) {
    return { isValid: false, error: 'Time per player cannot exceed 24 hours' };
  }
  
  if (timeControl.increment && timeControl.increment > 60) {
    return { isValid: false, error: 'Increment cannot exceed 60 seconds' };
  }
  
  return { isValid: true };
};

export const validateGameSettings = (settings: any): { isValid: boolean; error?: string } => {
  if (!settings || typeof settings !== 'object') {
    return { isValid: false, error: 'Invalid game settings' };
  }
  
  if (!isValidGameMode(settings.gameMode)) {
    return { isValid: false, error: 'Invalid game mode' };
  }
  
  if (settings.gameMode === 'computer' && !isValidAIDifficulty(settings.difficulty)) {
    return { isValid: false, error: 'Invalid AI difficulty' };
  }
  
  if (settings.timeControl) {
    const timeControlValidation = validateTimeControl(settings.timeControl);
    if (!timeControlValidation.isValid) {
      return timeControlValidation;
    }
  }
  
  if (typeof settings.soundEnabled !== 'boolean') {
    return { isValid: false, error: 'Sound enabled must be a boolean' };
  }
  
  if (typeof settings.showLegalMoves !== 'boolean') {
    return { isValid: false, error: 'Show legal moves must be a boolean' };
  }
  
  if (!['white', 'black'].includes(settings.boardOrientation)) {
    return { isValid: false, error: 'Invalid board orientation' };
  }
  
  return { isValid: true };
};

export const validateMove = (move: any): { isValid: boolean; error?: string } => {
  if (!move || typeof move !== 'object') {
    return { isValid: false, error: 'Invalid move format' };
  }
  
  if (!isValidSquare(move.from)) {
    return { isValid: false, error: 'Invalid from square' };
  }
  
  if (!isValidSquare(move.to)) {
    return { isValid: false, error: 'Invalid to square' };
  }
  
  if (move.promotion && !['q', 'r', 'b', 'n'].includes(move.promotion)) {
    return { isValid: false, error: 'Invalid promotion piece' };
  }
  
  return { isValid: true };
};

export const validateRoom = (room: any): { isValid: boolean; error?: string } => {
  if (!room || typeof room !== 'object') {
    return { isValid: false, error: 'Invalid room format' };
  }
  
  if (!isValidRoomCode(room.code)) {
    return { isValid: false, error: 'Invalid room code' };
  }
  
  if (!Array.isArray(room.players)) {
    return { isValid: false, error: 'Players must be an array' };
  }
  
  if (room.players.length > 2) {
    return { isValid: false, error: 'Room cannot have more than 2 players' };
  }
  
  for (const player of room.players) {
    if (!player.id || !player.name || !isValidColor(player.color)) {
      return { isValid: false, error: 'Invalid player data' };
    }
  }
  
  return { isValid: true };
};