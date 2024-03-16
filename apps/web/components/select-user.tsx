"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IUsers {
  users: {
    _id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    profilePhoto: string;
  }[];

  isGroupChat: boolean;
}

export const SelectUser: React.FC<IUsers> = ({ users, isGroupChat }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {value
            ? users.find((user) => user.username === value)?.username
            : isGroupChat
              ? "Select group participants..."
              : "Select user to chat..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search a user..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user._id}
                  value={user.username}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.username ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.firstName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
