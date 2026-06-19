import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/profileService";
import { PROFILE_QUERY_KEY } from "@/modules/auth";
import useAuth from "@/modules/auth/store/authStore";
import Cookies from "js-cookie";

export default function useGetProfile() {
  const Islogin = useAuth((state) => state.isLoggedInRoute);
   const token = Cookies.get("token");
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!token && !Islogin,
  });
}
