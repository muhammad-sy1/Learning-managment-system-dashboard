import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { ICategory, ICreateCategoryPayload } from "../types/category";

export async function fetchCategoriesClient() {
    try {
        const response = await fetcherClient.get<ICategory[]>(endpoints.getCategories);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function createCategory(categoryData: ICreateCategoryPayload) {
    try {
        const response = await fetcherClient.post(endpoints.createCategory, categoryData);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function updateCategory(
    id: number | string,
    categoryData: ICreateCategoryPayload,
) {
    try {
        const response = await fetcherClient.put(
            `${endpoints.updateCategory}${id}`,
            categoryData,
        );
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}

export async function deleteCategory(id: number | string) {
    try {
        const response = await fetcherClient.delete(`${endpoints.deleteCategory}${id}`);
        return response;
    } catch (err) {
        throw handleApiError(err);
    }
}
