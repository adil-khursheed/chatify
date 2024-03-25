"use client";

import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { CreateChatDialog } from "@/components/create-chat-dialog";
import { useGetAllChats } from "@/features/chats/chatApi";
import ChatSkeleton from "@/components/chat-skeleton";
import ChatItem from "./ChatItem";
import { IChatItem } from "@/lib/interfaces/interfaces";

const ChatSidebar = () => {
  const { data: chats, isLoading: chatsLoading } = useGetAllChats();
  console.log(chats);

  return (
    <aside className="fixed h-full w-full block md:left-0 md:w-[420px] md:block bg-white dark:bg-slate-800 border-r border-r-violet-50 dark:border-r-slate-700">
      <header className="flex justify-between items-center border-b border-b-violet-100 dark:border-b-slate-700 px-2 py-3">
        <Image
          src={"/chatify-logo.svg"}
          alt="Chatify Logo"
          width={110}
          height={55}
        />
        <div className="flex items-center gap-3">
          <ModeToggle />
          <CreateChatDialog />
          <UserButton
            afterSignOutUrl="/sign-in"
            afterMultiSessionSingleSignOutUrl="/sign-in"
          />
        </div>
      </header>

      <div className="border-b border-b-violet-100 dark:border-b-slate-700 py-3 px-2">
        <div className="flex items-center gap-2 bg-violet-50 dark:bg-slate-900 rounded-sm text-slate-900 dark:text-violet-50 px-3">
          <Search />
          <Input
            placeholder="Search"
            type="text"
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div>
        {chatsLoading ? (
          <ChatSkeleton />
        ) : (
          <>
            {chats.data.length > 0 ? (
              <>
                {chats.data.map((chat: IChatItem) => (
                  <ChatItem key={chat._id} chat={chat} />
                ))}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
