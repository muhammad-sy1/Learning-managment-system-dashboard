"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import type { IProduct } from "../../types/products";

const splitOptions = (value?: string | null) =>
  value
    ? value
        .split(";")
        .map((option) => option.trim())
        .filter(Boolean)
    : [];

interface ProductOptionsInlineEditorProps {
  product: IProduct;
  productPermessions: string;
  label: string;
  variant?: "table" | "card";
}

export default function ProductOptionsInlineEditor({
  product,
  productPermessions,
  label,
  variant = "table",
}: ProductOptionsInlineEditorProps) {
  const { canUpdate } = usePermissionStore();
  const tCommon = useTranslations("confirmation");
  const editable = canUpdate(productPermessions);

  const initialOptions = splitOptions(product.options);

  const [options, setOptions] = useState<string[]>(initialOptions);
  const [newOption, setNewOption] = useState<string>("");
  const [editingField, setEditingField] = useState<boolean>(false);

  const { mutate, isPending: isUpdating } = useUpdateProduct();

  useEffect(() => {
    setOptions(splitOptions(product.options));
    setEditingField(false);
    setNewOption("");
  }, [product.id, product.options]);

  const handleAddOption = () => {
    const nextOptions = splitOptions(newOption).filter(
      (option) => !options.includes(option),
    );

    if (nextOptions.length > 0) {
      setOptions([...options, ...nextOptions]);
    }

    setNewOption("");
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const optionString = options.join(";");
    if (optionString === product.options) {
      setEditingField(false);
      return;
    }

    mutate({
      id: product.id,
      productData: {
        options: optionString,
      },
    }, {
      onSuccess: () => {
        setEditingField(false);
      },
    });
  };

  const handleCancel = () => {
    setOptions(initialOptions);
    setNewOption("");
    setEditingField(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
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
            {options.length > 0 ? (
              <div className="flex flex-col items-start gap-1.5">
                {options.map((option, idx) => (
                  <Badge key={idx} variant="secondary">
                    {option}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                -
              </span>
            )}

            {editable && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingField(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground active:bg-muted/90 focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
                aria-label="Edit options"
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
            {options.map((option, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5"
              >
                <span className="text-sm font-medium">{option}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  disabled={isUpdating}
                  className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  aria-label={`Remove option ${option}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add new option..."
              disabled={isUpdating}
              autoFocus
              className="h-9"
            />
            <button
              type="button"
              onClick={handleAddOption}
              disabled={isUpdating || !newOption.trim()}
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
