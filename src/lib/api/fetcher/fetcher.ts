import { ApiError } from "@/utils/handleApiError";

type RequestBody =
  | string
  | number
  | boolean
  | object
  | FormData
  | URLSearchParams
  | Blob
  | ArrayBuffer
  | ReadableStream;

type ParamValue = string | number | boolean | null | undefined;

interface IErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

interface FetchWrapperDefaults {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface RequestConfig extends Omit<RequestInit, "body" | "method"> {
  url?: string;
  method?: string;
  baseURL?: string;
  headers?: HeadersInit;
  params?: Record<string, ParamValue | ParamValue[]>;
  data?: RequestBody;
  timeout?: number;
  responseType?: "json" | "blob" | "text";
}

interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

interface ResponseInterceptor {
  <T>(data: T, response: Response): T | Promise<T>;
}

interface ErrorInterceptor {
  (error: {
    response?: Response;
    request?: RequestConfig;
    message: string;
    data?: IErrorResponse;
  }): Promise<never> | never;
}

interface FetchWrapperInstance {
  defaults: FetchWrapperDefaults;
  interceptors: {
    request: {
      use: (interceptor: RequestInterceptor) => number;
      eject: (id: number) => void;
    };
    response: {
      use: (interceptor: ResponseInterceptor) => number;
      eject: (id: number) => void;
    };
    error: {
      use: (interceptor: ErrorInterceptor) => number;
      eject: (id: number) => void;
    };
  };

  // Methods without body (config as 2nd parameter)
  get<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;
  delete<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;
  head<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;
  options<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;

