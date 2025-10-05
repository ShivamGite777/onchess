import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { cn } from '../../utils/cn';
import { GameMode, AIDifficulty } from '../../types/chess.types';
import { Users, Bot, Globe, ArrowLeft } from 'lucide-react';

interface GameModeSelectorProps {
  selectedMode: GameMode | null;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
  onStart: () => void;
  className?: string;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  onBack,
  onStart,
  className,
}) => {
  const gameModes = [
    {
      mode: 'local' as GameMode,
      title: 'Local Game',
      description: 'Play against a friend on the same device',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
    },
    {
      mode: 'computer' as GameMode,
      title: 'vs Computer',
      description: 'Challenge AI opponents of varying difficulty',
      icon: Bot,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
    },
    {
      mode: 'online' as GameMode,
      title: 'Online Play',
      description: 'Compete with players from around the world',
      icon: Globe,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
    },
  ];

  return (
    <div className={cn('min-h-screen bg-bg-primary flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="mb-4"
          >
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white">
            Choose Game Mode
          </h1>
          <p className="text-lg text-gray-400">
            Select how you'd like to play chess
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.mode;
            
            return (
              <Card
                key={mode.mode}
                variant={isSelected ? 'outlined' : 'elevated'}
                className={cn(
                  'hover:scale-105 transition-all duration-200 cursor-pointer group',
                  isSelected && 'ring-2 ring-highlight'
                )}
                onClick={() => onSelectMode(mode.mode)}
              >
                <CardHeader className="text-center">
                  <div className={cn(
                    'mx-auto mb-4 p-3 rounded-full w-fit',
                    mode.bgColor
                  )}>
                    <Icon className={cn('h-8 w-8', mode.color)} />
                  </div>
                  <CardTitle className="text-white">{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={isSelected ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMode(mode.mode);
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Start Button */}
        {selectedMode && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              className="px-8 py-3"
            >
              Start {gameModes.find(m => m.mode === selectedMode)?.title}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};