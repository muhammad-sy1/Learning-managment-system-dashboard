import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/utils/handleApiError";
import { updateProfile } from "../services/profileService";
import { queryClient } from "@/lib/react-query/queryClient";
import { PROFILE_QUERY_KEY } from "@/modules/auth";
import useAuth from "@/modules/auth/store/authStore";
import { profileSchema } from "../schemas/profileSchema";
import { jsonToFormData } from "@/lib/utils";

export default function useUpdateProfile() {
  const setUser = useAuth((state) => state.setUser);
  return useMutation({
    mutationFn: (data: profileSchema) => {
      const formData = jsonToFormData(data);
      formData.append("_method", "PUT");
      return updateProfile(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [PROFILE_QUERY_KEY],
        exact: false,
      });
      setUser(data.user);
      toast.success("Profile updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
