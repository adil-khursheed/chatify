"use client";

import EmptyState from "@/components/empty-state";
import useChat from "@/hooks/useChat";
import clsx from "clsx";
import React from "react";

const Chats = () => {
  const { isOpen } = useChat();
  return (
    <div
      className={clsx(
        "md:pl-[420px] h-full md:block",
        isOpen ? "block" : "hidden"
      )}>
      <EmptyState />
    </div>
  );
};

export default Chats;
