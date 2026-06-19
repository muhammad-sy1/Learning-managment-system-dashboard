type TRoles = "SUPER_ADMIN" | "ADMIN" | "CLIENT" | "MERCHANT" | "DELIVERY";

interface IUser {
  id: number;
  full_name: string;
  image: string;
  email: string;
  phone_number?: string;
  country_code?: string;
  first_name: string;
  last_name: string;
  roles: string[];
  blocked_at: string | null;

  last_seen_in_days: null;
  permissions: string[];
  roles: string[];
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
