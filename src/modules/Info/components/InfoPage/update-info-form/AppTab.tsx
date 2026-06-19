import FormInputFileApk from "@/components/form-fields/FormInputFileApk";
import FormInput from "@/components/form-fields/FormInput";
import { FormRadio } from "@/components/form-fields/FormRadio";
import FormSwitch from "@/components/form-fields/FormSwitch";
import { FieldGroup } from "@/components/ui/field";
import { Path, UseFormReturn } from "react-hook-form";
import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import { APK_FIELDS, APP_MODE_OPTIONS } from "./helpers";
import { LocalizedHtmlEditorPair } from "./LocalizedHtmlEditorPair";
import { TranslateFn } from "./types";

interface AppTabProps {
  form: UseFormReturn<UpdateInfoSchema>;
  t: TranslateFn;
}

const APP_SWITCH_FIELDS: Array<{ name: Path<UpdateInfoSchema>; titleKey: string }> = [
  { name: "app-client_force_update", titleKey: "app.clientForceUpdate" },
  { name: "app-delivery_force_update", titleKey: "app.deliveryForceUpdate" },
  { name: "app-merchant_force_update", titleKey: "app.merchantForceUpdate" },
];

const APP_INPUT_FIELDS: Array<{
  name: Path<UpdateInfoSchema>;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    name: "app-client_as_version",
    labelKey: "app.clientAsVersion",
    placeholderKey: "app.clientAsVersionPlaceholder",
  },
  {
    name: "app-client_gp_version",
    labelKey: "app.clientGpVersion",
    placeholderKey: "app.clientGpVersionPlaceholder",
  },
  {
    name: "app-delivery_as_version",
    labelKey: "app.deliveryAsVersion",
    placeholderKey: "app.deliveryAsVersionPlaceholder",
  },
  {
    name: "app-delivery_gp_version",
    labelKey: "app.deliveryGpVersion",
    placeholderKey: "app.deliveryGpVersionPlaceholder",
  },
  {
    name: "app-merchant_as_version",
    labelKey: "app.merchantAsVersion",
    placeholderKey: "app.merchantAsVersionPlaceholder",
  },
  {
    name: "app-client_app_store",
    labelKey: "app.clientAsLink",
    placeholderKey: "app.clientAsLinkPlaceholder",
  },
  {
    name: "app-client_google_play",
    labelKey: "app.clientGpLink",
    placeholderKey: "app.clientGpLinkPlaceholder",
  },
  {
    name: "app-delivery_app_store",
    labelKey: "app.deliveryAsLink",
    placeholderKey: "app.deliveryAsLinkPlaceholder",
  },
  {
    name: "app-delivery_google_play",
    labelKey: "app.deliveryGpLink",
    placeholderKey: "app.deliveryGpLinkPlaceholder",
  },
  {
    name: "app-merchant_app_store",
    labelKey: "app.merchantAsLink",
    placeholderKey: "app.merchantAsLinkPlaceholder",
  },
  {
    name: "app-merchant_google_play",
    labelKey: "app.merchantGpLink",
    placeholderKey: "app.merchantGpLinkPlaceholder",
  },
];

const APP_MODE_FIELDS: Array<{ name: Path<UpdateInfoSchema>; labelKey: string }> = [
  { name: "app-client_mode", labelKey: "app.clientMode" },
  { name: "app-delivery_mode", labelKey: "app.deliveryMode" },
  { name: "app-merchant_mode", labelKey: "app.merchantMode" },
];

const APP_HTML_FIELDS: Array<{
  arName: Path<UpdateInfoSchema>;
  enName: Path<UpdateInfoSchema>;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    arName: "app-client_change_logs_ar",
    enName: "app-client_change_logs_en",
    labelKey: "app.clientChangeLogs",
    placeholderKey: "app.clientChangeLogsPlaceholder",
  },
  {
    arName: "app-delivery_change_logs_ar",
    enName: "app-delivery_change_logs_en",
    labelKey: "app.deliveryChangeLogs",
    placeholderKey: "app.deliveryChangeLogsPlaceholder",
  },
  {
    arName: "app-merchant_change_logs_ar",
    enName: "app-merchant_change_logs_en",
    labelKey: "app.merchantChangeLogs",
    placeholderKey: "app.merchantChangeLogsPlaceholder",
  },
  {
    arName: "app-otp_text_ar",
    enName: "app-otp_text_en",
    labelKey: "app.otpText",
    placeholderKey: "app.otpTextPlaceholder",
  },
];

export function AppTab({ form, t }: AppTabProps) {
  const arabicLabel = t("tabs.ar");
  const englishLabel = t("tabs.en");

  const modeOptions = APP_MODE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));

  return (
    <div className="space-y-4">
      <FieldGroup data-slot="checkbox-group">
        {APK_FIELDS.map((field) => (
          <FormInputFileApk<UpdateInfoSchema>
            key={field.name}
            name={field.name}
            label={t(field.labelKey)}
            placeholder={t("app.uploadApk")}
            hint={t("app.uploadApkHint")}
          />
        ))}
      </FieldGroup>

      {APP_SWITCH_FIELDS.map((field) => (
        <FormSwitch<UpdateInfoSchema>
          key={field.name}
          name={field.name}
          title={t(field.titleKey)}
        />
      ))}

      {APP_INPUT_FIELDS.map((field) => (
        <FormInput<UpdateInfoSchema>
          key={field.name}
          name={field.name}
          label={t(field.labelKey)}
          placeholder={t(field.placeholderKey)}
        />
      ))}

      {APP_MODE_FIELDS.map((field) => (
        <FormRadio<UpdateInfoSchema>
          key={field.name}
          name={field.name}
          label={t(field.labelKey)}
          options={modeOptions}
        />
      ))}

      {APP_HTML_FIELDS.map((field) => (
        <LocalizedHtmlEditorPair
          key={field.arName}
          form={form}
          arName={field.arName}
          enName={field.enName}
          label={t(field.labelKey)}
          placeholder={t(field.placeholderKey)}
          arLabel={arabicLabel}
          enLabel={englishLabel}
          withSpace
        />
      ))}
    </div>
  );
}
