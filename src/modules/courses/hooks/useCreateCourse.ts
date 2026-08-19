import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseClient } from "../services/courses";
import { COURSES_TABLE_QUERY_KEY } from "..";
import { useTranslations } from "next-intl";

export default function useCreateCourse() {
    const client = useQueryClient();
    const t = useTranslations("Dashboard.CoursesPage");

    return useMutation({
        mutationFn: (payload: any) => createCourseClient(payload),
        onSuccess() {
            client.invalidateQueries([COURSES_TABLE_QUERY_KEY]);
        },
        onError() {
            // could show toast using translations
        },
    });
}
