"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import type { IProduct } from "../../types/products";

interface ProductFieldInlineEditorProps {
  product: IProduct;
  productPermessions: string;
  field:
    | "name"
    | "description"
    | "review_note"
    | "main_price"
    | "new_price"
    | "weight"
    | "available_from"
    | "available_to"
    | "avg_preparation_minutes";
  label: string;
  variant?: "table" | "card";
  type?: "text" | "number" | "textarea" | "time";
  placeholder?: string;
}

export default function ProductFieldInlineEditor({
  product,
  productPermessions,
  field,
  label,
  variant = "table",
  type = "text",
  placeholder,
}: ProductFieldInlineEditorProps) {
  const { canUpdate } = usePermissionStore();
  const tCommon = useTranslations("confirmation");
  const editable = canUpdate(productPermessions);

  const rawInitialValue = String(product[field as keyof IProduct] ?? "");
  const initialValue = type === "time" ? rawInitialValue.slice(0, 5) : rawInitialValue;

  const [value, setValue] = useState<string>(initialValue);
  const [editingField, setEditingField] = useState<string | null>(null);

  const { mutate, isPending: isUpdating } = useUpdateProduct();

  useEffect(() => {
    setValue(initialValue);
    setEditingField(null);
  }, [product.id, initialValue]);

  const isEditing = editingField === field;

  const handleSave = () => {
    if (value.trim() === initialValue) {
      setEditingField(null);
      return;
    }

    const updateData: Record<string, any> = {};

    if (
      field === "main_price" ||
      field === "new_price" ||
      field === "weight" ||
      field === "avg_preparation_minutes"
    ) {
      updateData[field] = Number(value) || 0;
    } else {
      updateData[field] = value;
    }

    mutate({
      id: product.id,
      productData: updateData,
    });

    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setValue(initialValue);
      setEditingField(null);
    }
  };

  return (
    <div
      className={variant === "card" ? "space-y-2 w-full" : "w-full space-y-2"}
    >
      {variant === "card" && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}

      <div className="flex flex-col items-start gap-2 px-1 py-1">
        {!isEditing ? (
          <>
            {type === "textarea" ? (
              <p className="w-full text-sm font-medium line-clamp-2 break-words whitespace-pre-wrap">
                {initialValue || "-"}
              </p>
            ) : (
              <span className="w-full text-sm font-medium line-clamp-2 break-words">
                {initialValue || "-"}
              </span>
            )}

            {editable && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingField(field);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground active:bg-muted/90 focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
                aria-label={`Edit ${field}`}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </>
        ) : null}
      </div>

      {isEditing ? (
        <div className="w-full px-1 space-y-2">
          {type === "textarea" ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[80px] resize-none"
              disabled={isUpdating}
              autoFocus
            />
          ) : (
            <Input
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isUpdating}
              autoFocus
            />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {tCommon("confirm")}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue(initialValue);
                setEditingField(null);
              }}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {tCommon("cancel")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
