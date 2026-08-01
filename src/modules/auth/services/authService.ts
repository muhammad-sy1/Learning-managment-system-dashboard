import { handleApiError } from "@/utils/handleApiError";
import { loginSchema } from "../schemas/loginSchema";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";
import { authFetcherClient } from "@/lib/api/fetcher/client";
import useNotificationsStore from "@/store/useNotificationsStore";

const authEndpoints = {
  login: "/login",
  logout: "/logout",
  sendVerifyCode: "/send/verification-code",
  checkVerificationCode: "/check/verification",
  resetPassword: "/reset-password",
  register: "/register",
  getUser: "/user",
  verifyEmail: (id: string | number, hash: string) => `/verify-email/${id}/${hash}`,
  resendVerification: "/resend-verification",
};

export async function loginService(data: loginSchema) {
  try {
    const fcmToken = useNotificationsStore.getState().fcmToken;

    const response = await authFetcherClient.post<IApiResponse<ILoginResponse>>(
      authEndpoints.login,
      { ...data, fcm_token: fcmToken }
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function logoutService() {
  try {
    const response = await authFetcherClient.post<
      IApiResponse<{
        message: string;
      }>
    >(authEndpoints.logout);
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function sendVerificationCode(data: forgotPasswordSchema) {
  try {
    const response = await authFetcherClient.post<IApiResponse<IForgotPasswordResponse>>(
      authEndpoints.sendVerifyCode,
      data
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function checkVerificationCode(data: verifyCodeSchema) {
  try {
    const response = await authFetcherClient.post<
      IApiResponse<ICheckVerificationCodeResponse>
    >(authEndpoints.checkVerificationCode, data);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function resetPassword(
  data: resetPasswordSchema & verifyCodeSchema
) {
  try {
    const response = await authFetcherClient.post(
      authEndpoints.resetPassword,
      data
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function registerService(data: IRegisterPayload) {
  try {
    const fcmToken = useNotificationsStore.getState().fcmToken;
    const response = await authFetcherClient.post<IApiResponse<IRegisterResponse>>(
      authEndpoints.register,
      { ...data, fcm_token: fcmToken }
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function getCurrentUser() {
  try {
    const response = await authFetcherClient.get<IApiResponse<IUser>>(
      authEndpoints.getUser
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function verifyEmailService(
  id: string | number,
  hash: string
) {
  try {
    const response = await authFetcherClient.get<IApiResponse<{ message: string }>>(
      authEndpoints.verifyEmail(id, hash)
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function resendVerificationService(
  data: IResendVerificationPayload
) {
  try {
    const response = await authFetcherClient.post<IApiResponse<{ message: string }>>(
      authEndpoints.resendVerification,
      data
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}
