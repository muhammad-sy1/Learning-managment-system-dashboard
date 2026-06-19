import type { ImageWithColor } from "@/modules/products/types/products";
import { EyeOff } from "lucide-react";

interface ImageInfoProps {
    currentIndex: number;
    totalImages: number;
    currentImage?: ImageWithColor;
}

export function ImageInfo({
    currentIndex,
    totalImages,
    currentImage,
}: ImageInfoProps) {
    return (
        <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
                الصورة {currentIndex + 1} من {totalImages}
                {currentImage?.isPreview && " (صورة جديدة)"}
            </p>
            <div className="flex items-center justify-center gap-3 mt-1">
                {currentImage?.color && (
                    <p className="text-xs text-muted-foreground">
                        تم اختيار لون للصورة
                    </p>
                )}
                {currentImage?.is_blur && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        صورة مغبشة
                    </p>
                )}
            </div>
        </div>
    );
}
