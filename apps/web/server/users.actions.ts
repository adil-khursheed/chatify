"use server";

import axios from "@/axios/axios";
import { useAuth } from "@clerk/nextjs";

const { getToken } = useAuth();

export const getAllUsers = async () => {
  try {
    const token = await getToken();
    const res = await axios.get("/users", {
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
