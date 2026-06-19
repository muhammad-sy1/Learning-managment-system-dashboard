import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { sendVerificationCode } from "../services/authService";

export default function useForgotPassword() {
  const router = useRouter();
  const t = useTranslations("Auth");
  return useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data, variables) => {
      toast.success(t("verifyCode.otp_email_sent"), {
        position: "top-center",
      });
      router.push(`/verify-code?email=${variables.email}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
      console.error(error);
    },
  });
}
