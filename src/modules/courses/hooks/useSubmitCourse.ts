import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCourseClient } from "../services/courses";
import { COURSES_TABLE_QUERY_KEY } from "..";

export default function useSubmitCourse() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => submitCourseClient(id),
        onSuccess() {
            client.invalidateQueries([COURSES_TABLE_QUERY_KEY]);
        },
    });
}
