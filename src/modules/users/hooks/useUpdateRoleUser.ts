import { queryClient } from "@/lib/react-query/queryClient";
import { jsonToFormData } from "@/lib/utils";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_TABLE_QUERY_KEY } from "..";
import { updateUser } from "../services/users";
import { editRoleUserSchema } from "../schemas/editRoleUserSchema";

export default function useUpdateRoleUser({
  configTranslate,
}: {
  configTranslate: Record<string, string>;
}) {
  return useMutation({
    mutationFn: ({
      userData,
    }: {
      userData: Partial<editRoleUserSchema>;
    }) => {
      const formData = jsonToFormData(userData);
      return updateUser(formData);
    },
    onSuccess: () => {
      toast.success(configTranslate.update);
      queryClient.invalidateQueries({
        queryKey: [USERS_TABLE_QUERY_KEY],
        exact: false,
      });
    },

    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
