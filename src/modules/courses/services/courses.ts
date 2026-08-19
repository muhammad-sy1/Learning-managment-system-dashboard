import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import {
    ICourse,
    ICourseSection,
    ICreateCourseLessonPayload,
    ICreateCoursePayload,
    ICreateCourseSectionPayload,
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

export async function fetchCourseCurriculumClient(slug: string) {
    try {
        const response = await fetcherClient.get<{ data: ICourseSection[] }>(
            endpoints.getCourseCurriculum(slug),
        );
        return response;
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

export async function rejectCourseClient(id: number | string, reason: string) {
    try {
        const response = await fetcherClient.post(endpoints.rejectCourse(id), { reason });
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function updateCourseStatusClient(id: number | string, status: string, reason?: string) {
    try {
        if (status === "rejected") {
            if (!reason || reason.trim().length < 10) {
                throw new Error("Rejection reason is required and must be at least 10 characters long.");
            }
            return await fetcherClient.patch(endpoints.updateCourseStatus(id), { status, reason });
        }

        if (status === "published") {
            return await fetcherClient.patch(endpoints.updateCourseStatus(id), { status });
        }

        return await fetcherClient.patch(endpoints.updateCourseStatus(id), { status });
    } catch (err) {
        throw handleApiError(err);
    }
}
