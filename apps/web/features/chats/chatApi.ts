import { createOrGetAOneOnOneChat, getAllChats } from "@/server/chats.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getAllChats,
  });
};

export const useCreateOrGetAOneOnOneChat = (receiverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await createOrGetAOneOnOneChat(receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });
};
