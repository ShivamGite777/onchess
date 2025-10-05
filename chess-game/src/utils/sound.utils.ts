import { SoundSettings } from '../types/chess.types';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private settings: SoundSettings = {
    move: true,
    capture: true,
    check: true,
    checkmate: true,
    draw: true,
    volume: 0.7
  };

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadSounds();
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  }

  private async loadSounds() {
    if (!this.audioContext) return;

    const soundFiles = [
      'move.mp3',
      'capture.mp3', 
      'check.mp3',
      'checkmate.mp3',
      'draw.mp3'
    ];

    for (const file of soundFiles) {
      try {
        const response = await fetch(`/sounds/${file}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds.set(file.replace('.mp3', ''), audioBuffer);
      } catch (error) {
        console.warn(`Failed to load sound ${file}:`, error);
      }
    }
  }

  public playSound(soundType: 'move' | 'capture' | 'check' | 'checkmate' | 'draw') {
    if (!this.audioContext || !this.settings[soundType]) return;

    const audioBuffer = this.sounds.get(soundType);
    if (!audioBuffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = this.settings.volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start();
  }

  public updateSettings(newSettings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  public setVolume(volume: number) {
    this.settings.volume = Math.max(0, Math.min(1, volume));
  }

  public enableSound(soundType: keyof Omit<SoundSettings, 'volume'>) {
    this.settings[soundType] = true;
  }

  public disableSound(soundType: keyof Omit<SoundSettings, 'volume'>) {
    this.settings[soundType] = false;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Fallback to simple audio elements if Web Audio API fails
export const playSoundFallback = (soundType: 'move' | 'capture' | 'check' | 'checkmate' | 'draw') => {
  try {
    const audio = new Audio(`/sounds/${soundType}.mp3`);
    audio.volume = soundManager.getSettings().volume;
    audio.play().catch(() => {
      // Silently fail if audio can't be played
    });
  } catch (error) {
    // Silently fail if audio creation fails
  }
};

// Main sound playing function
export const playSound = (soundType: 'move' | 'capture' | 'check' | 'checkmate' | 'draw') => {
  // Try Web Audio API first, fallback to simple audio
  if (soundManager.getSettings()[soundType]) {
    soundManager.playSound(soundType);
  }
};