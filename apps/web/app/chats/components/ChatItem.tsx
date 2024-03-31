import { IChatItem } from "@/lib/interfaces/interfaces";
import { getChatObjectMetaData } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import clsx from "clsx";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import moment from "moment";

const ChatItem: React.FC<{ chat: IChatItem }> = ({ chat }) => {
  const { userId } = useAuth();
  const router = useRouter();

  const handleChatClick = useCallback(() => {
    router.push(`/chats/${chat._id}`);
  }, [chat, router]);

  return (
    <div
      className="flex items-center gap-3 py-3 px-2 cursor-pointer"
      onClick={handleChatClick}>
      <div>
        {chat.isGroupChat ? (
          <div className="relative w-12 h-12 flex justify-start items-center">
            {chat.participants.slice(0, 3).map((participant, i) => (
              <Image
                key={participant._id}
                src={participant.profilePhoto}
                alt="group profile photo"
                width={28}
                height={28}
                className={clsx(
                  "border-[1px] border-white dark:border-slate-800 rounded-full absolute",
                  i === 0
                    ? "left-0 z-[3]"
                    : i === 1
                      ? "left-2.5 z-[2]"
                      : i === 2
                        ? "left-[18px] z-[1]"
                        : ""
                )}
              />
            ))}
          </div>
        ) : (
          <Image
            src={getChatObjectMetaData(chat, userId!).avatar || ""}
            alt="User profile pic"
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="truncate">{getChatObjectMetaData(chat, userId!).title}</p>
        <div className="w-full inline-flex items-center text-left">
          {chat.lastMessage && chat.lastMessage.attachments.length > 0 ? (
            <Paperclip className="w-3 h-3 text-slate-400 dark:text-white/50 mr-2 flex" />
          ) : null}
          <small className="text-slate-400 dark:text-white/50 text-sm truncate text-ellipsis inline-flex items-center">
            {getChatObjectMetaData(chat, userId!).lastMessage}
          </small>
        </div>
      </div>
      <div className="h-full text-sm text-slate-400 dark:text-white/50 flex items-end">
        <small>
          {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
        </small>
      </div>
    </div>
  );
};

export default ChatItem;
