import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import { IAppInfo, IGeneralInfo, ISocialInfo } from "../../../types/info";

export interface UpdateInfoFormData {
  general: IGeneralInfo;
  app: IAppInfo;
  social: ISocialInfo;
}

export interface UpdateInfoFormProps {
  data: UpdateInfoFormData;
  onSuccess?: () => void;
}

export type InfoTab = "general" | "app" | "social";

export type UpdateInfoFieldName = keyof UpdateInfoSchema;

export type TranslateFn = (key: string) => string;
