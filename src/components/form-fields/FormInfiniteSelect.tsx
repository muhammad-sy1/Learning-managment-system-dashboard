import useInfinite from "@/hooks/useInfinite";
import { cn } from "@/lib/utils";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Spinner from "../ui/spinner";

interface FormInfiniteSelectProps<TFormValues extends FieldValues, TData> {
  label?: string;
  description?: string;
  labelClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  queryKey: string[];
  fetchFn: (pageNumber: number) => Promise<IPaginatedResponse<TData>>;
  getOptionLabel: (item: TData) => string;
  getOptionValue: (item: TData) => string | number;
  name: Path<TFormValues>;
}

export default function FormInfiniteSelect<
  TFormValues extends FieldValues,
  TData
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
  getOptionLabel,
  getOptionValue,
  ...props
}: FormInfiniteSelectProps<TFormValues, TData>) {
  const form = useFormContext();

  const { data, isFetching, ref } = useInfinite<TData>({
    queryKey,
    fetchFn: (pageNumber) => fetchFn(pageNumber),
  });

  const options = data?.pages.flatMap((page) => page.data) ?? [];
  const lastPage = data?.pages[data.pages.length - 1];
  const hasMoreData = lastPage && lastPage.current_page < lastPage.total;

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
            <Select
              key={field.value}
              onValueChange={(value) => {
                const numericValue = Number(value);
                field.onChange(isNaN(numericValue) ? value : numericValue);
              }}
              value={
                field.value !== undefined ? String(field.value) : undefined
              }
              disabled={disabled || isFetching}
              required={required}
              {...props}
            >
              <SelectTrigger id={name} className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent id={name} className="max-h-56">
                {options.map((item) => (
                  <SelectItem
                    key={getOptionValue(item).toString()}
                    value={getOptionValue(item).toString()}
                  >
                    {getOptionLabel(item)}
                  </SelectItem>
                ))}

                {isFetching && (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                )}

                {!isFetching && !hasMoreData && (
                  <div className="text-muted-foreground py-2 text-center text-sm">
                    لا يوجد المزيد من البيانات
                  </div>
                )}

                <div ref={ref} className="h-0.5" />
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
