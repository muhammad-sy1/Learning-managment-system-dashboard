export interface IInstructorStudentRecord {
  student: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  course: {
    id: number;
    title: string;
  };
  completion_percentage: string;
  enrolled_at: string;
  last_accessed_at: string | null;
}

export interface IInstructorStudentsMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface IInstructorStudentsResponse {
  data: IInstructorStudentRecord[];
  meta: IInstructorStudentsMeta;
}
