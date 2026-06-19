import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USERS_TABLE_QUERY_KEY } from "..";
import { UserBlockStatusSchema } from "../schemas/userBlockStatusSchema";
import { updateUserBlockStatus } from "../services/users";

export interface UpdateUserBlockStatusParams {
  id: number | string;
  blocked_at: UserBlockStatusSchema;
}

export default function useUserBlockStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blocked_at }: UpdateUserBlockStatusParams) =>
      updateUserBlockStatus(id, blocked_at),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_TABLE_QUERY_KEY],
        exact: false,
      });
    },
  });
}
