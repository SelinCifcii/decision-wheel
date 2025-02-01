import React, { createContext, useContext, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

type Option = {
  username: string;
  text: string;
};

type SocketContextType = {
  socket: Socket | null;
  currentRoom: string | null;
  participants: string[];
  options: Option[];
  joinRoom: (roomCode: string, username: string) => void;
  addOption: (text: string, username: string) => void;
  createRoom: () => string;
  error: string | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Burada kendi socket sunucu adresinizi kullanın
    const newSocket = io('http://172.20.10.3:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('roomJoined', (data: { participants: string[]; options: Option[] }) => {
      setParticipants(data.participants);
      setOptions(data.options);
    });

    newSocket.on('optionAdded', (data: { options: Option[] }) => {
      setOptions(data.options);
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const createRoom = () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    if (socket) {
      socket.emit('createRoom', { roomCode });
      setCurrentRoom(roomCode);
    }
    return roomCode;
  };

  const joinRoom = (roomCode: string, username: string) => {
    if (socket) {
      socket.emit('joinRoom', { roomCode, username });
      setCurrentRoom(roomCode);
    }
  };

  const addOption = (text: string, username: string) => {
    if (socket && currentRoom) {
      socket.emit('addOption', { 
        roomCode: currentRoom, 
        option: { username, text }
      });
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      currentRoom,
      participants,
      options,
      joinRoom,
      addOption,
      createRoom,
      error,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};