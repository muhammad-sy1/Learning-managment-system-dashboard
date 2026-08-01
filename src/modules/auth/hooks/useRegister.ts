import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { registerService } from "../services/authService";
import useAuth from "../store/authStore";
import { usePermissionStore } from "@/hooks/usePermissionStore";

export default function useRegister() {
    const router = useRouter();
    const login = useAuth((state) => state.login);
    const t = useTranslations("Auth.register");

    return useMutation({
        mutationFn: registerService,
        onSuccess: (data) => {
            toast.success(t("registrationSuccess"), {
                position: "top-center",
            });

            if (data) {
                login(data);

                if (data.user?.permissions) {
                    usePermissionStore.getState().setPermissions(data.user.permissions);
                    usePermissionStore.getState().setUser(data.user);
                }
            }

            router.push("/");
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
            console.error(error);
        },
    });
}
