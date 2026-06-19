import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState, type InputHTMLAttributes } from "react";
import {
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileDropzone from "../ui/file-dropzone";
import { getFileType } from "@/utils/fileType";

interface FormDropZoneProps<TFormValues extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue"> {
  control?: Control<TFormValues>;
  name: Path<TFormValues>;
  allowVideo?: boolean;
  videoOnly?: boolean;
  label?: string;
  description?: string;
  Icon?: React.ReactNode;
  labelClassName?: string;
  placeholder?: string;
  hint?: string;
  defaultValue?: string | number | readonly string[];
}

type PreviewType = "image" | "video";

export default function FormDropZone<TFormValues extends FieldValues>({
  label,
  name,
  description,
  allowVideo,
  videoOnly,
  labelClassName,
  placeholder,
  hint,
}: FormDropZoneProps<TFormValues>) {
  const form = useFormContext<TFormValues>();
  const [localPreview, setLocalPreview] = useState<
    { url: string; type: PreviewType } | undefined
  >();

  useEffect(() => {
    return () => {
      if (localPreview?.url.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview.url);
      }
    };
  }, [localPreview]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-2">
          {label && (
            <FormLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative mb-4 flex h-fit items-center justify-start">
              <FileDropzone
                value={field.value as File | string | null | undefined}
                accept={
                  videoOnly
                    ? { "video/*": [".mp4", ".mov", ".avi", ".webm"] }
                    : allowVideo
                    ? {
                        "image/*": [".png", ".jpg", ".jpeg"],
                        "video/*": [".mp4", ".mov", ".avi", ".webm"],
                      }
                    : { "image/*": [".png", ".jpg", ".jpeg"] }
                }
                maxFiles={1}
                placeholder={
                  placeholder ??
                  (videoOnly
                    ? "Upload video"
                    : allowVideo
                    ? "Upload image or video"
                    : "Upload image")
                }
                hint={hint}
                onChange={(file) => {
                  if (localPreview?.url.startsWith("blob:")) {
                    URL.revokeObjectURL(localPreview.url);
                  }

                  if (!file) {
                    setLocalPreview(undefined);
                    field.onChange(null);
                    return;
                  }

                  const previewUrl = URL.createObjectURL(file);
                  setLocalPreview({
                    url: previewUrl,
                    type: file.type.startsWith("video") ? "video" : "image",
                  });

                  field.onChange(file);
                }}
                renderValue={(value) => {
                  const previewSource =
                    value instanceof File
                      ? localPreview
                        ? { url: localPreview.url, type: localPreview.type }
                        : {
                            url: "",
                            type: value.type.startsWith("video")
                              ? "video"
                              : "image",
                          }
                      : {
                          url: value,
                          type:
                            getFileType(value) === "video" ? "video" : "image",
                        };

                  if (!previewSource.url) {
                    return (
                      <div className="py-8 text-sm text-muted-foreground">
                        File selected
                      </div>
                    );
                  }

                  if (previewSource.type === "video") {
                    return (
                      <video
                        className="h-[150px] w-full object-contain"
                        src={previewSource.url}
                        controls
                      />
                    );
                  }

                  return (
                    <div className="h-[150px] w-full">
                      <Image
                        alt="Preview"
                        className="absolute top-0 left-0 h-full w-full object-contain"
                        src={previewSource.url}
                        width={200}
                        height={110}
                        loading="lazy"
                      />
                    </div>
                  );
                }}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
