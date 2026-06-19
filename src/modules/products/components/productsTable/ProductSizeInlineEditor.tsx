"use client";

import { Input } from "@/components/ui/input";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import type { IProduct } from "../../types/products";

const splitSizes = (value?: string | null) =>
  value
    ? value
        .split(/[;,]/)
        .map((size) => size.trim())
        .filter(Boolean)
    : [];

interface ProductSizeInlineEditorProps {
  product: IProduct;
  productPermessions: string;
  label: string;
  variant?: "table" | "card";
}

export default function ProductSizeInlineEditor({
  product,
  productPermessions,
  label,
  variant = "table",
}: ProductSizeInlineEditorProps) {
  const { canUpdate } = usePermissionStore();
  const tCommon = useTranslations("confirmation");
  const editable = canUpdate(productPermessions);

  const initialSizes = splitSizes(product.sizes);

  const [sizes, setSizes] = useState<string[]>(initialSizes);
  const [newSize, setNewSize] = useState<string>("");
  const [editingField, setEditingField] = useState<boolean>(false);

  const { mutate, isPending: isUpdating } = useUpdateProduct();

  useEffect(() => {
    setSizes(splitSizes(product.sizes));
    setEditingField(false);
    setNewSize("");
  }, [product.id, product.sizes]);

  const handleAddSize = () => {
    const nextSizes = splitSizes(newSize).filter(
      (size) => !sizes.includes(size),
    );

    if (nextSizes.length > 0) {
      setSizes([...sizes, ...nextSizes]);
    }

    setNewSize("");
  };

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const sizeString = sizes.join(",");
    if (sizeString === product.sizes) {
      setEditingField(false);
      return;
    }

    mutate({
      id: product.id,
      productData: { sizes: sizes.length > 0 ? sizes : [] },
    }, {
      onSuccess: () => {
        setEditingField(false);
      },
    });
  };

  const handleCancel = () => {
    setSizes(initialSizes);
    setNewSize("");
    setEditingField(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSize();
    } else if (e.key === "Escape") {
      handleCancel();
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
        {!editingField ? (
          <>
            <div className="flex flex-col items-start gap-1.5">
              {sizes.length > 0 ? (
                sizes.map((size, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs font-medium"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  -
                </span>
              )}
            </div>

            {editable && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingField(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground active:bg-muted/90 focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
                aria-label="Edit sizes"
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </>
        ) : null}
      </div>

      {editingField ? (
        <div className="w-full px-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5"
              >
                <span className="text-sm font-medium">{size}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(idx)}
                  disabled={isUpdating}
                  className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  aria-label={`Remove size ${size}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add new size..."
              disabled={isUpdating}
              autoFocus
              className="h-9"
            />
            <button
              type="button"
              onClick={handleAddSize}
              disabled={isUpdating || !newSize.trim()}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>

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
              onClick={handleCancel}
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
