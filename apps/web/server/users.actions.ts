"use server";

import apiClient from "@/axios/axios";
import { auth } from "@clerk/nextjs";

const { getToken } = auth();

export const getAllUsers = async () => {
  try {
    const token = await getToken();
    const res = await apiClient.get("/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
