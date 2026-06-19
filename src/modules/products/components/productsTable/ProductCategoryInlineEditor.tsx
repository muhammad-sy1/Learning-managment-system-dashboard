"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import type { IProduct } from "../../types/products";

interface ProductCategoryInlineEditorProps {
  product: IProduct;
  productPermessions: string;
  field: "category" | "subcategory";
  label: string;
  variant?: "table" | "card";
}

function getProductCategoryId(product: IProduct) {
  return product.section?.parent?.id ?? product.section?.id ?? undefined;
}

function getProductSubcategoryId(product: IProduct) {
  return product.section?.parent ? product.section.id : undefined;
}

function getProductCategoryLabel(product: IProduct) {
  return product.section?.parent?.name ?? product.section?.name ?? "-";
}

function getProductSubcategoryLabel(product: IProduct) {
  return product.section?.parent ? product.section.name : "-";
}

async function fetchCategories() {
  const response = await fetchSectionsClient({ page: 1, type: "CATIGORIES" });
  return response.data.sections.data;
}

async function fetchSubcategories(parentId: number) {
  const response = await fetchSectionsClient({
    page: 1,
    type: "SUB_CATIGORIES",
    parent_id: String(parentId),
  });
  return response.data.sections.data;
}

export default function ProductCategoryInlineEditor({
  product,
  productPermessions,
  field,
  label,
  variant = "table",
}: ProductCategoryInlineEditorProps) {
  const { canUpdate, hasPermission } = usePermissionStore();
  const editable =
    canUpdate(productPermessions) && hasPermission("sections.view");

  const initialCategoryId = getProductCategoryId(product);
  const initialSubcategoryId = getProductSubcategoryId(product);

  const [categoryId, setCategoryId] = useState<number | undefined>(
    initialCategoryId,
  );
  const [subcategoryId, setSubcategoryId] = useState<number | undefined>(
    initialSubcategoryId,
  );
  const [editingField, setEditingField] = useState<
    "category" | "subcategory" | null
  >(null);

  const { mutate, isPending: isUpdating } = useUpdateProduct();

  const categoriesQuery = useQuery({
    queryKey: ["inline-product-categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const subcategoriesQuery = useQuery({
    queryKey: ["inline-product-subcategories", categoryId],
    queryFn: () => fetchSubcategories(categoryId!),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setCategoryId(initialCategoryId);
    setSubcategoryId(initialSubcategoryId);
    setEditingField(null);
  }, [product.id, initialCategoryId, initialSubcategoryId]);

  const hasSubcategories = useMemo(
    () => (subcategoriesQuery.data ?? []).length > 0,
    [subcategoriesQuery.data],
  );

  const canEditSubcategory =
    editable &&
    Boolean(categoryId) &&
    (hasSubcategories || subcategoriesQuery.isLoading);

  const currentValue =
    field === "category"
      ? getProductCategoryLabel(product)
      : getProductSubcategoryLabel(product);

  const selectOptions =
    field === "category"
      ? (categoriesQuery.data ?? [])
      : (subcategoriesQuery.data ?? []);

  const selectedValue =
    field === "category" ? categoryId?.toString() : subcategoryId?.toString();

  const loading =
    field === "category"
      ? categoriesQuery.isLoading
      : subcategoriesQuery.isLoading;

  const editLabel =
    field === "category" ? "Select category" : "Select subcategory";

  const handleCategoryChange = (value: string) => {
    const selectedId = Number(value);
    if (Number.isNaN(selectedId)) return;

    setCategoryId(selectedId);
    setSubcategoryId(undefined);
    setEditingField(null);

    mutate({
      id: product.id,
      productData: { section_id: selectedId },
    });
  };

  const handleSubcategoryChange = (value: string) => {
    const selectedId = Number(value);
    if (Number.isNaN(selectedId)) return;

    setSubcategoryId(selectedId);
    setEditingField(null);

    mutate({
      id: product.id,
      productData: { section_id: selectedId },
    });
  };

  const isEditing = editingField === field;

  return (
    <div
      className={variant === "card" ? "space-y-2 w-full" : "w-full space-y-2"}
    >
      {variant === "card" && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}

      <div className="flex flex-col items-start gap-2 px-1 py-1">
        <span className="w-full text-sm font-medium line-clamp-2 break-words">
          {currentValue}
        </span>

        {editable && (field === "category" || canEditSubcategory) && (
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
      </div>

      {isEditing ? (
        <div className="w-full px-1">
          <Select
            value={selectedValue}
            onValueChange={
              field === "category"
                ? handleCategoryChange
                : handleSubcategoryChange
            }
            disabled={
              isUpdating || (field === "subcategory" && !canEditSubcategory)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loading ? "Loading..." : editLabel} />
            </SelectTrigger>
            <SelectContent className="max-h-56 w-full">
              {loading ? (
                <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : selectOptions.length > 0 ? (
                selectOptions.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-sm text-muted-foreground">
                  No options available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  );
}
