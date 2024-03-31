"use client";

import Sidebar from "@/components/sidebar";
import ChatSidebar from "./components/ChatSidebar";
import { useSocket } from "@/context/SocketProvider";
import { useEffect, useState } from "react";
import { ChatEventEnum } from "@/lib/constants";
import { useGetAllChats } from "@/features/chats/chatApi";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket, setIsConnected } = useSocket();

  const { data: chats, isLoading: chatsLoading } = useGetAllChats();

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(ChatEventEnum.CONNECTED_EVENT, onConnect);

    return () => {
      socket.off(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
    };
  }, [socket, chats?.data]);
  return (
    <Sidebar>
      <div className="h-full">
        <ChatSidebar chats={chats?.data} chatsLoading={chatsLoading} />
        {children}
      </div>
    </Sidebar>
  );
}
