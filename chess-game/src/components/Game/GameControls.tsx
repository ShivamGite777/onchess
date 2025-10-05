import React from 'react';
import { Button } from '../UI/Button';
import { cn } from '../../utils/cn';
import { 
  RotateCcw, 
  Pause, 
  Play, 
  Flag, 
  Handshake, 
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface GameControlsProps {
  isGameActive: boolean;
  isPaused: boolean;
  onNewGame: () => void;
  onPause: () => void;
  onResume: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onSettings: () => void;
  onFlipBoard: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isGameActive,
  isPaused,
  onNewGame,
  onPause,
  onResume,
  onResign,
  onOfferDraw,
  onSettings,
  onFlipBoard,
  soundEnabled,
  onToggleSound,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        onClick={onNewGame}
        leftIcon={<RotateCcw className="h-4 w-4" />}
      >
        New Game
      </Button>

      {isGameActive && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={isPaused ? onResume : onPause}
            leftIcon={isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onFlipBoard}
          >
            Flip Board
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleSound}
            leftIcon={soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          >
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOfferDraw}
            leftIcon={<Handshake className="h-4 w-4" />}
          >
            Offer Draw
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={onResign}
            leftIcon={<Flag className="h-4 w-4" />}
          >
            Resign
          </Button>
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onSettings}
        leftIcon={<Settings className="h-4 w-4" />}
      >
        Settings
      </Button>
    </div>
  );
};