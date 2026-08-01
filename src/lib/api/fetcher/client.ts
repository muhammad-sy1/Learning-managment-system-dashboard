import Cookies from "js-cookie";
import { fetchWrapper } from "./fetcher";
import useAuth from "@/modules/auth/store/authStore";
import { toast } from "sonner";
import { ApiError } from "@/utils/handleApiError";

function createApiClient(baseURL?: string) {
  const client = fetchWrapper.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    const locale = Cookies.get("NEXT_LOCALE") || "ar";

    config.headers = {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      "Accept-Language": locale,
    };

    return config;
  });

  client.interceptors.response.use(async (data, response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response [status: ${response.status}]:`, data);
    }
    return data;
  });

  client.interceptors.error.use(async (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }

    if (
      error.response?.status === 401 &&
      !error.request?.url?.includes("login")
    ) {
      useAuth.getState().logout();
      toast.info("Session expired. Please log in again.");
    }

    return Promise.reject(new ApiError(error.message, error.data?.errors));
  });

  return client;
}

const fetcherClient = createApiClient(process.env.NEXT_PUBLIC_API_URL);

export const authFetcherClient = createApiClient(
  process.env.NEXT_PUBLIC_API_AUTH_URL || process.env.NEXT_PUBLIC_API_URL
);

export default fetcherClient;
