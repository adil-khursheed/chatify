"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/server/users.actions";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};
