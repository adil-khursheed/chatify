"use server";

import { auth } from "@clerk/nextjs";

export const getToken = async () => {
  const { getToken } = auth();
  const token = await getToken();

  return token;
};
