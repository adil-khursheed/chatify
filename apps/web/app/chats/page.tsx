import EmptyState from "@/components/empty-state";
import React from "react";

const Chats = () => {
  return (
    <div className="hidden md:pl-[420px] h-full md:block">
      <EmptyState />
    </div>
  );
};

export default Chats;
