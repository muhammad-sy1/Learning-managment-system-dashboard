import { queryClient } from "@/lib/react-query/queryClient";
import { jsonToFormData } from "@/lib/utils";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_TABLE_QUERY_KEY } from "..";
import { addUserSchema } from "../schemas/addUserSchema";
import { createUser } from "../services/users";

export default function useCreateUser({
  configTranslate: configTranslate,
}: {
  configTranslate: Record<string, string>;
}) {
  return useMutation({
    mutationFn: (data: addUserSchema) => {
      const formData = jsonToFormData(data);
      return createUser(formData);
    },
    onSuccess: () => {
      toast.success(configTranslate.create);
      queryClient.invalidateQueries({
        queryKey: [USERS_TABLE_QUERY_KEY],
      });
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
