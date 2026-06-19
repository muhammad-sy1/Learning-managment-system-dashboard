import { cn } from "@/lib/utils";
import React, { type InputHTMLAttributes } from "react";
import {
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PhoneInput } from "../ui/phone-input";

interface FormPhoneInput<TFormValues extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue"> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  codeName?: Path<TFormValues>;
  label?: string;
  description?: string;
  Icon?: React.ReactNode;
  labelClassName?: string;
  defaultValue?: string | number | readonly string[];
}

export default function FormPhoneInput<TFormValues extends FieldValues>({
  label,
  name,
  description,
  className,
  labelClassName,
}: FormPhoneInput<TFormValues>) {
  const form = useFormContext<TFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative h-fit">
              <PhoneInput
                className={className}
                value={field.value}
                onChange={field.onChange}
                defaultCountry="SY"
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
