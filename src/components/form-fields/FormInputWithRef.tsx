
"use client";

import { InputHTMLAttributes, forwardRef, Ref } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import {
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "../ui/input";

interface FormInputProps<TFormValues extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue"> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  description?: string;
  Icon?: React.ReactNode;
  labelClassName?: string;
  defaultValue?: string | number | readonly string[];
}

function InnerFormInput<TFormValues extends FieldValues>(
  {
    label,
    name,
    Icon,
    description,
    className,
    labelClassName,
    ...inputProps
  }: FormInputProps<TFormValues>,
  ref?: Ref<HTMLInputElement>
) {
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
              {Icon && (
                <div className="absolute inset-y-0 end-2.5 flex items-center justify-center">
                  {Icon}
                </div>
              )}
              <Input
                id={name}
                {...field}
                {...inputProps}
                ref={ref} 
                className={cn(Icon && "pe-9 transition-all", className)}
                value={field.value ?? ""}
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

const FormInputWithRef = forwardRef(InnerFormInput) as <
  TFormValues extends FieldValues
>(
  props: FormInputProps<TFormValues> & { ref?: Ref<HTMLInputElement> }
) => React.ReactElement;

export default FormInputWithRef;
