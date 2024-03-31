import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IChatItem } from "./interfaces/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChatObjectMetaData(chat: IChatItem, loggedInUser: string) {
  const lastMessage = chat?.lastMessage?.content
    ? chat.lastMessage?.content
    : chat?.lastMessage
      ? `${chat.lastMessage?.attachments?.length} attachment${
          chat.lastMessage?.attachments?.length > 1 ? "s" : ""
        }`
      : "No messages yet";

  if (chat?.isGroupChat) {
    return {
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name,
      description: `${chat.participants.length} members in the chat`,
      lastMessage: chat.lastMessage
        ? chat?.lastMessage?.sender?.username + ": " + lastMessage
        : lastMessage,
    };
  } else {
    const participant = chat?.participants?.find(
      (p) => p.clerkId !== loggedInUser
    );

    return {
      avatar: participant?.profilePhoto,
      title: participant?.firstName + " " + participant?.lastName,
      description: participant?.username,
      lastMessage,
    };
  }
}
