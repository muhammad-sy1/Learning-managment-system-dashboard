interface IApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

interface IErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

interface IPaginatedResponse<T> {
  current_page: number;
  total: number;
  last_page: number;
  data: T[];
}
