"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketProvider";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const HomePage = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, messages } = useSocket();

  const onMessageSubmit = () => {
    sendMessage(message);
    setMessage("");
  };
  return (
    <div className="max-w-5xl mx-auto p-5">
      <UserButton />
      <div>
        <h1>All messages will appear here</h1>
        <div>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={onMessageSubmit}>Send</Button>
      </div>
    </div>
  );
};

export default HomePage;
