"use server";

import apiClient from "@/axios/axios";
import { auth } from "@clerk/nextjs";

const { getToken } = auth();

export const getAllChats = async () => {
  const token = await getToken();
  const res = await apiClient.get("/chats", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return res.data;
};

// export const createAOneOnOneChat = async (receiverId: string) => {
//   const token = await getToken();
//   try {
//     const res = await apiClient.post(
//       `/chats/${receiverId}`,
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       }
//     );

//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
