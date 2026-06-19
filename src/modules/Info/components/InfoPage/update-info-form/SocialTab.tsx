import FormInput from "@/components/form-fields/FormInput";
import { Path } from "react-hook-form";
import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import { TranslateFn } from "./types";

interface SocialTabProps {
  t: TranslateFn;
}

const SOCIAL_FIELDS: Array<{
  name: Path<UpdateInfoSchema>;
  labelKey: string;
  placeholderKey: string;
}> = [
  {
    name: "social-facebook",
    labelKey: "app.facebook",
    placeholderKey: "app.facebookPlaceholder",
  },
  {
    name: "social-instagram",
    labelKey: "app.instagram",
    placeholderKey: "app.instagramPlaceholder",
  },
  {
    name: "social-whatsapp",
    labelKey: "app.whatsapp",
    placeholderKey: "app.whatsappPlaceholder",
  },
];

export function SocialTab({ t }: SocialTabProps) {
  return (
    <div className="space-y-4">
      {SOCIAL_FIELDS.map((field) => (
        <FormInput<UpdateInfoSchema>
          key={field.name}
          name={field.name}
          label={t(field.labelKey)}
          placeholder={t(field.placeholderKey)}
        />
      ))}
    </div>
  );
}
