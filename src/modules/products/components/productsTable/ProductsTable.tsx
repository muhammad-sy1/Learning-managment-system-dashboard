"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Calendar,
  EyeIcon,
  IdCard,
  Image as ImageIcon,
  LayoutGrid,
  Package,
  Rows3,
  Settings,
  UserPlus,
} from "lucide-react";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import AddProductForm from "./AddProductForm";
import ProductsGridView from "./ProductsGridView";
import ProductRowTable from "./ProductRowTable";
import { usePermissionStore } from "@/hooks/usePermissionStore";

function ProductsTable() {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const isSubProduct = Boolean(searchParams.get("parent_id"));
  const viewModeStorageKey = isSubProduct
    ? "sub-products:view-mode"
    : "products:view-mode";
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  const { data: products, isPending } = useGetProducts();

  const { canCreate, hasPermission } = usePermissionStore();

  const namespace = isSubProduct
    ? "Dashboard.SubProductPage"
    : "Dashboard.ProductPage";
  const t = useTranslations(namespace);
  const productPermessions = isSubProduct ? "sub-products" : "products";
  const tHeaders = useTranslations("Dashboard.tableHeaders");
  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
    key?: string;
  }[] = [
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },

    {
      Icon: <ImageIcon className="h-4 w-4" />,
      label: tHeaders("image"),
      key: "image",
    },
    { Icon: <Package className="h-4 w-4" />, label: tHeaders("name") },
    { Icon: <Package className="h-4 w-4" />, label: tHeaders("categories") },
    { Icon: <Package className="h-4 w-4" />, label: tHeaders("subsections") },
    { Icon: <Banknote className="h-4 w-4" />, label: tHeaders("price") },
    {
      Icon: <Banknote className="h-4 w-4" />,
      label: tHeaders("newPrice"),
    },
    { Icon: <EyeIcon className="h-4 w-4" />, label: tHeaders("visible") },
    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("createdAt") },
  ];

  const HEADERS = !isSubProduct
    ? TABLE_HEADERS
    : TABLE_HEADERS.filter((h) => h.key !== "image");

  useEffect(() => {
    const savedViewMode = window.localStorage.getItem(viewModeStorageKey);

    if (savedViewMode === "table" || savedViewMode === "grid") {
      setViewMode(savedViewMode);
    } else {
      setViewMode("grid");
    }
  }, [viewModeStorageKey]);

  useEffect(() => {
    window.localStorage.setItem(viewModeStorageKey, viewMode);
  }, [viewMode, viewModeStorageKey]);

  const tableActionButton = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm">
        <Button
          type="button"
          size="sm"
          variant={viewMode === "table" ? "default" : "ghost"}
          className="gap-2"
          onClick={() => setViewMode("table")}
        >
          <Rows3 className="h-4 w-4" />
          <span>{t("actions.tableView")}</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === "grid" ? "default" : "ghost"}
          className="gap-2"
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>{t("actions.gridView")}</span>
        </Button>
      </div>

      <ResponsiveModal
        trigger={
          canCreate(productPermessions) ? (
            <Button variant="premium">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>{t("actions.create")}</span>
            </Button>
          ) : null
        }
        title={t("actions.create")}
        open={addProductModalOpen}
        onOpenChange={setAddProductModalOpen}
        maxWidth="xl"
        height="auto"
      >
        {hasPermission("sections.view") && hasPermission("merchants.view") ? (
          <AddProductForm
            onSuccess={() => setAddProductModalOpen(false)}
            isSupProduct={isSubProduct}
          />
        ) : (
          <div className="p-8 text-center ">
            <p className="text-sm text-red-400 sm:text-base">
              {t("noSectionPermission")}
            </p>
          </div>
        )}
      </ResponsiveModal>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {viewMode === "table" ? (
          <ReusableTable
            title={t("title")}
            titleIcon={<Package className="h-4 w-4" />}
            actionButton={tableActionButton}
            headers={HEADERS}
            data={products?.data || []}
            isPending={isPending}
            caption={t("table.tableCaption")}
            paginationProps={
              products?.data
                ? {
                    name: "products",
                    totalItems: products.total || 0,
                    totalPages: products.last_page || 1,
                  }
                : undefined
            }
            density="md"
            height={64}
            className=""
            renderRow={(product) => (
              <ProductRowTable
                key={product.id}
                data={product}
                isSubProduct={isSubProduct}
                productPermessions={productPermessions}
              />
            )}
          />
        ) : (
          <ProductsGridView
            title={t("title")}
            titleIcon={<Package className="h-4 w-4" />}
            actionButton={tableActionButton}
            data={products?.data || []}
            isPending={isPending}
            paginationProps={
              products?.data
                ? {
                    name: "products",
                    totalItems: products.total || 0,
                    totalPages: products.last_page || 1,
                  }
                : undefined
            }
            productPermessions={productPermessions}
            isSubProduct={isSubProduct}
          />
        )}
      </div>
    </div>
  );
}

export default ProductsTable;
