import { getToken } from "@/lib/getToken";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default apiClient;
