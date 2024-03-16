"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquareMore } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue } from "./ui/select";
import { SelectUser } from "./select-user";
import { useGetAllUsers } from "@/features/user/userApi";

export function CreateChatDialog() {
  const [isGroupChat, setIsGroupChat] = useState<boolean>(false);
  const { data: users } = useGetAllUsers();

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
              />
            </div>
          )}
          <div className="w-full">
            <SelectUser users={users?.data} isGroupChat={isGroupChat} />
          </div>
        </div>
        <DialogFooter className="w-full">
          <Button type="submit" className="w-full">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
