"use client";

import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import type { IProduct } from "../../types/products";

interface ProductPriceLinkageInlineEditorProps {
  product: IProduct;
  productPermessions: string;
  label: string;
  variant?: "table" | "card";
}

export default function ProductPriceLinkageInlineEditor({
  product,
  productPermessions,
  label,
  variant = "table",
}: ProductPriceLinkageInlineEditorProps) {
  const { canUpdate } = usePermissionStore();
  const t = useTranslations("Dashboard.ProductPage");
  const tCommon = useTranslations("confirmation");
  const editable = canUpdate(productPermessions);

  const initialValue = product.is_price_linked_to_usd === 1;

  const [isLinked, setIsLinked] = useState<boolean>(initialValue);
  const [editingField, setEditingField] = useState<boolean>(false);

  const { mutate, isPending: isUpdating } = useUpdateProduct();

  useEffect(() => {
    setIsLinked(initialValue);
    setEditingField(false);
  }, [product.id, initialValue]);

  const handleSave = () => {
    if (isLinked === initialValue) {
      setEditingField(false);
      return;
    }

    mutate({
      id: product.id,
      productData: { is_price_linked_to_usd: isLinked ? 1 : 0 },
    });

    setEditingField(false);
  };

  const handleCancel = () => {
    setIsLinked(initialValue);
    setEditingField(false);
  };

  const displayValue = isLinked ? t("statuses.yes") : t("statuses.no");

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
            <span className="w-full text-sm font-medium">{displayValue}</span>

            {editable && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingField(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground active:bg-muted/90 focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
                aria-label="Edit price linkage"
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
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isLinked}
                onChange={() => setIsLinked(true)}
                disabled={isUpdating}
                className="cursor-pointer"
              />
              <span className="text-sm font-medium">{t("statuses.yes")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!isLinked}
                onChange={() => setIsLinked(false)}
                disabled={isUpdating}
                className="cursor-pointer"
              />
              <span className="text-sm font-medium">{t("statuses.no")}</span>
            </label>
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
