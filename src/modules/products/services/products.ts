import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { ProductFiltersSchema } from "../schemas/ProductFiltersSchema";
import {
  IGetProductsResponse,
  IProduct,
  IUpdateProductStatusPayload,
} from "../types/products";

export async function fetchProductsClient(filters?: ProductFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetProductsResponse>(
      endpoints.getProducts,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      },
    );
    return response.data.products;
  } catch (err) {
    throw handleApiError(err);
  }
}

///getProductById
export async function getProductById(productId: string) {
  try {
    const response = await fetcherClient.get<IProduct>(endpoints.getProduct, {
      params: {
        id: productId,
        // paginate: 1,
        // limit: PAGINATION_LIMIT,
      },
    });
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

////createProduct
export async function createProduct(productData: FormData) {
  try {
    const response = await fetcherClient.post(
      endpoints.createProduct,
      productData,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

//updateProduct
export async function updateProduct(
  id: number | string,
  productData: FormData,
) {
  try {
    const response = await fetcherClient.post(
      `${endpoints.updateProduct}${id}`,
      productData,
      { params: { _method: "PUT" } }
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
//deleteProduct
export async function deleteProduct(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteProduct}${id}`,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

//updateProductStatus
export async function updateProductStatus(
  id: number | string,
  payload: IUpdateProductStatusPayload,
) {
  try {
    const response = await fetcherClient.put(
      endpoints.updateProduct + id + "/status",
      payload,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
