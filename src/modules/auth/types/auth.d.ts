type TRoles = "admin" | "student";

interface IUser {
  id: number;
  full_name: string;
  image: string;
  email: string;
  phone_number?: string;
  country_code?: string;
  first_name: string;
  last_name: string;
  role: TRoles;
  blocked_at: string | null;
  
  last_seen_in_days: null;
  permissions: string[];
  is_instructor: boolean;
}

interface ILoginResponse {
  user: IUser;
  token: string;
  isLoggedInRoute: boolean;
}

interface IForgotPasswordResponse {
  status: "string";
  can_resend_after: number;
}

interface ICheckVerificationCodeResponse {
  is_valid: boolean;
}

interface IRegisterPayload {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number?: string;
}

interface IRegisterResponse {
  user: IUser;
  token: string;
}

interface IVerifyEmailPayload {
  id: string | number;
  hash: string;
}

interface IResendVerificationPayload {
  email: string;
}

interface IApiResponse<T = any> {
  data?: T;
  message?: string;
  status?: string;
}
