"use client";

import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { CreateChatDialog } from "@/components/create-chat-dialog";

const Sidebar = () => {
  return (
    <aside className="h-full">
      <header className="flex justify-between items-center border-b border-b-violet-100 dark:border-b-slate-700 px-2 py-3">
        <Image
          src={"/chatify-logo.svg"}
          alt="Chatify Logo"
          width={110}
          height={55}
        />
        <div className="flex items-center gap-3">
          <ModeToggle />
          {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
          <CreateChatDialog />
          {/* </HydrationBoundary> */}
          <UserButton />
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
    </aside>
  );
};

export default Sidebar;
