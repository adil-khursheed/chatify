import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/server/users.actions";

export const useGetAllUsers = (search: string) => {
  return useQuery({
    queryKey: ["users", search],
    queryFn: async () => await getAllUsers(search),
  });
};
