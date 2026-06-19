import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ImageWithColor } from "@/modules/products/types/products";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Palette,
    Pipette,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface ImagePreviewProps {
    image: ImageWithColor;
    currentIndex: number;
    totalImages: number;
    isNavigating: boolean;
    showColorPicker: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onDelete: () => void;
    onReplace: (file: File) => void;
    onToggleBlur: () => void;
    onOpenColorPicker: () => void;
    handleEyeDropper: () => void;
}

export function ImagePreview({
    image,
    currentIndex,
    totalImages,
    isNavigating,
    handleEyeDropper,
    showColorPicker,
    onPrevious,
    onNext,
    onDelete,
    onReplace,
    onToggleBlur,
    onOpenColorPicker,
}: ImagePreviewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleReplaceClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            onReplace(file);
        }
        event.target.value = "";
    };

    const getImageUrl = (img: ImageWithColor) => {
        if (img.isPreview) {
            return img.url;
        }
        return `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${img.url}`;
    };
    console.log("image", image)

    return (
        <div className="relative h-80 w-full rounded-xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center group">
            <Image
                src={getImageUrl(image)}
                alt={`صورة ${currentIndex + 1}`}
                fill
                className={cn(
                    "object-contain transition-opacity duration-300",
                    isNavigating ? "opacity-70" : "opacity-100",
                    image.is_blur == 1 && "blur-md"
                )}
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                    console.error("فشل تحميل الصورة:", e);
                }}
            />

            {image.is_blur == 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <EyeOff className="h-4 w-4" />
                            صورة مغبشة
                        </span>
                    </div>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
            />

            {/* Color and Blur buttons */}
            {!showColorPicker && (
                <div className="absolute top-3 left-3 flex gap-2 z-20">
                    {image.color ? (
                        <button
                            type="button"
                            className="flex items-center gap-2 bg-background/90 backdrop-blur-md rounded-full py-1.5 pl-1.5 pr-2.5 shadow-lg border hover:bg-background transition-colors"
                            onClick={onOpenColorPicker}
                        >
                            <div
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: `#${image.color}` }}
                            />
                            <span className="text-xs font-medium text-foreground">
                                {image.color}
                            </span>
                        </button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="bg-secondary/90 backdrop-blur-md p-2 hover:bg-secondary shadow-md"
                            onClick={onOpenColorPicker}
                            title="اختر لونًا للصورة"
                            type="button"
                        >
                            <Palette className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        variant={image.is_blur === 1 ? "default" : "secondary"}
                        size="icon"
                        className={cn(
                            "backdrop-blur-md p-2  shadow-md",
                            image.is_blur === 1
                                ? "bg-primary/90 hover:bg-primary"
                                : "bg-secondary/90 hover:bg-secondary"
                        )}
                        onClick={onToggleBlur}
                        title={image.is_blur === 1 ? "إلغاء التغبيش" : "تغبيش الصورة"}
                        type="button"
                    >
                        {image.is_blur === 1 ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={handleEyeDropper}
                        className="h-8 w-8 p-0"
                    >
                        <Pipette className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Navigation buttons */}
            {totalImages > 1 && (
                <>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-background/90 backdrop-blur-md hover:bg-background shadow-md z-20"
                        onClick={onPrevious}
                        type="button"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-background/90 backdrop-blur-md hover:bg-background shadow-md z-20"
                        onClick={onNext}
                        type="button"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </>
            )}

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
                <Button
                    variant="secondary"
                    size="icon"
                    className="bg-background/90 backdrop-blur-md hover:bg-background shadow-md"
                    onClick={handleReplaceClick}
                    title="استبدال الصورة (سيتم الاحتفاظ باللون)"
                    type="button"
                >
                    <Upload className="h-4 w-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    className="bg-destructive/90 backdrop-blur-md hover:bg-destructive shadow-md"
                    onClick={onDelete}
                    type="button"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
