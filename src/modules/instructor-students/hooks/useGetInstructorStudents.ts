import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchInstructorStudentsClient } from "../services";

export const INSTRUCTOR_STUDENTS_QUERY_KEY = "instructor-students";

export function useGetInstructorStudents() {
  return useTableQuery({
    queryKey: [INSTRUCTOR_STUDENTS_QUERY_KEY],
    fetchFn: (filters) => fetchInstructorStudentsClient(filters),
  });
}