  // Methods with body (data as 2nd parameter, config as 3rd)
  post<T = unknown>(
    url: string,
    data?: RequestBody,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: RequestBody,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;
  patch<T = unknown>(
    url: string,
    data?: RequestBody,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T>;

  // Generic request method
  request<T = unknown>(config: RequestConfig): Promise<T>;
}

interface FetchWrapperStatic {
  create(config?: FetchWrapperDefaults): FetchWrapperInstance;
}

/**
 * Serializes an object into URL search parameters
 * Filters out undefined, null, and empty string values
 */
function serializeParams(
  params: Record<string, ParamValue | ParamValue[]>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            searchParams.append(key, String(item));
          }
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Determines if a value should be JSON stringified
 */
function shouldStringifyBody(body: RequestBody): boolean {
  return (
    body !== null &&
    body !== undefined &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(body)
  );
}

/**
 * Creates a fetch wrapper instance with Axios-like API
 */
function createInstance(
  defaults: FetchWrapperDefaults = {},
): FetchWrapperInstance {
  // Interceptor management
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];
  const errorInterceptors: ErrorInterceptor[] = [];

  const interceptors = {
    request: {
      use: (interceptor: RequestInterceptor): number => {
        requestInterceptors.push(interceptor);
        return requestInterceptors.length - 1;
      },
      eject: (id: number): void => {
        if (requestInterceptors[id]) {
          requestInterceptors.splice(id, 1);
        }
      },
    },
    response: {
      use: (interceptor: ResponseInterceptor): number => {
        responseInterceptors.push(interceptor);
        return responseInterceptors.length - 1;
      },
      eject: (id: number): void => {
        if (responseInterceptors[id]) {
          responseInterceptors.splice(id, 1);
        }
      },
    },
    error: {
      use: (interceptor: ErrorInterceptor): number => {
        errorInterceptors.push(interceptor);
        return errorInterceptors.length - 1;
      },
      eject: (id: number): void => {
        if (errorInterceptors[id]) {
          errorInterceptors.splice(id, 1);
        }
      },
    },
  };

  async function request<T = unknown>(config: RequestConfig): Promise<T> {
    // Merge with defaults
    const mergedConfig: RequestConfig = {
      method: "GET",
      baseURL: defaults.baseURL,
      timeout: defaults.timeout,
      ...config,
    };

    // Merge headers separately to avoid duplication
    mergedConfig.headers = {
      ...defaults.headers,
      ...config.headers,
    };

    // Apply request interceptors
    let finalConfig = mergedConfig;
    for (const interceptor of requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    const {
      url = "",
      method = "GET",
      baseURL,
      headers = {},
      params,
      data,
      timeout,
      signal,
      ...restConfig
    } = finalConfig;

    // Build the full URL
    let fullUrl = url.startsWith("http")
      ? url
      : `${(baseURL || "").replace(/\/$/, "")}${
          url.startsWith("/") ? url : `/${url}`
        }`;

    // Add query parameters if provided
    if (params) {
      const queryString = serializeParams(params);
      if (queryString) {
        const separator = fullUrl.includes("?") ? "&" : "?";
        fullUrl += `${separator}${queryString}`;
      }
    }

    // Prepare headers - properly handle HeadersInit type
    const finalHeaders: Record<string, string> = {};
    if (headers) {
      if (headers instanceof Headers) {
        headers.forEach((value, key) => {
          finalHeaders[key] = value;
        });
      } else if (Array.isArray(headers)) {
        // Handle string[][] format
        headers.forEach(([key, value]) => {
          finalHeaders[key] = value;
        });
      } else {
        // Handle Record<string, string> format
        Object.assign(finalHeaders, headers);
      }
    }

    // Handle body serialization
    let finalBody: BodyInit | undefined = undefined;
    if (data !== undefined) {
      if (shouldStringifyBody(data)) {
        finalBody = JSON.stringify(data);
        finalHeaders["Content-Type"] =
          finalHeaders["Content-Type"] || "application/json";
      } else {
        finalBody = data as BodyInit;
      }
    }

    // Handle timeout
    let timeoutId: NodeJS.Timeout | undefined;
    let controller: AbortController | undefined;

    if (timeout && !signal) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller?.abort(), timeout);
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: finalHeaders,
      body: finalBody,
      signal: signal || controller?.signal,
      ...restConfig,
    };

    try {
      // 1. Make the request
      const response = await fetch(fullUrl, fetchOptions);

      // 2. Handle non-ok responses
      if (!response.ok) {
        const errorData = (await response.json()) as IErrorResponse;

        const errorObject = {
          response,
          request: finalConfig,
          message: errorData.message,
          data: errorData,
        };

        for (const interceptor of errorInterceptors) {
          await interceptor(errorObject);
        }

        throw new ApiError(errorData.message, errorData.errors);
      }

      let responseData: T;

      switch (finalConfig.responseType) {
        case "blob":
          responseData = (await response.blob()) as unknown as T;
          break;

        case "text":
          responseData = (await response.text()) as unknown as T;
          break;

        default: {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
          } else {
            responseData = (await response.text()) as unknown as T;
          }
        }
      }

      // 3. Apply response interceptors
      let finalData = responseData;
      for (const interceptor of responseInterceptors) {
        finalData = await interceptor(finalData, response);
      }
      return finalData;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      throw error;
    }
  }

  const get = <T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "GET" });

  const deleteMethod = <T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "DELETE" });

  const head = <T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "HEAD" });

  const options = <T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "OPTIONS" });

  const post = <T = unknown>(
    url: string,
    data?: RequestBody,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "POST", data });

  const put = <T = unknown>(
    url: string,
    data?: RequestBody,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "PUT", data });

  const patch = <T = unknown>(
    url: string,
    data?: RequestBody,
    config?: Omit<RequestConfig, "method" | "url" | "data">,
  ): Promise<T> => request<T>({ ...config, url, method: "PATCH", data });

  return {
    defaults,
    interceptors,
    get,
    delete: deleteMethod,
    head,
    options,
    post,
    put,
    patch,
    request,
  };
}

// Create the main fetchWrapper object with create method
const fetchWrapper: FetchWrapperStatic = {
  create: createInstance,
};

// Create and export a default instance
const fetcher = createInstance({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    Accept: "application/json",
  },
});

// Type exports for external use
export type {
  FetchWrapperDefaults,
  RequestConfig,
  FetchWrapperInstance,
  FetchWrapperStatic,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
};

export { fetchWrapper };
export default fetcher;
