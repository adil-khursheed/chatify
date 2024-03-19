"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquareMore, XIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useGetAllUsers } from "@/features/user/userApi";
import Image from "next/image";
import useDebounce from "@/hooks/useDebounce";
import { IUser } from "@/lib/interfaces/interfaces";
import { useCreateOrGetAOneOnOneChat } from "@/features/chats/chatApi";
import { toast } from "sonner";

export function CreateChatDialog() {
  const [groupName, setGroupName] = useState("");
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [search, setSearch] = useState("");
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  const userModalRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const debouncedSearchTerm = useDebounce(search, 500);

  const { data: users } = useGetAllUsers(debouncedSearchTerm || "");
  const { mutateAsync: createAOneOnOneChat, isPending: creatingOneOnOneChat } =
    useCreateOrGetAOneOnOneChat(selectedUserId || "");

  const handleCreateAOneOnOneChat = async () => {
    if (!selectedUserId) return toast("Please select a user!");

    try {
      const res = await createAOneOnOneChat();

      if (res.statusCode === "200") {
        toast("Chat with selected user already exists!");
        return;
      }

      toast("New chat has been created.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroupChat = async () => {};

  const handleSelectedUsers = (userId: string) => {
    if (isGroupChat && !groupParticipants.includes(userId)) {
      setSelectedUserId("");
      setGroupParticipants([...groupParticipants, userId]);
      setUserModal(false);
    }

    if (!isGroupChat) {
      setGroupParticipants([]);
      setSelectedUserId(userId);
      setUserModal(false);
    }
  };

  const onUserModalClose: () => void = () => {
    setUserModal(false);
  };

  useEffect(() => {
    const handleModalOutsideClick: EventListener = (e) => {
      if (
        userModalRef.current &&
        !userModalRef?.current?.contains(e.target as Node)
      ) {
        onUserModalClose();
      }
    };

    document.addEventListener("click", handleModalOutsideClick);

    return () => {
      document.removeEventListener("click", handleModalOutsideClick);
    };
  }, [onUserModalClose, userModalRef]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MessageSquareMore className="w-5 h-auto text-slate-900 dark:text-violet-50 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-3">Create a new chat</DialogTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="create-chat"
              checked={isGroupChat}
              onCheckedChange={setIsGroupChat}
            />
            <Label htmlFor="create-chat">is it a group chat?</Label>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {isGroupChat && (
            <div className="w-full">
              <Input
                id="group-name"
                placeholder="Enter a group name"
                className="w-full"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}
          <div className="relative w-full" ref={userModalRef}>
            <Input
              placeholder={
                isGroupChat
                  ? "Select group chat participants..."
                  : "Select a user to chat..."
              }
              onFocus={() => setUserModal(true)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {userModal ? (
              <div className="w-full absolute left-0 right-0 -bottom-48 z-20 bg-white dark:bg-slate-800 py-2 rounded">
                {users?.data.length > 0 ? (
                  users?.data?.slice(0, 4)?.map((user: IUser) => (
                    <div key={user._id} className="w-full">
                      <Button
                        variant={"ghost"}
                        className="flex items-center justify-start gap-3 w-full"
                        onClick={() => handleSelectedUsers(user._id)}>
                        <Image
                          alt={`${user.firstName}'s profile photo`}
                          src={user.profilePhoto}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <p>
                          {user.firstName} {user.lastName}
                        </p>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 text-sm w-full py-2">
                    <p>No users found!</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {selectedUserId ? (
          <div className="flex">
            {users?.data
              ?.filter((user: IUser) => selectedUserId === user._id)
              ?.map((selectedUser: IUser) => (
                <div
                  key={selectedUser._id}
                  className="flex items-center gap-3 text-xs bg-violet-50 dark:bg-slate-700 rounded-full py-2 px-3">
                  <Image
                    src={selectedUser.profilePhoto}
                    alt={`${selectedUser.firstName}'s profile photo`}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <XIcon
                    width={15}
                    height={15}
                    onClick={() => setSelectedUserId("")}
                    className="cursor-pointer"
                  />
                </div>
              ))}
          </div>
        ) : null}

        {groupParticipants.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {users?.data
              ?.filter((user: IUser) => groupParticipants.includes(user._id))
              ?.map((selectedUser: IUser) => (
                <div
                  key={selectedUser._id}
                  className="flex items-center gap-3 text-xs bg-violet-50 dark:bg-slate-700 rounded-full py-2 px-3">
                  <Image
                    src={selectedUser.profilePhoto}
                    alt={`${selectedUser.firstName}'s profile photo`}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <XIcon
                    width={15}
                    height={15}
                    onClick={() => {
                      setGroupParticipants(
                        groupParticipants.filter(
                          (participant) => participant !== selectedUser._id
                        )
                      );
                    }}
                    className="cursor-pointer"
                  />
                </div>
              ))}
          </div>
        ) : null}
        <DialogFooter className="w-full">
          <Button
            type="button"
            className="w-full"
            disabled={creatingOneOnOneChat}
            onClick={
              isGroupChat ? handleCreateGroupChat : handleCreateAOneOnOneChat
            }>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
