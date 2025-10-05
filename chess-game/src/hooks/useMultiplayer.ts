import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room, MultiplayerMove, GameResult, Player } from '../types/chess.types';
import { generateRoomCode, validateRoomCode } from '../utils/chess.utils';

export const useMultiplayer = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_LOVABLE_BACKEND_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      autoConnect: false,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('error', (message: string) => {
      setError(message);
      setIsLoading(false);
    });

    newSocket.on('room_created', (room: Room) => {
      setCurrentRoom(room);
      setPlayers(room.players);
      setIsHost(true);
      setIsLoading(false);
    });

    newSocket.on('room_joined', (room: Room) => {
      setCurrentRoom(room);
      setPlayers(room.players);
      setIsHost(false);
      setIsLoading(false);
    });

    newSocket.on('player_joined', (player: Player) => {
      setPlayers(prev => [...prev, player]);
    });

    newSocket.on('player_left', (playerId: string) => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    });

    newSocket.on('move_made', (move: MultiplayerMove) => {
      // Handle move in game store
      console.log('Move received:', move);
    });

    newSocket.on('game_ended', (result: GameResult) => {
      // Handle game end in game store
      console.log('Game ended:', result);
    });

    newSocket.on('draw_offered', (fromPlayerId: string) => {
      // Handle draw offer
      console.log('Draw offered by:', fromPlayerId);
    });

    newSocket.on('draw_declined', (fromPlayerId: string) => {
      // Handle draw decline
      console.log('Draw declined by:', fromPlayerId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const connect = useCallback(() => {
    if (socket && !isConnected) {
      socket.connect();
    }
  }, [socket, isConnected]);

  const disconnect = useCallback(() => {
    if (socket && isConnected) {
      socket.disconnect();
    }
  }, [socket, isConnected]);

  const createRoom = useCallback(async (): Promise<string> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to server');
    }

    setIsLoading(true);
    setError(null);

    const roomCode = generateRoomCode();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setError('Room creation timeout');
        reject(new Error('Room creation timeout'));
      }, 10000);

      socket.emit('create_room', roomCode);
      
      socket.once('room_created', () => {
        clearTimeout(timeout);
        resolve(roomCode);
      });

      socket.once('error', (message: string) => {
        clearTimeout(timeout);
        setError(message);
        reject(new Error(message));
      });
    });
  }, [socket, isConnected]);

  const joinRoom = useCallback(async (roomCode: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to server');
    }

    if (!validateRoomCode(roomCode)) {
      throw new Error('Invalid room code');
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setError('Join room timeout');
        reject(new Error('Join room timeout'));
      }, 10000);

      socket.emit('join_room', roomCode);
      
      socket.once('room_joined', () => {
        clearTimeout(timeout);
        resolve();
      });

      socket.once('error', (message: string) => {
        clearTimeout(timeout);
        setError(message);
        reject(new Error(message));
      });
    });
  }, [socket, isConnected]);

  const leaveRoom = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('leave_room', currentRoom.id);
      setCurrentRoom(null);
      setPlayers([]);
      setIsHost(false);
    }
  }, [socket, currentRoom]);

  const sendMove = useCallback((move: MultiplayerMove) => {
    if (socket && currentRoom) {
      socket.emit('make_move', move);
    }
  }, [socket, currentRoom]);

  const offerDraw = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('offer_draw', currentRoom.id);
    }
  }, [socket, currentRoom]);

  const resign = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('resign', currentRoom.id);
    }
  }, [socket, currentRoom]);

  const requestRematch = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('rematch', currentRoom.id);
    }
  }, [socket, currentRoom]);

  const getRoomCode = useCallback(() => {
    return currentRoom?.code || null;
  }, [currentRoom]);

  const getPlayerCount = useCallback(() => {
    return players.length;
  }, [players.length]);

  const isRoomFull = useCallback(() => {
    return players.length >= 2;
  }, [players.length]);

  const canStartGame = useCallback(() => {
    return isConnected && currentRoom && players.length === 2;
  }, [isConnected, currentRoom, players.length]);

  const getPlayerById = useCallback((playerId: string) => {
    return players.find(p => p.id === playerId);
  }, [players]);

  const getCurrentPlayer = useCallback(() => {
    // This would need to be determined based on game state
    return players[0] || null;
  }, [players]);

  const getOpponentPlayer = useCallback(() => {
    // This would need to be determined based on game state
    return players[1] || null;
  }, [players]);

  return {
    // Connection state
    socket,
    isConnected,
    isLoading,
    error,
    
    // Room state
    currentRoom,
    players,
    isHost,
    
    // Connection actions
    connect,
    disconnect,
    
    // Room actions
    createRoom,
    joinRoom,
    leaveRoom,
    
    // Game actions
    sendMove,
    offerDraw,
    resign,
    requestRematch,
    
    // Utilities
    getRoomCode,
    getPlayerCount,
    isRoomFull,
    canStartGame,
    getPlayerById,
    getCurrentPlayer,
    getOpponentPlayer,
    
    // Error handling
    clearError: () => setError(null),
  };
};