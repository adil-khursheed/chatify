import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/axios/axios";
import { getToken } from "@/lib/getToken";

export const useGetAllChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const token = await getToken();
      try {
        const res = await apiClient.get("/chats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

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
      const token = await getToken();
      try {
        const res = await apiClient.post(
          `/chats/${receiverId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

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
