import { Path, UseFormReturn } from "react-hook-form";
import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import { HtmlEditorField } from "./HtmlEditorField";

interface LocalizedHtmlEditorPairProps {
  form: UseFormReturn<UpdateInfoSchema>;
  arName: Path<UpdateInfoSchema>;
  enName: Path<UpdateInfoSchema>;
  label: string;
  placeholder: string;
  arLabel: string;
  enLabel: string;
  withSpace?: boolean;
}

export function LocalizedHtmlEditorPair({
  form,
  arName,
  enName,
  label,
  placeholder,
  arLabel,
  enLabel,
  withSpace = false,
}: LocalizedHtmlEditorPairProps) {
  const separator = withSpace ? " " : "";

  return (
    <>
      <HtmlEditorField
        form={form}
        name={arName}
        label={`${label}${separator}${arLabel}`}
        placeholder={`${placeholder}${separator}${arLabel}`}
      />

      <HtmlEditorField
        form={form}
        name={enName}
        label={`${label}${separator}${enLabel}`}
        placeholder={`${placeholder}${separator}${enLabel}`}
      />
    </>
  );
}
