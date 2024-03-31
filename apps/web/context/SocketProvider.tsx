"use client";

import { getToken } from "@/lib/getToken";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

interface SocketProviderProps {
  children?: ReactNode;
}

const getSocket = async () => {
  const token = await getToken();

  const socketURI = process.env.NEXT_PUBLIC_SOCKET_URI || "";

  return io(socketURI, {
    withCredentials: true,
    auth: { token },
  });
};

const SocketContext = createContext<{
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}>({
  socket: null,
  isConnected: false,
  setIsConnected() {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const newSocket = await getSocket();
        setSocket(newSocket);
        setIsConnected(true);
      } catch (error) {
        console.log("Error initializing socket: ", error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected, setIsConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
