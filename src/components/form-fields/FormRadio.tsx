import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputHTMLAttributes } from "react";
import {
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Label } from "../ui/label";
interface FormRadioProps<TFormValues extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue" | "type"
> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  options: { label: string; value: string }[];
}

export function FormRadio<TFormValues extends FieldValues>({
  name,
  label,
  options,
  
}: FormRadioProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <FormField
      control={control}
      name={name as Path<TFormValues>}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex mt-2 gap-4"
            >
              {options.map((opt) => {
                const id = `${name}-${opt.value}`;
                return (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={id} />
                    <Label htmlFor={id}>{opt.label}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
