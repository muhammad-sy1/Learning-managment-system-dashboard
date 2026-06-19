import { FormField } from "@/components/ui/form";
import { Path, UseFormReturn } from "react-hook-form";
import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import HtmlEditor from "../HtmlEditor";

interface HtmlEditorFieldProps {
  form: UseFormReturn<UpdateInfoSchema>;
  name: Path<UpdateInfoSchema>;
  label: string;
  placeholder: string;
}

export function HtmlEditorField({
  form,
  name,
  label,
  placeholder,
}: HtmlEditorFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <HtmlEditor
          label={label}
          value={String(field.value ?? "")}
          onChange={field.onChange}
          placeholder={placeholder}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
