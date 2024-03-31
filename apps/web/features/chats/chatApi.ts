import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/axios/axios";

export const useGetAllChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/chats");

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const useGetChatById = (chatId: string) => {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/chats/c/${chatId}`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const useCreateOrGetAOneOnOneChat = (receiverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const res = await apiClient.post(`/chats/c/${receiverId}`);

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });
};

export const useCreateAGroupChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; participants: string[] }) => {
      const res = await apiClient.post("/chats/group", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });
};
