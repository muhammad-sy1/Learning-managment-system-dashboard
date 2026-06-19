"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value?: string;
  onChange: (value: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  error?: string; // For displaying validation errors from form
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string>("");
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    setErrors("");
    if (!acceptedTypes.includes(file.type)) {
      setErrors("Invalid file type");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setErrors("File is too large");
      return;
    }

    setIsUploading(true);

    onChange(file);
    setIsUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileSelect({
          target: input,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />
      <div className="relative">
        {value ? (
          <div className="relative w-48 h-48 rounded-lg  border-2 border-border">
            {typeof value === "string" ? (
              <Image
                src={value}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src={URL.createObjectURL(value)}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            )}

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -end-2 h-6 w-6 z-10"
              onClick={onRemove}
              disabled={disabled || isUploading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "w-48 h-48 border-2 border-dashed border-border rounded-lg",
              "flex flex-col items-center justify-center cursor-pointer",
              "hover:border-primary/50 hover:bg-muted/50 transition-colors",
              "group",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() =>
              !disabled && !isUploading && fileInputRef.current?.click()
            }
            onDrop={handleDrop}
            onDragOver={handleDragOver}>
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-xs text-muted-foreground">
                  Uploading...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">Upload Image</p>
                  <p className="text-xs text-muted-foreground">
                    Click or drag to upload
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {errors && <p className="text-sm text-red-500 my-1">{errors}</p>}
      </div>
    </div>
  );
}
