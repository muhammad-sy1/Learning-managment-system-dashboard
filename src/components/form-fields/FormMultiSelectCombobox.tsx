import Spinner from "@/components/ui/spinner";
import useDebounce from "@/hooks/useDebounce";
import useInfinite from "@/hooks/useInfinite";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";
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

interface FormInfiniteMultiComboboxProps<
  TFormValues extends FieldValues,
  TData,
> {
  label?: string;
  description?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  queryKey: string[];
  initialOptions?: TData[];
  fetchFn: (
    pageNumber: number,
    search: string,
  ) => Promise<IPaginatedResponse<TData>>;
  getOptionLabel: (item: TData) => string;
  getOptionValue: (item: TData) => string | number;
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  maxDisplayItems?: number;

  showCount?: boolean;
  onOptionsChange?: (options: TData[]) => void;
}

export default function FormInfiniteMultiCombobox<
  TFormValues extends FieldValues,
  TData,
>({
  name,
  label,
  description,
  className,
  labelClassName,
  initialOptions = [],
  disabled,
  queryKey,
  fetchFn,
  getOptionLabel,
  getOptionValue,
  onOptionsChange,
}: FormInfiniteMultiComboboxProps<TFormValues, TData>) {
  const t = useTranslations("FormMultiSelectCombobox");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isFetching, ref, hasNextPage } = useInfinite<TData>({
    queryKey: [...queryKey, debouncedSearchTerm],
    fetchFn: (pageNumber) => fetchFn(pageNumber, debouncedSearchTerm),
  });

  const form = useFormContext<TFormValues>();

  // const options = useMemo(
  //   () => data?.pages.flatMap((page) => page.data) ?? [],
  //   [data]
  // );
  const options = useMemo(() => {
    const fetchedOptions = data?.pages.flatMap((page) => page.data) ?? [];
    // console.log(fetchedOptions);
    const merged = [...initialOptions];

    fetchedOptions.forEach((item) => {
      const exists = merged.some(
        (opt) =>
          getOptionValue(opt).toString() === getOptionValue(item).toString(),
      );
      if (!exists) {
        merged.push(item);
      }
    });

    return merged;
  }, [data, initialOptions, getOptionValue]);

  const [open, setOpen] = useState(false);

  useMemo(() => {
    if (onOptionsChange && options.length > 0) {
      onOptionsChange(options);
    }
  }, [options, onOptionsChange]);

  const getSelectedOptionLabels = (selectedValues: (string | number)[]) => {
    return selectedValues
      .map((value) => {
        const option = options.find(
          (opt) => getOptionValue(opt).toString() === value.toString(),
        );
        return option && getOptionLabel(option);
      })
      .filter(Boolean);
  };

  // Toggle selection
  const toggleOption = (
    optionValue: string | number,
    currentValues: (string | number)[],
    onChange: (values: (string | number)[]) => void,
  ) => {
    const isSelected = currentValues.includes(optionValue);

    if (isSelected) {
      onChange(currentValues.filter((value) => value !== optionValue));
    } else {
      onChange([...currentValues, optionValue]);
    }
  };

  const removeOption = useCallback(
    (
      optionValue: string | number,
      currentValues: (string | number)[],
      onChange: (values: (string | number)[]) => void,
    ) => {
      const newValues = currentValues.filter((value) => value !== optionValue);
      onChange(newValues);
    },
    [],
  );
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const rawValue = field.value as unknown;
        const selectedValues: (string | number)[] = Array.isArray(rawValue)
          ? rawValue
          : typeof rawValue === "string"
            ? rawValue.split(",").filter((v) => v !== "")
            : [];
        return (
          <FormItem className="w-full">
            {description && <FormDescription>{description}</FormDescription>}

            {label && (
              <FormLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
                {label}
              </FormLabel>
            )}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id={name}
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-start hover:scale-100 h-auto min-h-[40px] px-3 py-2",
                      selectedValues.length === 0 && "text-muted-foreground",
                      className,
                    )}
                    disabled={disabled}
                  >
                    <div className="w-full flex flex-wrap gap-1 items-center justify-between">
                      <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                        {selectedValues.length === 0 ? (
                          <span className="text-muted-foreground">
                            {t("placeholder")}
                          </span>
                        ) : (
                          <>
                            {getSelectedOptionLabels(selectedValues).map(
                              (label, index) => {
                                const value = selectedValues[index];

                                return (
                                  <Badge
                                    key={value}
                                    variant="secondary"
                                    className="text-xs min-w-[120px] truncate"
                                  >
                                    {label}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeOption(
                                          value,
                                          selectedValues,
                                          field.onChange,
                                        );
                                      }}
                                      className="      rounded-sm p-0.5"
                                      aria-label={`Remove ${label}`}
                                    >
                                      <X className="h-3 w-3 " />
                                    </button>
                                  </Badge>
                                );
                              },
                            )}
                          </>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" dir="ltr">
                  <Command>
                    <CommandInput
                      placeholder={t("searchPlaceholder")}
                      className="h-9"
                      disabled={disabled}
                      onValueChange={setSearchTerm}
                    />

                    <CommandGroup
                      className="max-h-60 overflow-y-auto"
                      onWheel={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {options
                        .filter(
                          (item) =>
                            !selectedValues.includes(getOptionValue(item)),
                        )
                        .map((item) => {
                          const value = getOptionValue(item).toString();
                          const label = getOptionLabel(item);
                          const isSelected = selectedValues.some(
                            (v) => v.toString() === value,
                          );

                          return (
                            <CommandItem
                              key={value}
                              //label
                              value={label}
                              onSelect={() => {
                                toggleOption(
                                  value,
                                  selectedValues,
                                  field.onChange,
                                );
                              }}
                              className={cn(
                                "flex items-center justify-between cursor-pointer",
                                isSelected && "bg-accent",
                              )}
                            >
                              <span className="flex-1 text-start  " dir="rtl">
                                {label}
                              </span>
                              <div
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary dark:bg-secondary  text-primary"
                                    : "opacity-50 [&_svg]:invisible",
                                )}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            </CommandItem>
                          );
                        })}

                      {!isFetching && !hasNextPage && (
                        <div className="text-muted-foreground py-2 text-center text-sm">
                          {t("noMoreData")}
                        </div>
                      )}
                      <div ref={ref} className="h-1" />
                    </CommandGroup>
                    {isFetching ? (
                      <div className="py-6 flex justify-center items-center">
                        <Spinner />
                      </div>
                    ) : (
                      <CommandEmpty>{t("noResults")}</CommandEmpty>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
