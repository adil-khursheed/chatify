"use server";

import apiClient from "@/axios/axios";
import { auth } from "@clerk/nextjs";

const { getToken } = auth();

export const getAllUsers = async (search: string) => {
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
};
