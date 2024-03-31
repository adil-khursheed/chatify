import apiClient from "@/axios/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMessagesByChatId = (chatId: string) => {
  return useQuery({
    queryKey: ["message"],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/messages/${chatId}`);

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiClient.post(`/messages/${chatId}`, data);

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["message"],
      });
    },
  });
};
