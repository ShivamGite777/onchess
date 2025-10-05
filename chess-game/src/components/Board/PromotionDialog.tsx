import React from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { cn } from '../../utils/cn';

interface PromotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (piece: string) => void;
  color: 'w' | 'b';
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  color,
}) => {
  const pieces = [
    { symbol: '♕', value: 'q', name: 'Queen' },
    { symbol: '♖', value: 'r', name: 'Rook' },
    { symbol: '♗', value: 'b', name: 'Bishop' },
    { symbol: '♘', value: 'n', name: 'Knight' },
  ];

  const handleSelect = (piece: string) => {
    onSelect(piece);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Promotion Piece"
      description="Select a piece to promote your pawn to"
      size="sm"
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="grid grid-cols-2 gap-4">
        {pieces.map((piece) => (
          <Button
            key={piece.value}
            variant="ghost"
            className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-accent/20"
            onClick={() => handleSelect(piece.value)}
          >
            <span className="text-4xl">{piece.symbol}</span>
            <span className="text-sm text-gray-400">{piece.name}</span>
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export { PromotionDialog };