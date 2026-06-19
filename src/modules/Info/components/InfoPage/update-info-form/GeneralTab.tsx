import FormDropZone from "@/components/form-fields/FormDropZone";
import FormInput from "@/components/form-fields/FormInput";
import FormSwitch from "@/components/form-fields/FormSwitch";
import { Path, UseFormReturn } from "react-hook-form";
import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import { TranslateFn } from "./types";
import { LocalizedHtmlEditorPair } from "./LocalizedHtmlEditorPair";
import { GENERAL_TUTORIAL_VIDEOS } from "../../../constants/tutorialVideos";

interface GeneralTabProps {
  form: UseFormReturn<UpdateInfoSchema>;
  t: TranslateFn;
}

const GENERAL_HTML_FIELDS: Array<{
  arName: Path<UpdateInfoSchema>;
  enName: Path<UpdateInfoSchema>;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    arName: "general-privacy_policy_ar",
    enName: "general-privacy_policy_en",
    labelKey: "general.privacyPolicy",
    placeholderKey: "general.privacyPolicyPlaceholder",
  },
  {
    arName: "general-delivery_note_ar",
    enName: "general-delivery_note_en",
    labelKey: "general.deliveryNotes",
    placeholderKey: "general.deliveryNotesPlaceholder",
  },
  {
    arName: "general-delivery_capacity_policy_ar",
    enName: "general-delivery_capacity_policy_en",
    labelKey: "general.deliveryCapacityPolicy",
    placeholderKey: "general.deliveryCapacityPolicyPlaceholder",
  },
  {
    arName: "general-terms_of_use_ar",
    enName: "general-terms_of_use_en",
    labelKey: "general.termsOfUse",
    placeholderKey: "general.termsOfUsePlaceholder",
  },
  {
    arName: "general-refund_policy_ar",
    enName: "general-refund_policy_en",
    labelKey: "general.refundPolicy",
    placeholderKey: "general.refundPolicyPlaceholder",
  },
  {
    arName: "general-home_entry_floating_note_ar",
    enName: "general-home_entry_floating_note_en",
    labelKey: "general.floatingNote",
    placeholderKey: "general.floatingNotePlaceholder",
  },
  {
    arName: "general-custom_delivery_note_ar",
    enName: "general-custom_delivery_note_en",
    labelKey: "general.customDeliveryNote",
    placeholderKey: "general.customDeliveryNotePlaceholder",
  },
];

const GENERAL_SWITCH_FIELDS: Array<{
  name: Path<UpdateInfoSchema>;
  titleKey: string;
}> = [
  { name: "general-google_map_enabled", titleKey: "general.googleMapEnabled" },
  {
    name: "general-market_orders_enabled",
    titleKey: "general.marketOrdersEnabled",
  },
  {
    name: "general-resturant_orders_enabled",
    titleKey: "general.restaurantOrdersEnabled",
  },
  {
    name: "general-custom_orders_enabled",
    titleKey: "general.customOrdersEnabled",
  },
];

const GENERAL_LINK_FIELDS: Array<{
  name: Path<UpdateInfoSchema>;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    name: "join_as_partner_url",
    labelKey: "general.joinAsPartnerUrl",
    placeholderKey: "general.joinAsPartnerUrlPlaceholder",
  },
  {
    name: "join_as_delivery_url",
    labelKey: "general.joinAsDeliveryUrl",
    placeholderKey: "general.joinAsDeliveryUrlPlaceholder",
  },
];

export function GeneralTab({ form, t }: GeneralTabProps) {
  const arabicLabel = t("tabs.ar");
  const englishLabel = t("tabs.en");

  return (
    <div className="space-y-4">
      {GENERAL_HTML_FIELDS.map((field) => (
        <LocalizedHtmlEditorPair
          key={field.arName}
          form={form}
          arName={field.arName}
          enName={field.enName}
          label={t(field.labelKey)}
          placeholder={t(field.placeholderKey)}
          arLabel={arabicLabel}
          enLabel={englishLabel}
        />
      ))}

      {GENERAL_SWITCH_FIELDS.map((field) => (
        <FormSwitch<UpdateInfoSchema>
          key={field.name}
          name={field.name}
          title={t(field.titleKey)}
        />
      ))}

      {GENERAL_LINK_FIELDS.map((field) => (
        <FormInput<UpdateInfoSchema>
          key={field.name}
          name={field.name}
          label={t(field.labelKey)}
          placeholder={t(field.placeholderKey)}
        />
      ))}

      <FormDropZone<UpdateInfoSchema>
        label={t("general.floatingBanner")}
        name="general-home_entry_floating_banner"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {GENERAL_TUTORIAL_VIDEOS.map((field) => (
          <FormDropZone<UpdateInfoSchema>
            key={field.formName}
            label={t(field.labelKey)}
            name={field.formName as Path<UpdateInfoSchema>}
            placeholder={t("general.uploadTutorialVideo")}
            hint={t("general.uploadTutorialVideoHint")}
            videoOnly
          />
        ))}
      </div>
    </div>
  );
}
