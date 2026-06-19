import { Upload } from "lucide-react";

export function EmptyDropzoneState() {
    return (
        <div className="text-center p-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-foreground mb-1">
                اسحب الصور هنا أو انقر للتحميل
            </p>
            <p className="text-sm text-muted-foreground">
                يمكنك تحميل عدة صور مرة واحدة (PNG, JPG, JPEG, WEBP)
            </p>
        </div>
    );
}
