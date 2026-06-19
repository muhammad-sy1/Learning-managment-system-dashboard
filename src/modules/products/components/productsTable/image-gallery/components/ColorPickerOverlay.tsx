import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerOverlayProps {
    tempColor: string;
    currentColor?: string;
    colorPickerRef: React.RefObject<HTMLDivElement | null>;
    onColorChange: (color: string) => void;
    onConfirm: () => void;
    onRemove: () => void;
    onCancel: () => void;
}

export function ColorPickerOverlay({
    tempColor,
    currentColor,
    colorPickerRef,
    onColorChange,
    onConfirm,
    onRemove,
    onCancel,
}: ColorPickerOverlayProps) {
    return (
        <div
            ref={colorPickerRef}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md rounded-xl p-5 animate-in fade-in duration-300"
        >
            <div className="w-full max-w-sm space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                        اختر لونًا للصورة (اختياري):
                    </span>

                    <div
                        className="w-6 h-6 rounded-full border-2 border-muted shadow-sm"
                        style={{
                            backgroundColor: tempColor || "#3b82f6",
                        }}
                    />
                </div>

                <div className="flex justify-center">
                    <HexColorPicker
                        color={tempColor ? `#${tempColor}` : "#3b82f6"}
                        onChange={(color) => onColorChange(color.replace(/^#/, ""))}
                        className="w-full h-40"

                    />
                </div>


                <div className="absolute left-0 top-[35%] flex items-center justify-between rounded-lg px-3 py-2">
                    <span className="text-sm font-mono bg-background px-2 py-1 rounded-md border">
                        {tempColor || "لم يتم الاختيار"}
                    </span>
                </div>

                <div className="flex gap-3 justify-between pt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRemove}
                        className="min-w-20 bg-transparent"
                        disabled={!currentColor && !tempColor}
                        type="button"
                    >
                        إزالة اللون
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            className="min-w-20 bg-transparent"
                            type="button"
                        >
                            إلغاء
                        </Button>
                        <Button
                            size="sm"
                            onClick={onConfirm}
                            className="min-w-20 gap-1.5"
                            type="button"
                        >
                            <Check className="h-4 w-4" />
                            تأكيد
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
