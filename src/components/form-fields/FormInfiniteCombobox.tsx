import useDebounce from "@/hooks/useDebounce";
import useInfinite from "@/hooks/useInfinite";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Spinner from "../ui/spinner";

interface FormInfiniteComboboxProps<TFormValues extends FieldValues, TData> {
  label?: string;
  description?: string;
  labelClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  queryKey: string[];
  fetchFn: (
    pageNumber: number,
    search: string,
  ) => Promise<IPaginatedResponse<TData>>;
  getOptionLabel: (item: TData) => string;
  getOptionValue: (item: TData) => number | string;
  name: Path<TFormValues>;
  initialOption?: TData;
  onSelectOption?: (item: TData | null) => void;
  defaultValue?: string;
}

export default function FormInfiniteCombobox<
  TFormValues extends FieldValues,
  TData,
>({
  name,
  label,
  description,
  placeholder,
  className,
  labelClassName,
  disabled,
  queryKey,
  fetchFn,
  getOptionLabel,
  getOptionValue,
  onSelectOption,
  initialOption,
  defaultValue,
  ...props
}: FormInfiniteComboboxProps<TFormValues, TData>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const form = useFormContext<TFormValues>();

  const { data, isFetching, ref, hasNextPage } = useInfinite<TData>({
    queryKey: [...queryKey, debouncedSearch],
    fetchFn: (pageNumber) => fetchFn(pageNumber, debouncedSearch),
  });

  const options = data?.pages.flatMap((page) => page.data) ?? [];

  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedFromOptions = options.find(
          (item) => getOptionValue(item).toString() === field.value?.toString(),
        );
        const hasValue =
          field.value !== undefined &&
          field.value !== null &&
          field.value !== "";
        const selected =
          selectedFromOptions ??
          (hasValue &&
          initialOption &&
          getOptionValue(initialOption).toString() === field.value?.toString()
            ? initialOption
            : undefined);

        return (
          <FormItem className="w-full">
            {label && (
              <FormLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
                {label}
              </FormLabel>
            )}
            <FormControl>
              <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between hover:scale-100",
                      className,
                    )}
                    disabled={disabled}
                  >
                    {selected
                      ? getOptionLabel(selected)
                      : placeholder || "اختر..."}
                    <ChevronDown className="ms-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 ">
                  <Command>
                    <CommandInput
                      placeholder="ابحث..."
                      className="h-9"
                      disabled={disabled}
                      value={search}
                      onValueChange={setSearch}
                      defaultValue={defaultValue}
                      {...props}
                    />
                    <div className="" ref={ref}></div>
                    <CommandEmpty>لا توجد نتائج</CommandEmpty>
                    <CommandGroup
                      className="max-h-40 overscroll-contain overflow-y-auto"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      {options.map((item) => {
                        const value = getOptionValue(item).toString();
                        const label = getOptionLabel(item);

                        return (
                          <CommandItem
                            key={value}
                            value={label}
                            onSelect={() => {
                              field.onChange(value);
                              setOpen(false);
                              onSelectOption?.(item);
                            }}
                          >
                            {label}
                            {value === field.value?.toString() && (
                              <Check className="ms-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        );
                      })}
                      {isFetching && (
                        <div className="flex justify-center py-2">
                          <Spinner />
                        </div>
                      )}
                      {!isFetching && !hasNextPage && (
                        <div className="text-muted-foreground py-2 text-center text-sm">
                          لا يوجد المزيد من البيانات
                        </div>
                      )}
                      {/* <div ref={ref} className="h-1" /> */}
                      {/* {hasNextPage && <div ref={ref} className="h-1" />} */}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
