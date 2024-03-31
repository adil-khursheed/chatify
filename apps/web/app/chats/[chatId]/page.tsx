"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";

import { useSocket } from "@/context/SocketProvider";

import { useGetChatById } from "@/features/chats/chatApi";
import {
  useGetMessagesByChatId,
  useSendMessage,
} from "@/features/messages/messageApi";

import { ChatEventEnum } from "@/lib/constants";
import { IChatMessage, IUser } from "@/lib/interfaces/interfaces";
import { getChatObjectMetaData } from "@/lib/utils";

import { useAuth } from "@clerk/nextjs";

import clsx from "clsx";

import Image from "next/image";
import Link from "next/link";

import React, { useCallback, useEffect, useState } from "react";

import { ChevronLeft, PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";

import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import Typing from "@/components/ui/typing";
import MessageItem from "./components/MessageItem";

interface IParams {
  chatId: string;
}

const ChatDetailsPage = ({ params }: { params: IParams }) => {
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);

  const { userId } = useAuth();
  const { socket } = useSocket();

  const { data: chat, isLoading: chatLoading } = useGetChatById(params.chatId);
  console.log(chat);

  const { data: messages, isLoading: messagesLoading } = useGetMessagesByChatId(
    params.chatId
  );
  console.log(messages);

  const { mutateAsync: sendMessageApi, isPending: sendMessagePending } =
    useSendMessage(params.chatId);

  const sendMessage = async () => {
    if (!chat.data._id || !socket) return;

    socket.emit(ChatEventEnum.STOP_TYPING_EVENT, chat.data._id);

    const formData = new FormData();

    if (message) {
      formData.append("content", message);
    }

    attachedFiles.map((file: File) => {
      formData.append("attachments", file);
    });
    try {
      const res = await sendMessageApi(formData);
      if (res) {
        setMessage("");
        setAttachedFiles([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick: MouseDownEvent = useCallback(
    (emojiObject: EmojiClickData) => {
      setMessage((prevInput) => prevInput + emojiObject.emoji);
      setToggleEmojiPicker(false);
    },
    []
  );

  useEffect(() => {
    if (chat?.data) {
      socket?.emit(ChatEventEnum.JOIN_CHAT_EVENT, chat?.data?._id);
    }
  }, []);

  return (
    <>
      {chatLoading ? (
        <Spinner />
      ) : (
        <section className="md:pl-[420px] bg-white dark:bg-slate-800 h-[100dvh] flex flex-col justify-start">
          <header className="flex items-center gap-4 bg-white dark:bg-slate-800 px-3 py-2 border-b border-b-violet-50 dark:border-b-slate-700">
            <Link href={"/chats"}>
              <ChevronLeft width={30} height={30} />
            </Link>
            <div className="flex-1">
              <div className="flex items-start gap-2">
                {chat?.data.isGroupChat ? (
                  <div className="relative w-12 h-12 flex justify-start items-center">
                    {chat?.data.participants
                      .slice(0, 3)
                      .map((participant: IUser, i: number) => (
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
                    src={getChatObjectMetaData(chat.data, userId!).avatar || ""}
                    alt="User profile pic"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}

                <div>
                  <p className="font-bold">
                    {getChatObjectMetaData(chat.data, userId!).title}
                  </p>
                  <small className="text-slate-500 dark:text-violet-100">
                    {getChatObjectMetaData(chat.data, userId!).description}
                  </small>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {messagesLoading ? (
              <Spinner />
            ) : (
              <>
                {isTyping ? <Typing /> : null}
                {messages.data.map((msg: IChatMessage) => (
                  <MessageItem
                    key={msg._id}
                    isOwnMessage={msg.sender.clerkId === userId}
                    isGroupChatMessage={chat.isGroupChat}
                    message={msg}
                  />
                ))}
              </>
            )}
          </div>

          <div className="relative flex items-center gap-2 p-3 border-t border-t-violet-50 dark:border-t-slate-700 bg-white dark:bg-slate-800">
            {toggleEmojiPicker && (
              <div className="absolute bottom-20">
                <EmojiPicker
                  style={{ width: "100%" }}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
            <div>
              <input
                hidden
                type="file"
                id="attachments"
                value={""}
                multiple
                max={5}
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachedFiles([...e.target.files]);
                  }
                }}
              />

              <label htmlFor="attachments" className="cursor-pointer">
                <PaperclipIcon width={24} height={24} />
              </label>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}>
              <SmileIcon />
            </div>
            <Input
              placeholder="Send a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={sendMessage} disabled={sendMessagePending}>
              <SendIcon />
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default ChatDetailsPage;
