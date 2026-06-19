import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/utils/handleApiError";
import { updateUser } from "../services/users";
import { editUserSchema } from "../schemas/editUserSchema";
import { queryClient } from "@/lib/react-query/queryClient";
import { USERS_TABLE_QUERY_KEY } from "..";
import { jsonToFormData } from "@/lib/utils";

export default function useUserBlockStatus({
  configTranslate,
}: {
  configTranslate: Record<string, string>;
}) {
  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number | string;
      userData: Partial<editUserSchema>;
    }) => {
      const formData = jsonToFormData(userData);
      formData.append("_method", "PUT");
      return updateUser(id, formData);
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
