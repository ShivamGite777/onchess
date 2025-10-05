import React from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { GameResult } from '../../types/chess.types';
import { Trophy, Handshake, Clock, AlertCircle } from 'lucide-react';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GameResult | null;
  onNewGame: () => void;
  onRematch?: () => void;
  onMainMenu: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onNewGame,
  onRematch,
  onMainMenu,
}) => {
  if (!result) return null;

  const getResultIcon = () => {
    switch (result.reason) {
      case 'checkmate':
        return <Trophy className="h-16 w-16 text-yellow-400" />;
      case 'resignation':
        return <AlertCircle className="h-16 w-16 text-red-400" />;
      case 'timeout':
        return <Clock className="h-16 w-16 text-orange-400" />;
      case 'stalemate':
      case 'draw':
        return <Handshake className="h-16 w-16 text-blue-400" />;
      default:
        return <AlertCircle className="h-16 w-16 text-gray-400" />;
    }
  };

  const getResultTitle = () => {
    switch (result.result) {
      case 'win':
        return 'Victory!';
      case 'loss':
        return 'Defeat';
      case 'draw':
        return 'Draw';
      default:
        return 'Game Over';
    }
  };

  const getResultDescription = () => {
    switch (result.reason) {
      case 'checkmate':
        return result.winner === 'w' ? 'White wins by checkmate!' : 'Black wins by checkmate!';
      case 'resignation':
        return result.winner === 'w' ? 'White resigned. Black wins!' : 'Black resigned. White wins!';
      case 'timeout':
        return result.winner === 'w' ? 'White wins on time!' : 'Black wins on time!';
      case 'stalemate':
        return 'The game ended in a stalemate.';
      case 'draw':
        return 'The game ended in a draw.';
      case 'abandonment':
        return 'The game was abandoned.';
      default:
        return 'The game has ended.';
    }
  };

  const getResultColor = () => {
    switch (result.result) {
      case 'win':
        return 'text-green-400';
      case 'loss':
        return 'text-red-400';
      case 'draw':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          {getResultIcon()}
        </div>
        
        <div className="space-y-2">
          <h2 className={`text-3xl font-bold ${getResultColor()}`}>
            {getResultTitle()}
          </h2>
          <p className="text-gray-400 text-lg">
            {getResultDescription()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRematch && (
            <Button
              variant="primary"
              onClick={() => {
                onRematch();
                onClose();
              }}
            >
              Rematch
            </Button>
          )}
          
          <Button
            variant="secondary"
            onClick={() => {
              onNewGame();
              onClose();
            }}
          >
            New Game
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => {
              onMainMenu();
              onClose();
            }}
          >
            Main Menu
          </Button>
        </div>
      </div>
    </Modal>
  );
};