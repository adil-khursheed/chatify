import { useQuery } from "@tanstack/react-query";
import apiClient from "@/axios/axios";
import { getToken } from "@/lib/getToken";

export const useGetAllUsers = (search: string) => {
  return useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const token = await getToken();
      try {
        const res = await apiClient.get(`/users?search=${search}`, {
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
