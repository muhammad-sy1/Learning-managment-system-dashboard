import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseClient } from "../services/courses";
import { COURSES_TABLE_QUERY_KEY } from "..";

export default function useUpdateCourse() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: any) => updateCourseClient(id, payload),
        onSuccess() {
            client.invalidateQueries([COURSES_TABLE_QUERY_KEY]);
        },
    });
}
