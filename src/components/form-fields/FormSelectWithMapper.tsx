import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";

interface FormSelectWithMapperProps<
  TFormValues extends FieldValues,
  TOption,
  TRaw = any
> {
  label?: string;
  description?: string;
  labelClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  queryKey: string[];
  onChange?: (value: string) => void;
  fetchFn: (options?: Record<string, any>) => Promise<IApiResponse<TRaw>>;
  getOptionArray: (rawData: TRaw | undefined) => TOption[];
  getOptionLabel: (item: TOption) => string;
  getOptionValue?: (item: TOption) => string | number;
  name: Path<TFormValues>;
}

export default function FormSelectWithMapper<
  TFormValues extends FieldValues,
  TOption extends { id?: string | number } = { id?: number },
  TRaw = any
>({
  name,
  label,
  description,
  placeholder,
  className,
  labelClassName,
  disabled,
  required,
  queryKey,
  fetchFn,
  getOptionArray,
  getOptionLabel,
  getOptionValue = (item: any) => (item as any).id,
  onChange,
  ...props
}: FormSelectWithMapperProps<TFormValues, TOption, TRaw>) {
  const form = useFormContext<TFormValues>();
// console.log(form.watch(name))
  const { data, isLoading, isFetching } = useQuery<
    IApiResponse<TRaw> | undefined
  >({
    queryKey,
    queryFn: () => fetchFn(),
  });

  const raw = data?.data;
  const options: TOption[] = getOptionArray(raw);


   return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              htmlFor={String(name)}
              className={cn("mb-1", labelClassName)}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Select
              key={String(field.value ?? "")}
              // defaultValue={field.value ? String(field.value) : undefined}
              onValueChange={(val) => {
                field.onChange(val);
                onChange?.(val);
              }}
              value={field.value}
              // value={currentValue ? String(currentValue) : undefined}
              disabled={disabled || isLoading || isFetching}
              required={required}
              {...props}
            >
              <SelectTrigger id={String(name)} className={cn("", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent id={String(name)} className="max-h-56">
                {options.map((item) => (
                  <SelectItem
                    key={String(getOptionValue(item))}
                    value={String(getOptionValue(item))}
                  >
                    {getOptionLabel(item)}
                  </SelectItem>
                ))}

                {(isLoading || isFetching) && (
                  <div className="flex justify-center p-2">
                    <Spinner />
                  </div>
                )}
              </SelectContent>
            </Select>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
