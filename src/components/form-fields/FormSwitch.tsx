import { FormDescription, FormField, FormItem, FormMessage } from "../ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "../ui/field";

interface FormSwitchProps<TFormValues extends FieldValues> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  title?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  checked?: boolean;
}

export default function FormSwitch<TFormValues extends FieldValues>({
  name,
  title,
  description,
  className,
  disabled,
  checked,
}: FormSwitchProps<TFormValues>) {
  const form = useFormContext<TFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("flex items-start justify-between gap-4", className)}
        >
          <FieldLabel htmlFor={name}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{title}</FieldTitle>
                <FieldDescription>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                </FieldDescription>
              </FieldContent>
              <Switch
                id={name}
                dir="ltr"
                value={field.value ?? ""}
                checked={field.value === 1 || checked}
                onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                disabled={disabled}
              />
            </Field>
          </FieldLabel>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
