import { ApiError } from "@/utils/handleApiError";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrentUser } from "../services/authService";
import useAuth from "../store/authStore";

export default function useGetCurrentUser() {
    const token = useAuth((state) => state.user?.id);

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        onError: (error: ApiError) => {
            console.error("Error fetching current user:", error);
        },
    });
}
