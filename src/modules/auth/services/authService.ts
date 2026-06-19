import { handleApiError } from "@/utils/handleApiError";
import { loginSchema } from "../schemas/loginSchema";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";
import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import useNotificationsStore from "@/store/useNotificationsStore";

export async function loginService(data: loginSchema) {
  try {
    const fcmToken = useNotificationsStore.getState().fcmToken; // جلب token من Zustand

    const response = await fetcherClient.post<IApiResponse<ILoginResponse>>(
      endpoints.login,
      { ...data, fcm_token: fcmToken }
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function logoutService() {
  try {
    const response = await fetcherClient.post<
      IApiResponse<{
        message: string;
      }>
    >(endpoints.logout);
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function sendVerificationCode(data: forgotPasswordSchema) {
  try {
    const response = await fetcherClient.post<IApiResponse<IForgotPasswordResponse>>(
      endpoints.sendVerifyCode,
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function checkVerificationCode(data: verifyCodeSchema) {
  try {
    const response = await fetcherClient.post<
      IApiResponse<ICheckVerificationCodeResponse>
    >(endpoints.checkVerificationCode, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function resetPassword(
  data: resetPasswordSchema & verifyCodeSchema
) {
  try {
    const response = await fetcherClient.post(endpoints.resetPassword, data);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
}
