import { cn } from "@/lib/utils";

interface ImageNavigationDotsProps {
    totalImages: number;
    currentIndex: number;
    onNavigate: (index: number) => void;
}

export function ImageNavigationDots({
    totalImages,
    currentIndex,
    onNavigate,
}: ImageNavigationDotsProps) {
    if (totalImages <= 1) return null;

    return (
        <div className="flex justify-center space-x-3 py-2">
            {Array.from({ length: totalImages }).map((_, index) => (
                <button
                    key={index}
                    className={cn(
                        "h-3 w-3 rounded-full transition-all duration-300",
                        index === currentIndex
                            ? "bg-primary scale-125"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    onClick={() => onNavigate(index)}
                    aria-label={`انتقل إلى الصورة ${index + 1}`}
                    type="button"
                />
            ))}
        </div>
    );
}
