"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, EyeOff, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateMerchantCoPriceListItem } from "../../hooks/useCreateMerchantCoPriceListItem";
import { useDeleteMerchantCoPriceListItem } from "../../hooks/useDeleteMerchantCoPriceListItem";
import { useUpdateMerchantCoPriceListItem } from "../../hooks/useUpdateMerchantCoPriceListItem";
import {
  IMerchantCoPriceListItem,
  IMerchantCoPriceListItemPayload,
} from "../../types/users";

interface ItemFormState {
  name: string;
  description: string;
  main_price: string;
  new_price: string;
  is_hidden: boolean;
}

interface ItemsTabProps {
  merchantId: number;
  items: IMerchantCoPriceListItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

const EMPTY_FORM: ItemFormState = {
  name: "",
  description: "",
  main_price: "",
  new_price: "",
  is_hidden: false,
};

function toFormState(item: IMerchantCoPriceListItem): ItemFormState {
  return {
    name: item.name ?? "",
    description: item.description ?? "",
    main_price:
      item.main_price === null || item.main_price === undefined
        ? ""
        : String(item.main_price),
    new_price:
      item.new_price === null || item.new_price === undefined
        ? ""
        : String(item.new_price),
    is_hidden: Boolean(item.is_hidden),
  };
}

function toPayload(form: ItemFormState): IMerchantCoPriceListItemPayload {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    main_price: Number(form.main_price),
    new_price: Number(form.new_price),
    is_hidden: form.is_hidden,
  };
}

function isValidItemForm(form: ItemFormState) {
  if (!form.name.trim()) return false;
  if (form.main_price.trim() === "" || Number.isNaN(Number(form.main_price))) {
    return false;
  }
  if (form.new_price.trim() === "" || Number.isNaN(Number(form.new_price))) {
    return false;
  }

  return true;
}

function formatPrice(value: IMerchantCoPriceListItem["main_price"]) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US").format(numeric);
}

function ItemForm({
  form,
  onChange,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  form: ItemFormState;
  onChange: (value: ItemFormState) => void;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations(
    "Dashboard.USERS.merchantManagement.customOrderPriceList",
  );

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price-list-name">{t("name")}</Label>
          <Input
            id="price-list-name"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-list-hidden">{t("visibility")}</Label>
          <div className="flex h-10 items-center justify-between rounded-md border px-3">
            <span className="text-sm text-muted-foreground">
              {form.is_hidden ? t("hidden") : t("visible")}
            </span>
            <Switch
              dir="ltr"
              id="price-list-hidden"
              checked={form.is_hidden}
              onCheckedChange={(checked) =>
                onChange({ ...form, is_hidden: checked })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price-list-description">{t("description")}</Label>
        <Textarea
          id="price-list-description"
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder={t("descriptionPlaceholder")}
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price-list-main-price">{t("mainPrice")}</Label>
          <Input
            id="price-list-main-price"
            type="number"
            min="0"
            value={form.main_price}
            onChange={(e) => onChange({ ...form, main_price: e.target.value })}
            placeholder={t("mainPricePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-list-new-price">{t("newPrice")}</Label>
          <Input
            id="price-list-new-price"
            type="number"
            min="0"
            value={form.new_price}
            onChange={(e) => onChange({ ...form, new_price: e.target.value })}
            placeholder={t("newPricePlaceholder")}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isValidItemForm(form) || isSubmitting}
        >
          {isSubmitting ? <Spinner className="size-4" /> : submitLabel}
        </Button>
      </div>
    </div>
  );
}

export default function ItemsTab({
  merchantId,
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: ItemsTabProps) {
  const t = useTranslations(
    "Dashboard.USERS.merchantManagement.customOrderPriceList",
  );
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<ItemFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ItemFormState>(EMPTY_FORM);

  const { mutate: createItem, isPending: isCreating } =
    useCreateMerchantCoPriceListItem(merchantId);
  const {
    mutate: updateItem,
    isPending: isUpdating,
    variables: updatingVariables,
  } = useUpdateMerchantCoPriceListItem(merchantId);
  const {
    mutate: deleteItem,
    isPending: isDeleting,
    variables: deletingItemId,
  } = useDeleteMerchantCoPriceListItem(merchantId);

  function resetAddForm() {
    setIsAdding(false);
    setAddForm(EMPTY_FORM);
  }

  function startEdit(item: IMerchantCoPriceListItem) {
    if (typeof item.id !== "number") {
      toast.error(t("missingItemId"));
      return;
    }

    setEditingId(item.id);
    setEditForm(toFormState(item));
    setIsAdding(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  }

  function handleCreate() {
    createItem(toPayload(addForm), {
      onSuccess: () => resetAddForm(),
    });
  }

  function handleUpdate(itemId: number) {
    updateItem(
      {
        itemId,
        data: toPayload(editForm),
      },
      {
        onSuccess: () => cancelEdit(),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          {errorMessage || t("loadError")}
        </p>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!isAdding && (
          <Button
            variant="outline"
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
            }}
          >
            <Plus className="h-4 w-4" />
            {t("addItem")}
          </Button>
        )}
      </div>

      {isAdding && (
        <ItemForm
          form={addForm}
          onChange={setAddForm}
          submitLabel={t("createItem")}
          isSubmitting={isCreating}
          onSubmit={handleCreate}
          onCancel={resetAddForm}
        />
      )}

      {items.length === 0 && !isAdding && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("emptyItems")}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => {
          const itemId = item.id;
          const isEditing = editingId === itemId;
          const isDeletingThisItem =
            isDeleting &&
            deletingItemId !== undefined &&
            deletingItemId === itemId;
          const isUpdatingThisItem =
            isUpdating &&
            updatingVariables !== undefined &&
            updatingVariables.itemId === itemId;

          return (
            <div
              key={itemId ?? `${item.name}-${index}`}
              className="rounded-lg border p-4 space-y-3"
            >
              {isEditing && typeof itemId === "number" ? (
                <ItemForm
                  form={editForm}
                  onChange={setEditForm}
                  submitLabel={t("save")}
                  isSubmitting={isUpdatingThisItem}
                  onSubmit={() => handleUpdate(itemId)}
                  onCancel={cancelEdit}
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">
                          {item.name || t("untitledItem")}
                        </h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {item.is_hidden ? (
                            <>
                              <EyeOff className="mr-1 inline h-3 w-3" />
                              {t("hidden")}
                            </>
                          ) : (
                            <>
                              <Eye className="mr-1 inline h-3 w-3" />
                              {t("visible")}
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {item.description || t("noDescription")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(item)}
                        disabled={typeof itemId !== "number" || isDeleting}
                        title={
                          typeof itemId === "number"
                            ? undefined
                            : t("missingItemId")
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {typeof itemId === "number" ? (
                        <AreYouSureDeleteing
                          TriggerButton={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={isDeletingThisItem}
                            >
                              {isDeletingThisItem ? (
                                <Spinner className="size-4" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          }
                          onAccept={() => deleteItem(itemId)}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled
                          title={t("missingItemId")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">
                        {t("mainPrice")}
                      </p>
                      <p className="font-medium">
                        {formatPrice(item.main_price)}
                      </p>
                    </div>
                    <div className="rounded-md bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">
                        {t("newPrice")}
                      </p>
                      <p className="font-medium">
                        {formatPrice(item.new_price)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
