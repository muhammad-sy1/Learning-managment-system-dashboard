// FormCheckbox.tsx
"use client";

import { Checkbox } from "../ui/checkbox";
import { Controller, useFormContext } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface Props {
  name: string;
  label?: string;
  description?: string;
  options?: Option[];
  orientation?: "horizontal" | "vertical";
}

export default function FormCheckbox({ 
  name, 
  label, 
  description, 
  options,
  orientation = "vertical" 
}: Props) {
  const { control } = useFormContext();

  if (!options) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const handleChange = (checked: boolean) => {
            field.onChange(checked ? 1 : 0);
          };

          return (
            <div className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={field.value === "1" || field.value === 1}
                  onCheckedChange={handleChange}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>

              {description && (
                <p className="pl-6 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          );
        }}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field,fieldState  }) => {
        const currentValue: string[] = Array.isArray(field.value) ? field.value : [];
        
        const handleOptionChange = (optionValue: string, checked: boolean) => {
          let newValue: string[];
          
          if (checked) {
            newValue = [...currentValue, optionValue];
          } else {
            newValue = currentValue.filter(value => value !== optionValue);
          }
          
          field.onChange(newValue);
        };

        const isChecked = (optionValue: string) => {
          return currentValue.includes(optionValue);
        };

        return (
          <div className="space-y-3">
            {label && (
              <div className="text-sm font-medium">{label}</div>
            )}
            
            <div className={orientation === "horizontal" ? "flex flex-wrap gap-4" : "space-y-2"}>
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={isChecked(option.value)}
                    onCheckedChange={(checked) => 
                      handleOptionChange(option.value, checked as boolean)
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>

            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {fieldState.error && (
          <p className="text-xs text-destructive mt-1">
            {fieldState.error.message}
          </p>
        )}
          </div>
        );
      }}
    />
  );
}