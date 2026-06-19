import type { ImageWithColor } from "@/modules/products/types/products";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ArrayPath,
    Path,
    PathValue,
    useFieldArray,
    useFormContext,
    type FieldValues,
} from "react-hook-form";

export function useImageGallery<TFormValues extends FieldValues>(
    name: ArrayPath<TFormValues>
) {
    const form = useFormContext<TFormValues>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const urlsToCleanup = useRef<Set<string>>(new Set());

    const { append, remove, fields, update } = useFieldArray({
        control: form.control,
        name: name as ArrayPath<TFormValues>,
        keyName: "_key",
    });

    const images = fields as unknown as ImageWithColor[];
    const visibleImages = images.filter((img) => !img.markedForDelete);
    const currentImage = visibleImages[currentIndex];

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newImages = acceptedFiles.map((file) => {
                const url = URL.createObjectURL(file);
                urlsToCleanup.current.add(url);

                return {
                    file,
                    url,
                    isPreview: true,
                    color: undefined,
                    is_blur: 0,
                    markedForDelete: false,
                } as PathValue<TFormValues, ArrayPath<TFormValues>>[number];
            });

            append(newImages);
            setCurrentIndex(images.length);
        },
        [append, images.length]
    );

    const removeImage = useCallback(
        (index: number) => {
            const imageToRemove = images[index];

            if (imageToRemove?.serverId) {
                const prev = (form.getValues(
                    "old_images_to_delete" as Path<TFormValues>
                ) ?? []) as unknown as (number | string)[];
                form.setValue(
                    "old_images_to_delete" as Path<TFormValues>,
                    [...prev, imageToRemove.serverId] as unknown as PathValue<
                        TFormValues,
                        Path<TFormValues>
                    >
                );
            }

            if (imageToRemove.isPreview && imageToRemove.url) {
                URL.revokeObjectURL(imageToRemove.url);
                urlsToCleanup.current.delete(imageToRemove.url);
            }

            remove(index);

            if (index === currentIndex) {
                const newIndex = Math.max(
                    0,
                    Math.min(currentIndex, visibleImages.length - 2)
                );
                setCurrentIndex(newIndex);
            }
        },
        [currentIndex, images, remove, visibleImages.length, form]
    );

    const updateImage = useCallback(
        (updates: Partial<ImageWithColor>) => {
            if (!currentImage) return;

            const imageIndex = images.findIndex(
                (img: any) => img?._key === (currentImage as any)?._key
            );

            if (imageIndex === -1) return;

            update(imageIndex, {
                ...currentImage,
                ...updates,
            } as PathValue<TFormValues, ArrayPath<TFormValues>>[number]);
        },
        [currentImage, images, update]
    );

    const replaceImage = useCallback(
        (file: File) => {
            if (!currentImage) return;

            const imageIndex = images.findIndex(
                (img: any) => img?._key === (currentImage as any)?._key
            );

            if (imageIndex === -1) return;

            if (currentImage.isPreview && currentImage.url) {
                URL.revokeObjectURL(currentImage.url);
                urlsToCleanup.current.delete(currentImage.url);
            }

            if (currentImage.serverId) {
                const prev = (form.getValues(
                    "old_images_to_delete" as Path<TFormValues>
                ) ?? []) as unknown as (number | string)[];
                form.setValue(
                    "old_images_to_delete" as Path<TFormValues>,
                    [...prev, currentImage.serverId] as unknown as PathValue<
                        TFormValues,
                        Path<TFormValues>
                    >
                );
            }

            const newUrl = URL.createObjectURL(file);
            urlsToCleanup.current.add(newUrl);

            update(imageIndex, {
                file,
                url: newUrl,
                isPreview: true,
                color: currentImage.color,
                is_blur: currentImage.is_blur || 0,
                markedForDelete: false,
                serverId: undefined,
            } as PathValue<TFormValues, ArrayPath<TFormValues>>[number]);
        },
        [currentImage, images, update, form]
    );

    const goToNext = useCallback(() => {
        if (visibleImages.length <= 1) return;

        setIsNavigating(true);
        setCurrentIndex((prev) => (prev + 1) % visibleImages.length);

        setTimeout(() => setIsNavigating(false), 150);
    }, [visibleImages.length]);

    const goToPrev = useCallback(() => {
        if (visibleImages.length <= 1) return;

        setIsNavigating(true);
        setCurrentIndex(
            (prev) => (prev - 1 + visibleImages.length) % visibleImages.length
        );

        setTimeout(() => setIsNavigating(false), 150);
    }, [visibleImages.length]);

    const goToImage = useCallback(
        (index: number) => {
            if (index < 0 || index >= visibleImages.length || index === currentIndex)
                return;

            setIsNavigating(true);
            setCurrentIndex(index);

            setTimeout(() => setIsNavigating(false), 150);
        },
        [currentIndex, visibleImages.length]
    );

    // Clean up temporary URLs when component unmounts
    useEffect(() => {
        return () => {
            urlsToCleanup.current.forEach((url) => URL.revokeObjectURL(url));
            urlsToCleanup.current.clear();
        };
    }, []);

    // Reset current index when images change
    useEffect(() => {
        if (visibleImages.length === 0) {
            setCurrentIndex(0);
        } else if (currentIndex >= visibleImages.length) {
            setCurrentIndex(Math.max(0, visibleImages.length - 1));
        }
    }, [currentIndex, visibleImages.length]);

    return {
        images,
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
    };
}
