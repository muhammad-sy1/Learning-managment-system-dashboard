// components/form-fields/SizesField.tsx
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface SizesFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export default function FormSizesField({
  name,
  label,
  placeholder,
}: SizesFieldProps) {
  const form = useFormContext();
  const [sizeInputs, setSizeInputs] = useState<string[]>([]);
  const formT = useTranslations("Dashboard.ProductPage");

  useEffect(() => {
    const formSizes = form.getValues(name);
    if (Array.isArray(formSizes) && formSizes.length > 0) {
      setSizeInputs(formSizes);
    } else {
      setSizeInputs([""]);
      form.setValue(name, [""]);
    }
  }, [form, name]);

  const addSizeInput = () => {
    const newSizeInputs = [...sizeInputs, ""];
    setSizeInputs(newSizeInputs);
    form.setValue(name, newSizeInputs, { shouldDirty: true });
  };

  const removeSizeInput = (index: number) => {
    if (sizeInputs.length > 1) {
      const newSizeInputs = [...sizeInputs];
      newSizeInputs.splice(index, 1);
      setSizeInputs(newSizeInputs);
      form.setValue(name, newSizeInputs, { shouldDirty: true });
    }
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizeInputs = [...sizeInputs];
    newSizeInputs[index] = value;
    setSizeInputs(newSizeInputs);
    form.setValue(name, newSizeInputs, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex-1 space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none">{label}</label>
        )}
        {sizeInputs.map((size, index) => (
          <div key={index} className="flex flex-1  items-center gap-2 mb-5">
            {/* <FormInput
            name="sizes"
              onChange={(e) => handleSizeChange(index, e.target.value)}
              type="text"
              placeholder={placeholder}
              value={size}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            /> */}
            <div className="relative w-full ">
              <input
                type="text"
                placeholder={placeholder}
                value={size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
                maxLength={10}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />{" "}
              <span className="absolute mt-1 text-[12px] dark:text-gray-200 px-2">
                {size.length}/{10}
              </span>
            </div>

            {sizeInputs.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSizeInput(index)}
                className="h-10 w-10 shrink-0 "
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addSizeInput}
        className="mt-2 bg-transparent"
      >
        <Plus className="h-4 w-4" />
        {formT("fields.addSize")}
      </Button>
    </div>
  );
}
