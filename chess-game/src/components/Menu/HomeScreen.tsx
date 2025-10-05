import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { cn } from '../../utils/cn';
import { 
  Users, 
  Bot, 
  Globe, 
  Settings, 
  Trophy,
  Clock,
  Volume2
} from 'lucide-react';

interface HomeScreenProps {
  onStartLocalGame: () => void;
  onStartComputerGame: () => void;
  onStartOnlineGame: () => void;
  onSettings: () => void;
  className?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartLocalGame,
  onStartComputerGame,
  onStartOnlineGame,
  onSettings,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-bg-primary flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-white">
            Chess
            <span className="text-highlight">.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Play chess against friends, challenge the computer, or compete online. 
            Experience the classic game with modern features.
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Local Game */}
          <Card 
            variant="elevated" 
            className="hover:scale-105 transition-transform duration-200 cursor-pointer group"
            onClick={onStartLocalGame}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-accent/20 rounded-full w-fit">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-white">Local Game</CardTitle>
              <CardDescription>
                Play against a friend on the same device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="primary" 
                className="w-full group-hover:bg-highlight/90"
              >
                Start Local Game
              </Button>
            </CardContent>
          </Card>

          {/* Computer Game */}
          <Card 
            variant="elevated" 
            className="hover:scale-105 transition-transform duration-200 cursor-pointer group"
            onClick={onStartComputerGame}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-success/20 rounded-full w-fit">
                <Bot className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-white">vs Computer</CardTitle>
              <CardDescription>
                Challenge AI opponents of varying difficulty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="success" 
                className="w-full group-hover:bg-success/90"
              >
                Play vs Computer
              </Button>
            </CardContent>
          </Card>

          {/* Online Game */}
          <Card 
            variant="elevated" 
            className="hover:scale-105 transition-transform duration-200 cursor-pointer group"
            onClick={onStartOnlineGame}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-highlight/20 rounded-full w-fit">
                <Globe className="h-8 w-8 text-highlight" />
              </div>
              <CardTitle className="text-white">Online Play</CardTitle>
              <CardDescription>
                Compete with players from around the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="primary" 
                className="w-full group-hover:bg-highlight/90"
              >
                Play Online
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="flex items-center space-x-3 text-gray-400">
            <Clock className="h-5 w-5 text-accent" />
            <span>Multiple time controls</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <Volume2 className="h-5 w-5 text-accent" />
            <span>Sound effects</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <Trophy className="h-5 w-5 text-accent" />
            <span>Game statistics</span>
          </div>
        </div>

        {/* Settings Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={onSettings}
            leftIcon={<Settings className="h-4 w-4" />}
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};