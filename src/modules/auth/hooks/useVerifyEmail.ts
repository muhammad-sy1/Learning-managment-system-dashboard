import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { verifyEmailService } from "../services/authService";
import useAuth from "../store/authStore";

export default function useVerifyEmail() {
    const router = useRouter();
    const login = useAuth((state) => state.login);
    const t = useTranslations("Auth");

    return useMutation({
        mutationFn: verifyEmailService,
        onSuccess: () => {
            toast.success(t("verifyEmail.success"), {
                position: "top-center",
            });

            // Navigate to dashboard or login page
            router.push("/");
        },
        onError: (error: ApiError) => {
            toast.error(error.message || t("verifyEmail.error"));
            console.error(error);
        },
    });
}
