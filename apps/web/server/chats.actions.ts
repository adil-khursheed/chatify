"use server";

import axios from "@/axios/axios";
import { auth } from "@clerk/nextjs";

const { getToken } = auth();

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

export const createOrGetAOneOnOneChat = async (receiverId: string) => {
  try {
    const token = await getToken();
    const res = await axios.post(
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
};
