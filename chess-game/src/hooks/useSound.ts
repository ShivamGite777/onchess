import { useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager, playSound } from '../utils/sound.utils';
import { SoundSettings } from '../types/chess.types';

export const useSound = () => {
  const { soundSettings, updateSoundSettings } = useGameStore();

  // Initialize sound manager with current settings
  useEffect(() => {
    soundManager.updateSettings(soundSettings);
  }, [soundSettings]);

  const playMoveSound = useCallback(() => {
    if (soundSettings.move) {
      playSound('move');
    }
  }, [soundSettings.move]);

  const playCaptureSound = useCallback(() => {
    if (soundSettings.capture) {
      playSound('capture');
    }
  }, [soundSettings.capture]);

  const playCheckSound = useCallback(() => {
    if (soundSettings.check) {
      playSound('check');
    }
  }, [soundSettings.check]);

  const playCheckmateSound = useCallback(() => {
    if (soundSettings.checkmate) {
      playSound('checkmate');
    }
  }, [soundSettings.checkmate]);

  const playDrawSound = useCallback(() => {
    if (soundSettings.draw) {
      playSound('draw');
    }
  }, [soundSettings.draw]);

  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    updateSoundSettings({ volume: newVolume });
    soundManager.setVolume(newVolume);
  }, [updateSoundSettings]);

  const toggleSound = useCallback((soundType: keyof Omit<SoundSettings, 'volume'>) => {
    const newValue = !soundSettings[soundType];
    updateSoundSettings({ [soundType]: newValue });
    
    if (newValue) {
      soundManager.enableSound(soundType);
    } else {
      soundManager.disableSound(soundType);
    }
  }, [soundSettings, updateSoundSettings]);

  const enableAllSounds = useCallback(() => {
    const allEnabled: Partial<SoundSettings> = {
      move: true,
      capture: true,
      check: true,
      checkmate: true,
      draw: true,
    };
    updateSoundSettings(allEnabled);
    soundManager.updateSettings(allEnabled);
  }, [updateSoundSettings]);

  const disableAllSounds = useCallback(() => {
    const allDisabled: Partial<SoundSettings> = {
      move: false,
      capture: false,
      check: false,
      checkmate: false,
      draw: false,
    };
    updateSoundSettings(allDisabled);
    soundManager.updateSettings(allDisabled);
  }, [updateSoundSettings]);

  const resetToDefaults = useCallback(() => {
    const defaults: SoundSettings = {
      move: true,
      capture: true,
      check: true,
      checkmate: true,
      draw: true,
      volume: 0.7,
    };
    updateSoundSettings(defaults);
    soundManager.updateSettings(defaults);
  }, [updateSoundSettings]);

  const isSoundEnabled = useCallback((soundType: keyof Omit<SoundSettings, 'volume'>) => {
    return soundSettings[soundType];
  }, [soundSettings]);

  const getVolume = useCallback(() => {
    return soundSettings.volume;
  }, [soundSettings.volume]);

  const getSoundSettings = useCallback(() => {
    return { ...soundSettings };
  }, [soundSettings]);

  return {
    // Sound settings
    soundSettings: getSoundSettings(),
    volume: getVolume(),
    
    // Sound controls
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playCheckmateSound,
    playDrawSound,
    
    // Settings controls
    setVolume,
    toggleSound,
    enableAllSounds,
    disableAllSounds,
    resetToDefaults,
    isSoundEnabled,
  };
};