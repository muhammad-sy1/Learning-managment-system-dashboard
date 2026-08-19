import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveCourseClient } from "../services/courses";
import { COURSES_TABLE_QUERY_KEY } from "..";

export default function useApproveCourse() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => approveCourseClient(id),
        onSuccess() {
            client.invalidateQueries([COURSES_TABLE_QUERY_KEY]);
        },
    });
}
