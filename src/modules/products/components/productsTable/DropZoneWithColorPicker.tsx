"use client";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { cn } from "@/lib/utils";
import type { ArrayPath, Control, FieldValues } from "react-hook-form";
import type { ImageWithColor } from "../../types/products";
import {
  ColorPickerOverlay,
  EmptyDropzoneState,
  ImageInfo,
  ImageNavigationDots,
  ImagePreview,
  useColorPicker,
  useImageGallery,
} from "./image-gallery";

interface FormDropZoneProps<TFormValues extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue"
> {
  control?: Control<TFormValues>;
  name: ArrayPath<TFormValues>;
  label?: string;
  description?: string;
  Icon?: React.ReactNode;
  labelClassName?: string;
  defaultValue?: ImageWithColor[];
}

export default function DropZoneWithColorPicker<
  TFormValues extends FieldValues,
>({
  label,
  name,
  description,
  labelClassName,
}: FormDropZoneProps<TFormValues>) {
  const {
    visibleImages,
    currentImage,
    currentIndex,
    isNavigating,
    handleDrop,
    removeImage,
    updateImage,
    replaceImage,
    goToNext,
    goToPrev,
    goToImage,
    images,
  } = useImageGallery<TFormValues>(name);

  const {
    showColorPicker,
    tempColor,
    colorPickerRef,
    setTempColor,
    openColorPicker,
    confirmColorSelection,
    removeColorSelection,
    closeColorPicker,
  } = useColorPicker({
    currentColor: currentImage?.color,
    onColorChange: (color) => updateImage({ color }),
  });

  const handleDelete = () => {
    const imageIndex = images.findIndex(
      (img: any) => img?._key === (currentImage as any)?._key,
    );
    if (imageIndex !== -1) removeImage(imageIndex);
  };

  const handleToggleBlur = () => {
    updateImage({ is_blur: currentImage?.is_blur === 1 ? 0 : 1 });
  };

  const handleNavigate = (callback: () => void) => {
    closeColorPicker();
    callback();
  };

  if (!visibleImages.length && !showColorPicker) {
    return (
      <FormItem className="mt-2">
        {label && (
          <FormLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
            {label}
          </FormLabel>
        )}
        <FormControl>
          <Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            onDrop={handleDrop}
            onError={console.error}
            multiple
            maxFiles={2}
          >
            <DropzoneEmptyState />
            <DropzoneContent>
              <EmptyDropzoneState />
            </DropzoneContent>
          </Dropzone>
        </FormControl>
        {description && (
          <FormDescription className="text-sm text-muted-foreground mt-2">
            {description}
          </FormDescription>
        )}
        <FormMessage />
      </FormItem>
    );
  }
  type EyeDropperConstructor = new () => {
    open: () => Promise<{ sRGBHex: string }>;
  };

  const handleEyeDropper = async () => {
    try {
      const EyeDropperCtor = (
        window as Window & { EyeDropper?: EyeDropperConstructor }
      ).EyeDropper;

      if (!EyeDropperCtor) {
        alert("EyeDropper غير مدعوم في هذا المتصفح");
        return;
      }

      const eyeDropper = new EyeDropperCtor();
      const result = await eyeDropper.open();
      const selectedColor = result.sRGBHex.replace(/^#/, "");

      updateImage({ color: selectedColor });
    } catch {
      // User cancelled
    }
  };

  return (
    <FormItem className="mt-2">
      {label && (
        <FormLabel htmlFor={name} className={cn("mb-1", labelClassName)}>
          {label}
        </FormLabel>
      )}
      <FormControl>
        <div className="space-y-4">
          <Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            onDrop={handleDrop}
            onError={console.error}
            multiple
            maxFiles={5}
          >
            <DropzoneEmptyState />
            <DropzoneContent>
              <EmptyDropzoneState />
            </DropzoneContent>
          </Dropzone>

          {visibleImages.length > 0 && currentImage && (
            <div className="border rounded-xl p-5 space-y-4 bg-card shadow-sm relative">
              <div className="relative">
                <ImagePreview
                  image={currentImage}
                  handleEyeDropper={handleEyeDropper}
                  currentIndex={currentIndex}
                  totalImages={visibleImages.length}
                  isNavigating={isNavigating}
                  showColorPicker={showColorPicker}
                  onPrevious={() => handleNavigate(goToPrev)}
                  onNext={() => handleNavigate(goToNext)}
                  onDelete={handleDelete}
                  onReplace={replaceImage}
                  onToggleBlur={handleToggleBlur}
                  onOpenColorPicker={openColorPicker}
                />

                {showColorPicker && (
                  <ColorPickerOverlay
                    tempColor={tempColor}
                    currentColor={currentImage.color}
                    colorPickerRef={colorPickerRef}
                    onColorChange={setTempColor}
                    onConfirm={confirmColorSelection}
                    onRemove={removeColorSelection}
                    onCancel={closeColorPicker}
                  />
                )}
              </div>

              <ImageNavigationDots
                totalImages={visibleImages.length}
                currentIndex={currentIndex}
                onNavigate={(index) => handleNavigate(() => goToImage(index))}
              />

              <ImageInfo
                currentIndex={currentIndex}
                totalImages={visibleImages.length}
                currentImage={currentImage}
              />
            </div>
          )}
        </div>
      </FormControl>
      {description && (
        <FormDescription className="text-sm text-muted-foreground mt-2">
          {description}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
