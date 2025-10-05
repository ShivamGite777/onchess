import React, { useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { useSound } from './hooks/useSound';
import { HomeScreen } from './components/Menu/HomeScreen';
import { GameModeSelector } from './components/Menu/GameModeSelector';
import { TimeControlSelector } from './components/Menu/TimeControlSelector';
import { ChessBoard } from './components/Board/ChessBoard';
import { PromotionDialog } from './components/Board/PromotionDialog';
import { Timer } from './components/Game/Timer';
import { PlayerInfo } from './components/Game/PlayerInfo';
import { MoveHistory } from './components/Game/MoveHistory';
import { CapturedPieces } from './components/Game/CapturedPieces';
import { GameControls } from './components/Game/GameControls';
import { GameResultModal } from './components/Modals/GameResultModal';
import type { GameMode, TimeControl, AIDifficulty } from './types/chess.types';

type AppState = 'home' | 'game-mode' | 'time-control' | 'game' | 'settings';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('medium');
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');

  const {
    gameState,
    timer,
    capturedPieces,
    settings,
    isGameActive,
    isPaused,
    showPromotionDialog,
    selectedSquare,
    legalMoves,
    gameResult,
    handleSquareClick,
    handlePromotion,
    resetGame,
    pauseGame,
    resumeGame,
    resign,
    offerDraw,
    selectSquare,
    getCurrentPlayer,
    getOpponentPlayer,
    initializeGame,
  } = useChessGame();

  const { soundSettings: sound, toggleSound } = useSound();

  const handleStartLocalGame = () => {
    setSelectedGameMode('local');
    setAppState('time-control');
  };

  const handleStartComputerGame = () => {
    setSelectedGameMode('computer');
    setAppState('time-control');
  };

  const handleStartOnlineGame = () => {
    setSelectedGameMode('online');
    setAppState('time-control');
  };

  const handleSelectTimeControl = (timeControl: TimeControl) => {
    setSelectedTimeControl(timeControl);
  };

  const handleStartGame = () => {
    if (!selectedGameMode || !selectedTimeControl) return;

    const gameSettings = {
      timeControl: selectedTimeControl,
      gameMode: selectedGameMode,
      difficulty: selectedDifficulty,
      soundEnabled: sound.move,
      showLegalMoves: true,
      boardOrientation: 'white' as const,
    };

    // Initialize game with settings
    initializeGame(gameSettings);
    setAppState('game');
  };

  const handleNewGame = () => {
    resetGame();
    setAppState('home');
  };

  const handleMainMenu = () => {
    setAppState('home');
  };

  const handleFlipBoard = () => {
    setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
  };

  const handleSettings = () => {
    setAppState('settings');
  };

  const handleBackToHome = () => {
    setAppState('home');
    setSelectedGameMode(null);
    setSelectedTimeControl(null);
  };

  const handleBackToGameMode = () => {
    setAppState('game-mode');
    setSelectedTimeControl(null);
  };

  const currentPlayer = getCurrentPlayer();
  const opponentPlayer = getOpponentPlayer();

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      {appState === 'home' && (
        <HomeScreen
          onStartLocalGame={handleStartLocalGame}
          onStartComputerGame={handleStartComputerGame}
          onStartOnlineGame={handleStartOnlineGame}
          onSettings={handleSettings}
        />
      )}

      {appState === 'game-mode' && (
        <GameModeSelector
          selectedMode={selectedGameMode}
          onSelectMode={setSelectedGameMode}
          onBack={handleBackToHome}
          onStart={() => setAppState('time-control')}
        />
      )}

      {appState === 'time-control' && (
        <TimeControlSelector
          selectedTimeControl={selectedTimeControl}
          onSelectTimeControl={handleSelectTimeControl}
          onBack={handleBackToGameMode}
          onStart={handleStartGame}
        />
      )}

      {appState === 'game' && (
        <div className="min-h-screen bg-bg-primary">
          {/* Game Header */}
          <div className="bg-bg-secondary border-b border-accent p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Chess Game</h1>
              <GameControls
                isGameActive={isGameActive}
                isPaused={isPaused}
                onNewGame={handleNewGame}
                onPause={pauseGame}
                onResume={resumeGame}
                onResign={resign}
                onOfferDraw={offerDraw}
                onSettings={handleSettings}
                onFlipBoard={handleFlipBoard}
                soundEnabled={sound.move}
                onToggleSound={() => toggleSound('move')}
              />
            </div>
          </div>

          {/* Game Content */}
          <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Player Info & Timer */}
              <div className="lg:col-span-1 space-y-4">
                {/* Current Player */}
                {currentPlayer && (
                  <div className="space-y-2">
                    <PlayerInfo
                      player={currentPlayer}
                      isActive={true}
                      isWinner={gameResult?.winner === currentPlayer.color}
                    />
                    <Timer
                      time={currentPlayer?.timeRemaining || timer.whiteTime}
                      isActive={timer.activePlayer === 'w' && isGameActive && !isPaused}
                      isLowTime={(currentPlayer?.timeRemaining || timer.whiteTime) <= 30 && (currentPlayer?.timeRemaining || timer.whiteTime) > 0}
                      color="w"
                    />
                  </div>
                )}

                {/* Opponent Player */}
                {opponentPlayer && (
                  <div className="space-y-2">
                    <PlayerInfo
                      player={opponentPlayer}
                      isActive={false}
                      isWinner={gameResult?.winner === opponentPlayer.color}
                    />
                    <Timer
                      time={opponentPlayer?.timeRemaining || timer.blackTime}
                      isActive={timer.activePlayer === 'b' && isGameActive && !isPaused}
                      isLowTime={(opponentPlayer?.timeRemaining || timer.blackTime) <= 30 && (opponentPlayer?.timeRemaining || timer.blackTime) > 0}
                      color="b"
                    />
                  </div>
                )}

                {/* Captured Pieces */}
                <CapturedPieces capturedPieces={capturedPieces} />
              </div>

              {/* Center - Chess Board */}
              <div className="lg:col-span-2 flex justify-center">
                <ChessBoard
                  position={gameState.position}
                  onMove={handleSquareClick}
                  orientation={boardOrientation}
                  showLegalMoves={settings.showLegalMoves}
                  selectedSquare={selectedSquare}
                  legalMoves={legalMoves}
                  isInteractive={isGameActive && !isPaused}
                />
              </div>

              {/* Right Sidebar - Move History */}
              <div className="lg:col-span-1">
                <MoveHistory moves={gameState.moveHistory} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Dialog */}
      <PromotionDialog
        isOpen={showPromotionDialog}
        onClose={() => selectSquare(null)}
        onSelect={handlePromotion}
        color={gameState.turn}
      />

      {/* Game Result Modal */}
      <GameResultModal
        isOpen={!!gameResult}
        onClose={() => {}}
        result={gameResult}
        onNewGame={handleNewGame}
        onMainMenu={handleMainMenu}
      />
    </div>
  );
};

export default App;