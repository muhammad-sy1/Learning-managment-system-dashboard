import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectCourseClient } from "../services/courses";
import { COURSES_TABLE_QUERY_KEY } from "..";

export default function useRejectCourse() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: number | string }) => rejectCourseClient(id),
        onSuccess() {
            client.invalidateQueries([COURSES_TABLE_QUERY_KEY]);
        },
    });
}
