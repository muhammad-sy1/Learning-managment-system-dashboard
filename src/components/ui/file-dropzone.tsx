"use client";

import type { ReactNode } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  type DropzoneProps,
} from "@/components/ui/shadcn-io/dropzone";

type FileValue = File | string | null | undefined;

interface FileDropzoneProps {
  value?: FileValue;
  onChange: (file: File | null) => void;
  accept?: DropzoneProps["accept"];
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  hint?: string;
  renderValue?: (value: File | string) => ReactNode;
}

const isFilledValue = (value?: FileValue): value is File | string =>
  value instanceof File || (typeof value === "string" && value.length > 0);

const toDropzoneSrc = (value?: FileValue): File[] | string | undefined => {
  if (value instanceof File) return [value];
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
};

export default function FileDropzone({
  value,
  onChange,
  accept,
  maxFiles = 1,
  disabled,
  className,
  placeholder = "Upload a file",
  hint = "Drag and drop or click to upload",
  renderValue,
}: FileDropzoneProps) {
  const hasValue = isFilledValue(value);
  const src = toDropzoneSrc(value);

  return (
    <Dropzone
      accept={accept}
      maxFiles={maxFiles}
      disabled={disabled}
      src={src}
      className={className}
      onDrop={(acceptedFiles) => {
        onChange(acceptedFiles[0] ?? null);
      }}
      onError={console.error}
    >
      <DropzoneEmptyState>
        <p className="my-2 w-full truncate text-wrap font-medium text-sm">
          {placeholder}
        </p>
        <p className="w-full truncate text-wrap text-muted-foreground text-xs">
          {hint}
        </p>
      </DropzoneEmptyState>

      {hasValue && (
        <DropzoneContent>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              onChange(null);
            }}
            disabled={disabled}
          >
            <XIcon className="h-4 w-4" />
          </Button>

          {renderValue ? (
            renderValue(value)
          ) : (
            <div className="flex flex-col gap-1 text-center">
              <p className="text-sm font-medium truncate w-full">
                {value instanceof File ? value.name : "Current file"}
              </p>
              {value instanceof File && (
                <p className="text-xs text-muted-foreground">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          )}
        </DropzoneContent>
      )}
    </Dropzone>
  );
}
