import { getAllChats } from "@/server/chats.actions";
import { useQuery } from "@tanstack/react-query";

export const useGetAllChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getAllChats,
  });
};
