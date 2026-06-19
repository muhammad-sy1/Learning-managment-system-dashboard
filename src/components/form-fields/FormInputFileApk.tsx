import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Controller,
  useFormContext,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import FileDropzone from "@/components/ui/file-dropzone";
import { Progress } from "../ui/progress";

interface FormFileApkProps<TFormValues extends FieldValues> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  checked?: boolean;
  placeholder?: string;
  hint?: string;
}

export default function FormInputFileApk<TFormValues extends FieldValues>({
  name,
  className,
  label,
  description,
  disabled,
  placeholder,
  hint,
}: FormFileApkProps<TFormValues>) {
  const form = useFormContext<TFormValues>();
  const selectedFile = useWatch({ control: form.control, name }) as
    | File
    | string
    | null
    | undefined;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!(selectedFile instanceof File)) {
      setProgress(0);
      return;
    }

    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 15;
      if (value >= 100) {
        value = 100;
        clearInterval(interval);
      }
      setProgress(value);
    }, 120);

    return () => clearInterval(interval);
  }, [selectedFile]);

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend className="mb-1.5">{label}</FieldLegend>
          <FieldDescription>{description}</FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <Field className={cn(className)}>
              <FileDropzone
                disabled={disabled}
                value={field.value as File | string | null | undefined}
                accept={{
                  "application/vnd.android.package-archive": [".apk"],
                }}
                placeholder={placeholder}
                hint={hint}
                onChange={(file) => {
                  setProgress(0);
                  field.onChange(file);
                }}
                renderValue={(value) => (
                  <div className="w-full space-y-3 text-start">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium">
                        {value instanceof File ? value.name : String(value)}
                      </span>
                      {value instanceof File && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {(value.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                    {value instanceof File && (
                      <Progress
                        value={progress}
                        className="transition-all duration-300"
                      />
                    )}
                  </div>
                )}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          </FieldGroup>
        </FieldSet>
      )}
    />
  );
}
