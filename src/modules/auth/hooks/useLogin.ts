
import { navigateTo } from "@/lib/router";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginService } from "../services/authService";
import useAuth from "../store/authStore";
import { useTranslations } from "next-intl";
import { usePermissionStore } from "@/hooks/usePermissionStore";

export default function useLogin() {
  const login = useAuth((state) => state.login);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const t = useTranslations("Auth.login");

  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      toast.success(t("loginsuccess"));
      if (data) {
        login(data);

        if (data.user?.permissions) {
          usePermissionStore.getState().setPermissions(data.user.permissions);
          usePermissionStore.getState().setUser(data.user);
        }
      }

      navigateTo(next ?? "/");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
