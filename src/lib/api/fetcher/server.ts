import { cookies } from "next/headers";
import { fetchWrapper } from "./fetcher";

const fetcherServer = fetchWrapper.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

fetcherServer.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("token")?.value;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

fetcherServer.interceptors.response.use(async (data, response) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`API Response [${response.status}]:`, data);
  }
  return data;
});

fetcherServer.interceptors.error.use(async (error) => {
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  return Promise.reject(error);
});

export default fetcherServer;
