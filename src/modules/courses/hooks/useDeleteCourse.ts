import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourseClient } from "../services/courses";
import { COURSES_TABLE_QUERY_KEY } from "..";

export default function useDeleteCourse() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => deleteCourseClient(id),
        onSuccess() {
            client.invalidateQueries([COURSES_TABLE_QUERY_KEY] as InvalidateQueryFilters);
        },
    });
}
