import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword } from "../services/authService";
import { ApiError } from "@/utils/handleApiError";
import { useRouter } from "@/i18n/navigation";

export default function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("reset password successfully", {
        position: "top-center",
      });
      router.push(`/login`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
      console.error(error);
    },
  });
}
