import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { resendVerificationService } from "../services/authService";

export default function useResendVerification() {
    const t = useTranslations("Auth");

    return useMutation({
        mutationFn: resendVerificationService,
        onSuccess: () => {
            toast.success(t("verifyEmail.resent"), {
                position: "top-center",
            });
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
            console.error(error);
        },
    });
}
