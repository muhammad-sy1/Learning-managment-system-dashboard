import { useCallback, useEffect, useRef, useState } from "react";

interface UseColorPickerProps {
    currentColor?: string;
    onColorChange: (color: string | undefined) => void;
}

export function useColorPicker({
    currentColor,
    onColorChange,
}: UseColorPickerProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [tempColor, setTempColor] = useState<string>("");
    const colorPickerRef = useRef<HTMLDivElement | null>(null);

    const openColorPicker = useCallback(() => {
        setTempColor(currentColor || "");
        setShowColorPicker(true);
    }, [currentColor]);

    const confirmColorSelection = useCallback(() => {
        onColorChange(tempColor || undefined);
        setShowColorPicker(false);
    }, [tempColor, onColorChange]);

    const removeColorSelection = useCallback(() => {
        onColorChange(undefined);
        setShowColorPicker(false);
    }, [onColorChange]);

    const closeColorPicker = useCallback(() => {
        setShowColorPicker(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                colorPickerRef.current &&
                !colorPickerRef.current.contains(event.target as Node)
            ) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showColorPicker]);

    return {
        showColorPicker,
        tempColor,
        colorPickerRef,
        setTempColor,
        openColorPicker,
        confirmColorSelection,
        removeColorSelection,
        closeColorPicker,
    };
}
