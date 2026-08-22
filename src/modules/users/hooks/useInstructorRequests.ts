import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveInstructorClient,
  fetchPendingInstructorsClient,
  rejectInstructorClient,
} from "../services/instructorRequests";

export const INSTRUCTOR_REQUESTS_QUERY_KEY = "instructor-requests";

export function useGetInstructorRequests(enabled: boolean) {
  return useQuery({
    queryKey: [INSTRUCTOR_REQUESTS_QUERY_KEY],
    queryFn: fetchPendingInstructorsClient,
    enabled,
    retry: false,
  });
}

export function useApproveInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => approveInstructorClient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [INSTRUCTOR_REQUESTS_QUERY_KEY] });
    },
  });
}

export function useRejectInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason: string }) =>
      rejectInstructorClient(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [INSTRUCTOR_REQUESTS_QUERY_KEY] });
    },
  });
}
