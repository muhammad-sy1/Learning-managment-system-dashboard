import { useTableQuery } from "@/hooks/useTableQuery";
// import { usePermissionStore } from "@/hooks/usePermissionStore";
import { COURSES_TABLE_QUERY_KEY } from "..";
import { fetchMyCoursesClient, fetchAdminCoursesClient } from "../services/courses";
import useAuth from "@/modules/auth/store/authStore";

export const useGetCourses = () => {
    const user = useAuth((state) => state.user?.role);
    const isInstructor = user === "student";
    // console.log("user", user)
    return useTableQuery({
        queryKey: [COURSES_TABLE_QUERY_KEY, isInstructor ? "instructor" : "admin"],
        fetchFn: () => (isInstructor ? fetchMyCoursesClient() : fetchAdminCoursesClient()),
    });
};
