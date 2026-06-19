import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { IGetTransactionsResponse } from "../types/transaction";
import { transactionFiltersSchema } from "../schemas/Transactions/transactionFiltersSchema";

export async function fetchTransactionsClient(
  filters: transactionFiltersSchema
) {
  try {
    const response = await fetcherClient.get<IGetTransactionsResponse>(
      endpoints.getTransactions,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createTransaction(transactionDate: FormData) {
  // Changed to FormData
  try {
    const response = await fetcherClient.post(
      endpoints.createTransaction,
      transactionDate
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateTransaction(
  id: number | string,
  sectionData: FormData
) {
  try {
    const response = await fetcherClient.post(
      // Changed to POST for FormData (or keep PUT if your API supports it)
      `${endpoints.updateTransaction}${id}`, // Update endpoint
      sectionData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteTransaction(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteTransaction}${id}` // Update endpoint
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
