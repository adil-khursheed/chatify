import { IChatItem } from "@/lib/interfaces/interfaces";
import { getChatObjectMetaData } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const ChatItem: React.FC<{ chat: IChatItem }> = ({ chat }) => {
  const { userId } = useAuth();
  const router = useRouter();

  const handleChatClick = useCallback(() => {
    router.push(`/chats/${chat._id}`);
  }, [chat._id]);

  return (
    <div
      className="flex items-center gap-3 py-3 px-2 cursor-pointer"
      onClick={handleChatClick}>
      <div>
        {chat.isGroupChat ? (
          <div></div>
        ) : (
          <Image
            src={getChatObjectMetaData(chat, userId!).avatar || ""}
            alt="User profile pic"
            width={50}
            height={50}
            className="rounded-full"
          />
        )}
      </div>
      <div>
        <p>{getChatObjectMetaData(chat, userId!).title}</p>
        <div>
          {chat.lastMessage && chat.lastMessage.attachments.length > 0 ? (
            <Paperclip />
          ) : null}
          <small>{getChatObjectMetaData(chat, userId!).lastMessage}</small>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
