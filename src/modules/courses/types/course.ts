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
    thumbnail?: string | null;
    promo_video?: string | null;
    instructor?: { id: number; name: string; avatar?: string | null; courses_count?: number; total_students?: number } | null;
    category?: { id: number; name: string } | string | null;
    what_you_learn?: string[];
    requirements?: string[];
    has_certificate?: boolean;
    published_at?: string | null;
    sections?: ICourseSection[];
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


// ──── Quiz Engine Types ────────────────────────────────────────────────────

export type QuizType = "final_exam" | "section_quiz" | "surprise";
export type QuestionType = "mcq" | "true_false";

export interface IQuizOption {
    id: number;
    text: string;
    is_correct: boolean;
}

export interface IQuizQuestion {
    id: number;
    text: string;
    type: QuestionType;
    explanation?: string | null;
    options: IQuizOption[];
}

export interface IQuiz {
    id: number;
    type: QuizType;
    title?: string | null;
    passing_score?: number | null;
    time_limit_seconds?: number | null;
    max_attempts?: number | null;
    pool_size?: number | null;
    section_id?: number | null;
    lesson_id?: number | null;
    questions?: IQuizQuestion[];
}

export interface ICreateQuizPayload {
    type: QuizType;
    title?: string;
    passing_score?: number;
    time_limit_seconds?: number;
    max_attempts?: number;
    pool_size?: number;
    section_id?: number;
    trigger_second?: number;
}

export interface IQuizOptionPayload {
    text: string;
    is_correct: boolean;
}

export interface ICreateQuizQuestionPayload {
    text: string;
    type: QuestionType;
    explanation?: string;
    options: IQuizOptionPayload[];
}
