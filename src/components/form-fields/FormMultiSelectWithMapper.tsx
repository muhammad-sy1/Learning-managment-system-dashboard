"use client";

import React from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Badge } from "../ui/badge";
import Spinner from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";

interface FormMultiSelectWithMapperProps<
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
  queryKey: string[];
  onChange?: (value: string[]) => void;
  fetchFn: (options?: Record<string, any>) => Promise<IApiResponse<TRaw>>;
  getOptionArray: (rawData: TRaw | undefined) => TOption[];
  getOptionLabel: (item: TOption) => string;
  getOptionValue?: (item: TOption) => string | number;
  name: Path<TFormValues>;
}

export default function FormMultiSelectWithMapper<
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
}: FormMultiSelectWithMapperProps<TFormValues, TOption, TRaw>) {
  const form = useFormContext<TFormValues>();

  const { data, isLoading, isFetching } = useQuery<
    IApiResponse<TRaw> | undefined
  >({
    queryKey,
    queryFn: () => fetchFn(),
  });

  const raw = data?.data;
  const options: TOption[] = getOptionArray(raw);

  const getSelectedOptionLabels = (selectedValues: string[]) => {
    return selectedValues
      .map((value) => {
        const option = options.find(
          (opt) => String(getOptionValue(opt)) === value
        );
        return option ? getOptionLabel(option) : value;
      })
      .filter(Boolean);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value.map(String)
          : [];

        return (
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
                onValueChange={(val) => {
                  let updated: string[];
                  if (selectedValues.includes(val)) {
                    updated = selectedValues.filter((v) => v !== val);
                  } else {
                    updated = [...selectedValues, val];
                  }
                  field.onChange(updated);
                  onChange?.(updated);
                }}
                disabled={disabled || isLoading || isFetching}
                required={required}
              >
                <SelectTrigger
                  id={String(name)}
                  className={cn("max-w-80  py-2", className)}
                >
                  <div className="flex flex-wrap gap-1 w-full items-center">
                    {selectedValues.length > 0 ? (
                      <>
                        {getSelectedOptionLabels(selectedValues).map(
                          (label, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 text-xs"
                            >
                              {label}
                            </Badge>
                          )
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        {placeholder}
                      </span>
                    )}
                  </div>
                </SelectTrigger>

                <SelectContent id={String(name)} className="max-h-56">
                  {options.map((item) => {
                    const value = String(getOptionValue(item));
                    const isSelected = selectedValues.includes(value);

                    return (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                          />
                          {getOptionLabel(item)}
                        </div>
                      </SelectItem>
                    );
                  })}

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
        );
      }}
    />
  );
}
