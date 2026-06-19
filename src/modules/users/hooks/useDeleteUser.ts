"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/utils/handleApiError";
import { deleteUser } from "../services/users";
import { USERS_TABLE_QUERY_KEY } from "..";
import { queryClient } from "@/lib/react-query/queryClient";

export default function useDeleteUser({ configTranslate }: { configTranslate: Record<string, string> }) {
  return useMutation({
    mutationFn: (id: number | string) => deleteUser(id),
    onSuccess: () => {
      toast.success(configTranslate.delete);
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
