"use client";

import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Search } from "lucide-react";
import { useGetAllChats } from "@/features/chats/chatApi";

const HomePage = () => {
  const { data: chats, isLoading: chatsLoading } = useGetAllChats();

  console.log(chats);
  if (chatsLoading) return <h2>Loading...</h2>;
  return (
    <main className="w-full h-screen flex items-center gap-3 bg-violet-100 dark:bg-slate-900 p-4">
      <div className="w-full md:w-[600px] bg-white dark:bg-slate-800 rounded h-[99%] flex flex-col justify-start">
        <div className="flex justify-between items-center border-b border-b-violet-50 dark:border-b-slate-700 px-2 py-3">
          <Image src={"/logo.svg"} alt="Chatify Logo" width={120} height={80} />
          <div>
            <UserButton />
          </div>
        </div>

        <div className="border-b border-b-violet-50 dark:border-b-slate-700 py-3 px-2">
          <div className="flex items-center gap-2">
            <Search />
            <Input placeholder="Search" type="text" />
          </div>
        </div>
        {/* CHATS */}
      </div>
      <div className="w-full h-[99%] bg-white dark:bg-slate-800 rounded"></div>
      {/* CHAT MESSAGES */}
    </main>
  );
};

export default HomePage;
