import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import {
    ICourse,
    ICreateCourseLessonPayload,
    ICreateCoursePayload,
    ICreateCourseSectionPayload,
    ICreateQuizPayload,
    ICreateQuizQuestionPayload,
    IQuiz,
} from "../types/course";

export async function fetchMyCoursesClient() {
    try {
        const response = await fetcherClient.get<{ data: ICourse[]; meta?: any }>(
            endpoints.getMyCourses,
        );
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function fetchAdminCoursesClient() {
    try {
        const response = await fetcherClient.get<{ data: ICourse[]; meta?: any }>(
            endpoints.getAdminCourses,
        );
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function fetchCourseDetailsClient(
    id: number | string,
    role?: "admin" | "student",
) {
    try {
        return await fetcherClient.get<{ data: ICourse }>(
            role === "student"
                ? endpoints.getInstructorCourseDetails(id)
                : endpoints.getCourseDetails(id),
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function uploadLessonVideoClient(lessonId: number | string, file: File) {
    const formData = new FormData();
    formData.append("lesson_id", String(lessonId));
    formData.append("video", file);
    try {
        return await fetcherClient.post(endpoints.uploadLessonVideo, formData);
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function createVideoLessonClient(
    sectionId: number | string,
    payload: ICreateCourseLessonPayload,
    file: File,
    onStep?: (step: "creating" | "uploading" | "finalizing") => void,
) {
    try {
        onStep?.("creating");
        const createdLesson = await createCourseLessonClient(sectionId, {
            ...payload,
            // The API requires a video URL during creation; replace this after upload.
            video_url: payload.video_url || "pending-upload",
        });
        const lessonId = (createdLesson as { data?: { id?: number } }).data?.id;

        if (!lessonId) {
            throw new Error("The lesson was created without an ID.");
        }

        onStep?.("uploading");
        const uploadedVideo = await uploadLessonVideoClient(lessonId, file);
        const uploadData = (uploadedVideo as {
            data?: { url?: string };
        }).data;

        if (!uploadData?.url) {
            throw new Error("The uploaded video response has no URL.");
        }

        onStep?.("finalizing");
        return updateCourseLessonClient(lessonId, {
            ...payload,
            video_url: uploadData.url,
        });
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function replaceVideoLessonClient(
    lessonId: number | string,
    payload: ICreateCourseLessonPayload,
    file: File,
    onStep?: (step: "uploading" | "finalizing") => void,
) {
    try {
        onStep?.("uploading");
        const uploadedVideo = await uploadLessonVideoClient(lessonId, file);
        const uploadData = (uploadedVideo as {
            data?: { url?: string };
        }).data;

        if (!uploadData?.url) {
            throw new Error("The uploaded video response has no URL.");
        }

        onStep?.("finalizing");
        return updateCourseLessonClient(lessonId, {
            ...payload,
            video_url: uploadData.url,
        });
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function uploadLessonPdfClient(lessonId: number | string, file: File) {
    const formData = new FormData();
    formData.append("lesson_id", String(lessonId));
    formData.append("pdf", file);
    try {
        return await fetcherClient.post(endpoints.uploadLessonPdf, formData);
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function createPdfLessonClient(
    sectionId: number | string,
    payload: ICreateCourseLessonPayload,
    file: File,
) {
    try {
        const createdLesson = await createCourseLessonClient(sectionId, {
            ...payload,
            pdf_url: payload.pdf_url || "pending-upload",
        });
        const lessonId = (createdLesson as { data?: { id?: number } }).data?.id;

        if (!lessonId) {
            throw new Error("The lesson was created without an ID.");
        }

        const uploadedPdf = await uploadLessonPdfClient(lessonId, file);
        const pdfUrl = (uploadedPdf as { data?: { url?: string } }).data?.url;

        if (!pdfUrl) {
            throw new Error("The uploaded PDF response has no URL.");
        }

        return updateCourseLessonClient(lessonId, {
            ...payload,
            pdf_url: pdfUrl,
        });
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function uploadCoursePromoVideoClient(courseId: number | string, file: File) {
    const formData = new FormData();
    formData.append("course_id", String(courseId));
    formData.append("video", file);
    try {
        return await fetcherClient.post(endpoints.uploadCoursePromoVideo, formData);
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function uploadCourseThumbnailClient(courseId: number | string, file: File) {
    const formData = new FormData();
    formData.append("course_id", String(courseId));
    formData.append("image", file);
    try {
        return await fetcherClient.post(endpoints.uploadCourseThumbnail, formData);
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function createCourseSectionClient(courseId: number | string, payload: ICreateCourseSectionPayload) {
    try {
        const response = await fetcherClient.post(endpoints.createCourseSection(courseId), payload);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function updateCourseSectionClient(sectionId: number | string, payload: ICreateCourseSectionPayload) {
    try {
        const response = await fetcherClient.put(endpoints.updateCourseSection(sectionId), payload);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function deleteCourseSectionClient(sectionId: number | string) {
    try {
        const response = await fetcherClient.delete(endpoints.deleteCourseSection(sectionId));
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function createCourseLessonClient(sectionId: number | string, payload: ICreateCourseLessonPayload) {
    try {
        const response = await fetcherClient.post(endpoints.createCourseLesson(sectionId), payload);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function updateCourseLessonClient(lessonId: number | string, payload: ICreateCourseLessonPayload) {
    try {
        const response = await fetcherClient.put(endpoints.updateCourseLesson(lessonId), payload);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function deleteCourseLessonClient(lessonId: number | string) {
    try {
        const response = await fetcherClient.delete(endpoints.deleteCourseLesson(lessonId));
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function createCourseClient(payload: ICreateCoursePayload) {
    try {
        const response = await fetcherClient.post(endpoints.createCourse, payload);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function updateCourseClient(id: number | string, payload: ICreateCoursePayload) {
    try {
        const response = await fetcherClient.put(`${endpoints.updateCourse}${id}`, payload);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function deleteCourseClient(id: number | string) {
    try {
        const response = await fetcherClient.delete(`${endpoints.deleteCourse}${id}`);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function submitCourseClient(id: number | string) {
    try {
        const response = await fetcherClient.post(endpoints.submitCourse(id));
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function approveCourseClient(id: number | string) {
    try {
        const response = await fetcherClient.post(endpoints.approveCourse(id));
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function rejectCourseClient(id: number | string, reason?: string) {
    try {
        const response = await fetcherClient.post(endpoints.rejectCourse(id), { reason });
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function updateCourseStatusClient(id: number | string, status: string, reason?: string) {
    try {
        if (status === "published") {
            return await approveCourseClient(id);
        }

        if (status === "rejected") {
            return await rejectCourseClient(id, reason);
        }

        return await fetcherClient.patch(endpoints.updateCourseStatus(id), { status, reason });
    } catch (err) {
        throw handleApiError(err);
    }
}

// ──── Quiz Engine Services ────────────────────────────────────────────────

/** Fetch all quizzes attached to a lesson */
export async function fetchLessonQuizzesClient(lessonId: number | string) {
    try {
        return await fetcherClient.get<{ data: IQuiz[] }>(
            endpoints.getLessonQuizzes(lessonId),
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Create a lesson-level (in-video / surprise) quiz */
export async function createLessonQuizClient(
    lessonId: number | string,
    payload: ICreateQuizPayload,
) {
    try {
        return await fetcherClient.post<{ data: IQuiz }>(
            endpoints.createLessonQuiz(lessonId),
            payload,
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Create a course-level quiz (final_exam or section_quiz) */
export async function createCourseQuizClient(
    courseId: number | string,
    payload: ICreateQuizPayload,
) {
    try {
        return await fetcherClient.post<{ data: IQuiz }>(
            endpoints.createCourseQuiz(courseId),
            payload,
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Fetch a quiz with all its questions and options */
export async function fetchQuizClient(quizId: number | string) {
    try {
        return await fetcherClient.get<{ data: IQuiz }>(
            endpoints.getQuiz(quizId),
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Delete a quiz */
export async function deleteQuizClient(quizId: number | string) {
    try {
        return await fetcherClient.delete(endpoints.deleteQuiz(quizId));
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Add a question (with options) to a quiz */
export async function addQuizQuestionClient(
    quizId: number | string,
    payload: ICreateQuizQuestionPayload,
) {
    try {
        return await fetcherClient.post(
            endpoints.addQuizQuestion(quizId),
            payload,
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Update an existing question (and its options) */
export async function updateQuizQuestionClient(
    questionId: number | string,
    payload: ICreateQuizQuestionPayload,
) {
    try {
        return await fetcherClient.put(
            endpoints.updateQuizQuestion(questionId),
            payload,
        );
    } catch (err) {
        throw handleApiError(err);
    }
}

/** Delete a question */
export async function deleteQuizQuestionClient(questionId: number | string) {
    try {
        return await fetcherClient.delete(
            endpoints.deleteQuizQuestion(questionId),
        );
    } catch (err) {
        throw handleApiError(err);
    }
}
