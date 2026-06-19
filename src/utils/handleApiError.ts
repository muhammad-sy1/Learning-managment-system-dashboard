
export class ApiError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  allMessages(): string[] {
    return Object.values(this.errors).flat();
  }
}

// export function handleApiError(error: unknown) {
  

//   if (error instanceof ApiError) {
//     return error;
//   }

//   return new ApiError("An unexpected error occurred");
// }


// utils/handleApiError.ts

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof TypeError) {
    return new ApiError("Network connection failed. Please check your internet.");
  }

  if (typeof error === "object" && error !== null) {
    const e = error as any;

    if (e.response) {
      const status = e.response.status;
      const data = e.response.data;

      if (data?.errors && typeof data.errors === "object") {
        return new ApiError(
          data.message || `Server returned ${status}`,
          data.errors
        );
      }

      return new ApiError(data?.message || `Request failed with status ${status}`);
    }
  }

  return new ApiError("An unexpected error occurred. Please try again later.");
}
