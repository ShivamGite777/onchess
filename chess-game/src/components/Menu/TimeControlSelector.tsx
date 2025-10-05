import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { cn } from '../../utils/cn';
import type { TimeControl } from '../../types/chess.types';
import { Clock, ArrowLeft, Play } from 'lucide-react';

interface TimeControlSelectorProps {
  selectedTimeControl: TimeControl | null;
  onSelectTimeControl: (timeControl: TimeControl) => void;
  onBack: () => void;
  onStart: () => void;
  className?: string;
}

export const TimeControlSelector: React.FC<TimeControlSelectorProps> = ({
  selectedTimeControl,
  onSelectTimeControl,
  onBack,
  onStart,
  className,
}) => {
  const timeControls: TimeControl[] = [
    {
      type: 'blitz',
      timePerPlayer: 300, // 5 minutes
      increment: 0,
    },
    {
      type: 'blitz',
      timePerPlayer: 300, // 5 minutes
      increment: 3,
    },
    {
      type: 'rapid',
      timePerPlayer: 600, // 10 minutes
      increment: 0,
    },
    {
      type: 'rapid',
      timePerPlayer: 600, // 10 minutes
      increment: 5,
    },
    {
      type: 'classical',
      timePerPlayer: 1800, // 30 minutes
      increment: 0,
    },
    {
      type: 'classical',
      timePerPlayer: 1800, // 30 minutes
      increment: 10,
    },
  ];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatIncrement = (increment: number): string => {
    return increment > 0 ? `+${increment}s` : 'No increment';
  };

  const getTimeControlName = (timeControl: TimeControl): string => {
    const minutes = Math.floor(timeControl.timePerPlayer / 60);
    // const _increment = timeControl.increment || 0;
    
    if (minutes <= 5) return 'Blitz';
    if (minutes <= 15) return 'Rapid';
    return 'Classical';
  };

  const getTimeControlColor = (timeControl: TimeControl): string => {
    const minutes = Math.floor(timeControl.timePerPlayer / 60);
    
    if (minutes <= 5) return 'text-red-400 bg-red-400/20';
    if (minutes <= 15) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-green-400 bg-green-400/20';
  };

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
            Choose Time Control
          </h1>
          <p className="text-lg text-gray-400">
            Select the time limit for your game
          </p>
        </div>

        {/* Time Control Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeControls.map((timeControl, index) => {
            const isSelected = selectedTimeControl?.timePerPlayer === timeControl.timePerPlayer && 
                              selectedTimeControl?.increment === timeControl.increment;
            const colorClasses = getTimeControlColor(timeControl);
            
            return (
              <Card
                key={index}
                variant={isSelected ? 'outlined' : 'elevated'}
                className={cn(
                  'hover:scale-105 transition-all duration-200 cursor-pointer group',
                  isSelected && 'ring-2 ring-highlight'
                )}
                onClick={() => onSelectTimeControl(timeControl)}
              >
                <CardHeader className="text-center">
                  <div className={cn(
                    'mx-auto mb-4 p-3 rounded-full w-fit',
                    colorClasses.split(' ')[1]
                  )}>
                    <Clock className={cn('h-6 w-6', colorClasses.split(' ')[0])} />
                  </div>
                  <CardTitle className="text-white">
                    {getTimeControlName(timeControl)}
                  </CardTitle>
                  <CardDescription>
                    {formatTime(timeControl.timePerPlayer)} per player
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">
                      {formatTime(timeControl.timePerPlayer)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatIncrement(timeControl.increment || 0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Start Button */}
        {selectedTimeControl && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              leftIcon={<Play className="h-5 w-5" />}
              className="px-8 py-3"
            >
              Start Game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};