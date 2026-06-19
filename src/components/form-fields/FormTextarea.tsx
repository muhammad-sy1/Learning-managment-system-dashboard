import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";

interface FormTextareaProps<TFormValues extends FieldValues> extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name" | "defaultValue"
> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  description?: string;
  labelClassName?: string;
}

export default function FormTextarea<TFormValues extends FieldValues>({
  label,
  name,
  description,
  className,
  labelClassName,
  ...textareaProps
}: FormTextareaProps<TFormValues>) {
  const form = useFormContext<TFormValues>();

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && (
            <FieldLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
              {label}
            </FieldLabel>
          )}

          <Textarea
            id={name}
            {...field}
            {...textareaProps}
            className={cn("resize-none", className)}
            value={field.value ?? ""}
          />

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
