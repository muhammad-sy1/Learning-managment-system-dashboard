import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";

interface FormInputProps<TFormValues extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue"
> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  description?: string;
  Icon?: React.ReactNode;
  labelClassName?: string;
}

export default function FormInput<TFormValues extends FieldValues>({
  label,
  name,
  Icon,
  description,
  className,
  labelClassName,
  ...inputProps
}: FormInputProps<TFormValues>) {
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
          <div className="relative h-fit">
            {Icon && (
              <div className="absolute inset-y-0 end-2.5 flex items-center justify-center">
                {Icon}
              </div>
            )}
            <Input
              id={name}
              {...field}
              autoComplete="off"
              {...inputProps}
              className={cn(Icon && "pe-9  transition-all", className)}
              value={field.value ?? ""}
            />
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
