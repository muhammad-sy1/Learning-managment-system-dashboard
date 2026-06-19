"use client"
import Cookies from "js-cookie";
import { getStatistics } from "../services/statistics";
import { useTableQuery } from "@/hooks/useTableQuery";

export const useGetStatistics = () => {
  return useTableQuery({
    queryKey: ["home"],
    fetchFn: getStatistics,
    options: {
      enabled: !!Cookies.get("token"),
    },
  });
};
