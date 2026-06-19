import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkVerificationCode } from "../services/authService";
import { ApiError } from "@/utils/handleApiError";
import { useRouter } from "@/i18n/navigation";

export default function useVerifyCode() {
  const router = useRouter();

  return useMutation({
    mutationFn: checkVerificationCode,
    onSuccess: (data, variables) => {
      if (data?.is_valid) {
        toast.success("Verification code is valid", {
          position: "top-center",
        });
        router.push(
          `/reset-password?email=${variables.email}&code=${variables.code}`
        );
      } else {
        toast.error("Verification code is invalid", {
          position: "top-center",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
      console.error(error);
    },
  });
}
