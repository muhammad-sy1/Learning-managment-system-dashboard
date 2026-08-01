import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { UserBlockStatusSchema } from "../schemas/userBlockStatusSchema";
import { UserFiltersSchema } from "../schemas/userFiltersSchema";
import {
  IGetMerchantCoPriceListResponse,
  IGetUserResponse,
  IGetUserTokenResponse,
  IGetWorkingHoursResponse,
  IGroupedWorkingHours,
  IMerchantCoPriceListData,
  IMerchantCoPriceListImage,
  IMerchantCoPriceListItem,
  IMerchantCoPriceListItemPayload,
  MerchantCoPriceListFilter,
  IWorkingHour,
} from "../types/users";

function isWorkingHour(value: unknown): value is IWorkingHour {
  return !!value && typeof value === "object";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function flattenGroupedWorkingHours(
  grouped: IGroupedWorkingHours,
): IWorkingHour[] {
  return Object.entries(grouped).flatMap(([day_name, slots]) => {
    if (!Array.isArray(slots)) return [];

    return slots
      .filter(isWorkingHour)
      .map((slot) => ({
        id: typeof slot.id === "number" ? slot.id : undefined,
        day_name,
        opens_at: slot.opens_at,
        closes_at: slot.closes_at,
      }));
  });
}

function normalizeWorkingHours(raw: unknown): IWorkingHour[] {
  if (Array.isArray(raw)) {
    return raw.filter(isWorkingHour);
  }

  if (!raw || typeof raw !== "object") {
    return [];
  }

  const response = raw as IGetWorkingHoursResponse;
  const nestedData = response.data;
  const workingHours = response.working_hours;

  if (Array.isArray(nestedData)) {
    return nestedData.filter(isWorkingHour);
  }

  if (Array.isArray(workingHours)) {
    return workingHours.filter(isWorkingHour);
  }

  if (nestedData && typeof nestedData === "object") {
    if (Array.isArray(nestedData.working_hours)) {
      return nestedData.working_hours.filter(isWorkingHour);
    }

    if (
      nestedData.working_hours &&
      typeof nestedData.working_hours === "object"
    ) {
      return flattenGroupedWorkingHours(nestedData.working_hours);
    }
  }

  if (workingHours && typeof workingHours === "object") {
    return flattenGroupedWorkingHours(workingHours);
  }

  return [];
}

function parseOptionalId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function parseCoPriceListCollection(
  raw: unknown,
  key: keyof IMerchantCoPriceListData,
) {
  const candidates: unknown[] = [raw];

  if (isRecord(raw)) {
    candidates.push(raw[key]);
    candidates.push(raw.data);

    if (isRecord(raw[key])) {
      candidates.push(raw[key].data);
    }

    if (isRecord(raw.data)) {
      candidates.push(raw.data[key]);
      candidates.push(raw.data.data);

      if (isRecord(raw.data[key])) {
        candidates.push(raw.data[key].data);
      }
    }
  }

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function normalizeCoPriceListItems(raw: unknown): IMerchantCoPriceListItem[] {
  return parseCoPriceListCollection(raw, "items")
    .filter(isRecord)
    .map((item) => ({
      id: parseOptionalId(item.id),
      name: typeof item.name === "string" ? item.name : "",
      description:
        typeof item.description === "string" ? item.description : "",
      main_price:
        typeof item.main_price === "number" ||
        typeof item.main_price === "string"
          ? item.main_price
          : null,
      new_price:
        typeof item.new_price === "number" || typeof item.new_price === "string"
          ? item.new_price
          : null,
      is_hidden:
        item.is_hidden === true ||
        item.is_hidden === 1 ||
        item.is_hidden === "1",
    }));
}

function normalizeCoPriceListImages(raw: unknown): IMerchantCoPriceListImage[] {
  return parseCoPriceListCollection(raw, "images").reduce<
    IMerchantCoPriceListImage[]
  >((acc, image) => {
      if (typeof image === "string") {
        acc.push({
          id: undefined,
          image,
        });

        return acc;
      }

      if (!isRecord(image)) {
        return acc;
      }

      const resolvedImage =
        typeof image.image === "string"
          ? image.image
          : typeof image.url === "string"
            ? image.url
            : typeof image.path === "string"
              ? image.path
              : typeof image.file_path === "string"
              ? image.file_path
              : "";

      acc.push({
        id: parseOptionalId(image.id),
        image: resolvedImage,
      });

      return acc;
    }, []);
}

export async function fetchUsersClient(
  filters: UserFiltersSchema & { is_instructor?: number },
  roleFromProps?: string,
  roles?: string,
) {
  console.log("fetchUsersClient called");
  try {
    const response = await fetcherClient.get<IGetUserResponse>(
      "/admin/users",
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
          ...(roleFromProps && { role: roleFromProps }),
          ...(roles && { roles: roles }),
        },
      },
    );
    console.log("response.data.users", response);
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createUser(userData: FormData) {
  try {
    const response = await fetcherClient.post(endpoints.createUser, userData);
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateUser(id: number | string, userData: FormData) {
  try {
    const response = await fetcherClient.post(
      `${endpoints.updateUser}${id}`,
      userData,
    );

    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function updateUserBlockStatus(
  id: number | string,
  userData: UserBlockStatusSchema,
) {
  try {
    const response = await fetcherClient.put(
      `${endpoints.updateUser}${id}`,
      userData,
    );

    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteUser(id: number | string) {
  try {
    const response = await fetcherClient.delete(`${endpoints.deleteUser}${id}`);
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function getUserToken(id: number | string) {
  try {
    const response = await fetcherClient.get<IGetUserTokenResponse>(
      endpoints.getUserToken(id),
    );
    return response.data.token;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function downloadMerchantProducts(id: number | string) {
  try {
    const response = await fetcherClient.get<Blob>(
      `${endpoints.downloadMerchantProducts}${id}`,
      {
        responseType: "blob",
      },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function getMerchantWorkingHours(
  merchantId: number | string,
): Promise<IWorkingHour[]> {
  try {
    const response = await fetcherClient.get<IGetWorkingHoursResponse>(
      endpoints.getMerchantWorkingHours(merchantId),
    );

    return normalizeWorkingHours(response.data);
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createMerchantWorkingHour(
  merchantId: number | string,
  data: { day_name: string; opens_at: string; closes_at: string },
) {
  try {
    const response = await fetcherClient.post(
      endpoints.createMerchantWorkingHour(merchantId),
      data,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateMerchantWorkingHour(
  hourId: number | string,
  data: { day_name: string; opens_at: string; closes_at: string },
) {
  try {
    const response = await fetcherClient.put(
      endpoints.updateMerchantWorkingHour(hourId),
      data,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteMerchantWorkingHour(hourId: number | string) {
  try {
    const response = await fetcherClient.delete(
      endpoints.deleteMerchantWorkingHour(hourId),
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function getMerchantCoPriceList(
  merchantId: number | string,
  filter: MerchantCoPriceListFilter,
): Promise<IMerchantCoPriceListData> {
  try {
    const response = await fetcherClient.get<IGetMerchantCoPriceListResponse>(
      endpoints.getMerchantCoPriceList(merchantId),
      {
        params: {
          app: "MERCHANT",
          ...(filter === "items" ? { items: 1 } : { images: 1 }),
        },
      },
    );

    return {
      items: normalizeCoPriceListItems(response.data),
      images: normalizeCoPriceListImages(response.data),
    };
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createMerchantCoPriceListItem(
  merchantId: number | string,
  data: IMerchantCoPriceListItemPayload,
) {
  try {
    const response = await fetcherClient.post(
      endpoints.createMerchantCoPriceListItem(merchantId),
      data,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateMerchantCoPriceListItem(
  itemId: number | string,
  data: IMerchantCoPriceListItemPayload,
) {
  try {
    const response = await fetcherClient.put(
      endpoints.updateMerchantCoPriceListItem(itemId),
      data,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteMerchantCoPriceListItem(itemId: number | string) {
  try {
    const response = await fetcherClient.delete(
      endpoints.deleteMerchantCoPriceListItem(itemId),
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function uploadMerchantCoPriceListImage(
  merchantId: number | string,
  files: File[],
) {
  try {
    const formData = new FormData();
    files.slice(0, 5).forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    const response = await fetcherClient.post(
      endpoints.uploadMerchantCoPriceListImage(merchantId),
      formData,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteMerchantCoPriceListImage(
  imageId: number | string,
) {
  try {
    const response = await fetcherClient.delete(
      endpoints.deleteMerchantCoPriceListImage(imageId),
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
