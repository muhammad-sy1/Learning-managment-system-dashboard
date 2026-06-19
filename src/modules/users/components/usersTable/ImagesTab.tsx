"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { cn } from "@/lib/utils";
import { ImagePlus, RefreshCcw, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDeleteMerchantCoPriceListImage } from "../../hooks/useDeleteMerchantCoPriceListImage";
import { useUploadMerchantCoPriceListImage } from "../../hooks/useUploadMerchantCoPriceListImage";
import { IMerchantCoPriceListImage } from "../../types/users";

interface ImagesTabProps {
  merchantId: number;
  images: IMerchantCoPriceListImage[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

export default function ImagesTab({
  merchantId,
  images,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: ImagesTabProps) {
  const t = useTranslations(
    "Dashboard.USERS.merchantManagement.customOrderPriceList",
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { mutate: uploadImage, isPending: isUploading } =
    useUploadMerchantCoPriceListImage(merchantId);
  const {
    mutate: deleteImage,
    isPending: isDeleting,
    variables: deletingImageId,
  } = useDeleteMerchantCoPriceListImage(merchantId);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    };
  }, [selectedFiles]);

  function clearSelection() {
    setSelectedFiles([]);
  }

  function handleSelectedFiles(files: File[]) {
    if (files.length > 5) {
      toast.error(t("maxImagesError"));
    }

    setSelectedFiles(files.slice(0, 5));
  }

  function handleUpload() {
    if (selectedFiles.length === 0) return;

    uploadImage(selectedFiles, {
      onSuccess: () => clearSelection(),
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          {errorMessage || t("loadError")}
        </p>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 space-y-4">
        <div className="space-y-2">
          <Label>{t("selectImage")}</Label>
          <Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
            disabled={isUploading}
            src={selectedFiles.length > 0 ? selectedFiles : undefined}
            onDrop={(acceptedFiles) => handleSelectedFiles(acceptedFiles)}
            onError={(error) => toast.error(error.message || t("maxImagesError"))}
            className="min-h-36"
          >
            <DropzoneEmptyState>
              <div className="flex flex-col items-center justify-center">
                <div className="my-2 w-full truncate text-wrap font-medium text-sm">
                  {t("selectImage")}
                </div>
                <p className="w-full truncate text-wrap text-muted-foreground text-xs">
                  {t("uploadHint")}
                </p>
              </div>
            </DropzoneEmptyState>
            {selectedFiles.length > 0 && (
              <DropzoneContent className="w-full">
                <div className="flex w-full flex-col items-center justify-center gap-1">
                  <p className="w-full truncate text-center font-medium text-sm">
                    {selectedFiles.length} / 5
                  </p>
                  <p className="w-full text-wrap text-center text-muted-foreground text-xs">
                    {t("replaceImagesHint")}
                  </p>
                </div>
              </DropzoneContent>
            )}
          </Dropzone>
          <p className="text-xs text-muted-foreground">{t("uploadHint")}</p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t("preview")} ({selectedFiles.length}/5)
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {previewUrls.map((previewUrl, index) => (
                <div
                  key={`${previewUrl}-${index}`}
                  className="overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={selectedFiles[index]?.name || t("imageAlt")}
                    className={cn("h-40 w-full object-cover")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={clearSelection} disabled={isUploading}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <Spinner className="size-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {t("uploadImage")}
          </Button>
        </div>
      </div>

      {images.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("emptyImages")}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => {
            const imageId = image.id;
            const isDeletingThisImage =
              isDeleting &&
              deletingImageId !== undefined &&
              deletingImageId === imageId;

            return (
              <div
                key={imageId ?? `${image.image}-${index}`}
                className="rounded-lg border p-3 space-y-3"
              >
                <SafeImage
                  imageUrl={image.image}
                  alt={t("imageAlt")}
                  className="h-40 w-full rounded-lg"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImagePlus className="h-4 w-4" />
                    <span>{t("imageLabel", { index: index + 1 })}</span>
                  </div>

                  {typeof imageId === "number" ? (
                    <AreYouSureDeleteing
                      TriggerButton={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={isDeletingThisImage}
                        >
                          {isDeletingThisImage ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      }
                      onAccept={() => deleteImage(imageId)}
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled
                      title={t("missingImageId")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
