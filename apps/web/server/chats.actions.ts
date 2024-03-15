"use server";

import axios from "@/axios/axios";
import { useAuth } from "@clerk/nextjs";

const { getToken } = useAuth();

export const getAllChats = async () => {
  try {
    const token = await getToken();
    const res = await axios.get("/chats", {
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
