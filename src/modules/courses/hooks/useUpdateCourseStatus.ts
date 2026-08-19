import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COURSES_TABLE_QUERY_KEY } from "..";
import { updateCourseStatusClient } from "../services/courses";

export default function useUpdateCourseStatus() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, reason }: { id: number | string; status: string; reason?: string }) =>
            updateCourseStatusClient(id, status, reason),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: [COURSES_TABLE_QUERY_KEY] });
        },
    });
}
