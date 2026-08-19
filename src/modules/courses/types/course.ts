export interface ICourse {
    id: number;
    slug?: string;
    title: string;
    description?: string;
    status: string;
    level?: string;
    language?: string;
    is_free?: boolean;
    price?: number;
    instructor?: { id: number; name: string } | null;
    category?: string | null;
    total_enrollments?: number;
    average_rating?: number;
    submitted_at?: string | null;
    created_at?: string;
    // additional stats
    reviews_count?: number;
    total_duration?: number;
    total_earnings?: number;
    total_lessons?: number;
    active_students?: number;
}

export interface ICourseLesson {
    id: number;
    title: string;
    type: "video" | "pdf" | "quiz" | "article";
    duration?: number | null;
    video_url?: string | null;
    pdf_url?: string | null;
    article_content?: string | null;
    is_free_preview?: boolean;
    order_index?: number | null;
    created_at?: string;
}

export interface ICourseSection {
    id: number;
    title: string;
    order_index?: number | null;
    lessons: ICourseLesson[];
}

export interface ICreateCoursePayload {
    title: string;
    description?: string;
    status?: string;
    level?: string;
    language?: string;
    is_free?: boolean;
    price?: number | null;
    category_id?: number | null;
}

export interface ICreateCourseSectionPayload {
    title: string;
    order_index?: number | null;
}

export interface ICreateCourseLessonPayload {
    title: string;
    type: "video" | "pdf" | "quiz" | "article";
    video_url?: string | null;
    duration?: number | null;
    pdf_url?: string | null;
    article_content?: string | null;
    is_free_preview?: boolean;
    order_index?: number | null;
}

