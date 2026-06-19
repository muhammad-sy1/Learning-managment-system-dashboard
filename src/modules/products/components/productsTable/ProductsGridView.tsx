"use client";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import AppPagination from "@/components/reusable-table/AppPagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Package,
  PlayCircle,
  Store,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { IProduct } from "../../types/products";
import { resolveProductMediaUrl } from "../../utils/productMedia";
import ProductCategoryInlineEditor from "./ProductCategoryInlineEditor";
import ProductFieldInlineEditor from "./ProductFieldInlineEditor";
import ProductSizeInlineEditor from "./ProductSizeInlineEditor";
import ProductOptionsInlineEditor from "./ProductOptionsInlineEditor";
import ProductPriceLinkageInlineEditor from "./ProductPriceLinkageInlineEditor";
import { ProductDetails } from "../productDetails/ProductDetails";
import ProductTableActions from "./ProductTableActions";

type PaginationProps = {
  totalItems: number;
  name: string;
  totalPages: number;
};

interface ProductsGridViewProps {
  title?: string;
  titleIcon?: React.ReactNode;
  description?: string;
  actionButton?: React.ReactNode;
  data: IProduct[];
  isPending: boolean;
  paginationProps?: PaginationProps;
  productPermessions: string;
  isSubProduct: boolean;
}

export default function ProductsGridView({
  title,
  titleIcon,
  description,
  actionButton,
  data,
  isPending,
  paginationProps,
  productPermessions,
  isSubProduct,
}: ProductsGridViewProps) {
  const tTable = useTranslations("Table");
  const { canView } = usePermissionStore();
  const canViewProductDetails = canView(productPermessions);

  return (
    <div className="relative mx-auto overflow-hidden rounded-xl border border-border/50 bg-card shadow-lg transition-colors duration-300">
      <Card className="pb-0">
        {(title || actionButton) && (
          <CardHeader>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between">
              {title && (
                <div className="flex items-center gap-3">
                  {titleIcon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {titleIcon}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {actionButton}
            </div>
          </CardHeader>
        )}

        <CardContent className="px-6 pb-6 pt-0">
          {isPending ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={`product-grid-skeleton-${index}`}
                  className="overflow-hidden border-border/50 py-0"
                >
                  <div className="aspect-[4/3] animate-pulse bg-muted/60" />
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-muted/60" />
                      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-4/5 animate-pulse rounded bg-muted/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 4 }).map((__, itemIndex) => (
                        <div
                          key={`product-grid-skeleton-item-${itemIndex}`}
                          className="rounded-xl border border-border/40 p-3"
                        >
                          <div className="h-3 w-1/2 animate-pulse rounded bg-muted/50" />
                          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted/60" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.map((product) => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  canViewProductDetails={canViewProductDetails}
                  productPermessions={productPermessions}
                  isSubProduct={isSubProduct}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
              <div className="rounded-full bg-muted p-4">
                <Package className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{tTable("noDataTitle")}</p>
                <p className="text-sm text-muted-foreground/80">
                  {tTable("noDataSubtitle")}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {paginationProps && data.length > 0 && (
          <div className="border-t px-6">
            <AppPagination {...paginationProps} />
          </div>
        )}
      </Card>
    </div>
  );
}

interface ProductGridCardProps {
  product: IProduct;
  canViewProductDetails: boolean;
  productPermessions: string;
  isSubProduct: boolean;
}

function ProductGridCard({
  product,
  canViewProductDetails,
  productPermessions,
  isSubProduct,
}: ProductGridCardProps) {
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const t = useTranslations("Dashboard.ProductPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const images = product.images ?? [];
  const coverImageUrl = resolveProductMediaUrl(images[activeImageIndex]?.image);
  const imageCount = images.length;
  const hasVideo = Boolean(product.video_url);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((i) => (i - 1 + imageCount) % imageCount);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((i) => (i + 1) % imageCount);
  };

  const merchantName = [
    product?.merchant?.first_name,
    product?.merchant?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const merchantId = product?.merchant?.id;
  const merchantHref = merchantId
    ? `/dashboard/users?role=MERCHANT&id=${merchantId}`
    : null;

  const handleOpenDetails = () => {
    if (canViewProductDetails) {
      setIsProductDetailsOpen(true);
    }
  };

  const stopCardEvent = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden border-border/50 py-0 transition-all duration-300",
          canViewProductDetails &&
            "cursor-pointer hover:-translate-y-1 hover:shadow-xl",
        )}
        // onClick={handleOpenDetails}
        onKeyDown={(event) => {
          if (!canViewProductDetails) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenDetails();
          }
        }}
        role={canViewProductDetails ? "button" : undefined}
        tabIndex={canViewProductDetails ? 0 : undefined}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/50">
              <Package className="h-12 w-12 text-muted-foreground/70" />
            </div>
          )}

          {/* Prev / Next arrows */}
          {imageCount > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <Badge
              variant={
                product.status.toLowerCase() as
                  | "pending"
                  | "rejected"
                  | "approved"
              }
            >
              {t(`statuses.${product.status.toLowerCase()}`)}
            </Badge>

            <div className="rounded-xl bg-background/90 p-1 shadow-sm backdrop-blur">
              <ProductTableActions
                data={product}
                productPermessions={productPermessions}
                isSubProduct={isSubProduct}
                preventParentClick
              />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3 text-white">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="rounded-full bg-white/15 px-2 py-1 font-medium backdrop-blur">
                #{product.id}
              </span>
              <div className="flex items-center gap-2">
                {/* Dots */}
                {imageCount > 1 && (
                  <div className="flex items-center gap-1">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(idx);
                        }}
                        aria-label={`Image ${idx + 1}`}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          idx === activeImageIndex
                            ? "w-4 bg-white"
                            : "w-1.5 bg-white/50",
                        )}
                      />
                    ))}
                  </div>
                )}
                {/* Color dot for current image */}
                {images[activeImageIndex]?.color && (
                  <span
                    className="h-4 w-4 rounded-full border-2 border-white/60 shadow"
                    style={{
                      backgroundColor: `#${images[activeImageIndex].color!}`,
                    }}
                    title={images[activeImageIndex].color!}
                  />
                )}
                {hasVideo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 font-medium backdrop-blur">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {t("fields.videoUrl")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="space-y-4 ">
          <div>
            <div className=" mb-2">{t("sections.availableColors")}</div>
            <div className="flex gap-2">
              {images.map((img) => (
                <>
                  {img.color ? (
                    <button
                      className="w-10 h-10 rounded-full border border-muted-foreground"
                      key={img.id}
                      style={{
                        backgroundColor: img.color
                          ? `#${img.color}`
                          : undefined,
                      }}
                    />
                  ) : (
                    <>
                      <div className="text-xs text-muted-foreground">
                        لا يتوفر
                      </div>
                    </>
                  )}
                </>
              ))}
            </div>
          </div>
          <ProductMetaCard
            label={t("fields.lastReviewedBy")}
            value={
              [
                product.last_reviewed_by?.first_name,
                product.last_reviewed_by?.last_name,
              ]
                .filter(Boolean)
                .join(" ") || "-"
            }
          />

          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <ProductFieldInlineEditor
              product={product}
              productPermessions={productPermessions}
              field="review_note"
              label={t("fields.reviewNote")}
              type="textarea"
              placeholder={t("fields.reviewNotePlaceholder")}
              variant="card"
            />
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <ProductFieldInlineEditor
              product={product}
              productPermessions={productPermessions}
              field="name"
              label={t("fields.name")}
              type="text"
              placeholder={t("fields.namePlaceholder")}
              variant="card"
            />
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <ProductFieldInlineEditor
              product={product}
              productPermessions={productPermessions}
              field="description"
              label={t("fields.description")}
              type="textarea"
              placeholder={t("fields.descriptionPlaceholder")}
              variant="card"
            />
          </div>

          {product.type !== "MARKET" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                <ProductFieldInlineEditor
                  product={product}
                  productPermessions={productPermessions}
                  field="available_from"
                  label={t("fields.availableFrom")}
                  type="time"
                  variant="card"
                />
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                <ProductFieldInlineEditor
                  product={product}
                  productPermessions={productPermessions}
                  field="available_to"
                  label={t("fields.availableTo")}
                  type="time"
                  variant="card"
                />
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                <ProductFieldInlineEditor
                  product={product}
                  productPermessions={productPermessions}
                  field="avg_preparation_minutes"
                  label={t("fields.avg_preparation_minutes")}
                  type="number"
                  placeholder="0"
                  variant="card"
                />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border/50 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">
              {t("fields.merchantName")}
            </p>
            {merchantHref ? (
              <Link
                href={merchantHref}
                onClick={stopCardEvent}
                onKeyDown={stopCardEvent}
                className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-background/80 px-3 py-2 transition-colors hover:bg-background"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">
                    {merchantName || `#${merchantId}`}
                  </p>
                  <p className="text-xs text-muted-foreground">#{merchantId}</p>
                </div>
                <Store className="h-4 w-4 shrink-0 text-primary" />
              </Link>
            ) : (
              <p className="mt-2 text-sm font-medium">-</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <ProductFieldInlineEditor
                product={product}
                productPermessions={productPermessions}
                field="main_price"
                label={tHeaders("price")}
                type="number"
                placeholder={t("fields.mainPricePlaceholder")}
                variant="card"
              />
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <ProductFieldInlineEditor
                product={product}
                productPermessions={productPermessions}
                field="new_price"
                label={tHeaders("newPrice")}
                type="number"
                placeholder={t("fields.newPricePlaceholder")}
                variant="card"
              />
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <ProductPriceLinkageInlineEditor
                product={product}
                productPermessions={productPermessions}
                label={tHeaders("isPriceLinkedToUSD")}
                variant="card"
              />
            </div>
            <div></div>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <ProductCategoryInlineEditor
                product={product}
                productPermessions={productPermessions}
                field="category"
                label={tHeaders("categories")}
                variant="card"
              />
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <ProductCategoryInlineEditor
                product={product}
                productPermessions={productPermessions}
                field="subcategory"
                label={tHeaders("subsections")}
                variant="card"
              />
            </div>
            {product.weight ? (
              <ProductMetaCard
                label={t("fields.weight")}
                value={product.weight}
              />
            ) : null}
            {product.visits_count !== undefined ? (
              <ProductMetaCard
                label={t("fields.visitsCount")}
                value={String(product.visits_count)}
              />
            ) : null}
          </div>

          {/* Sizes */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <ProductSizeInlineEditor
              product={product}
              productPermessions={productPermessions}
              label={t("fields.sizes")}
              variant="card"
            />
          </div>

          {/* Options */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <ProductOptionsInlineEditor
              product={product}
              productPermessions={productPermessions}
              label={t("fields.options")}
              variant="card"
            />
          </div>

          {/* Zones */}
          {product.zones?.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                {t("fields.availableProvinces")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.zones.map((zone) => (
                  <span
                    key={zone.id}
                    className="rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs font-medium"
                  >
                    {zone.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Discount and Refundable Info */}
          <div className="grid grid-cols-2 gap-3">
            {product.has_discount && (
              <ProductMetaCard
                label={t("fields.hasDiscount")}
                value={t("statuses.yes")}
              />
            )}
            {product.is_refundable === 1 && (
              <ProductMetaCard
                label={t("fields.isRefundable")}
                value={t("statuses.yes")}
              />
            )}
          </div>

          {/* Discount dates */}
          {product.discount_start_date || product.discount_end_date ? (
            <div className="grid grid-cols-2 gap-3">
              {product.discount_start_date ? (
                <ProductMetaCard
                  label={t("fields.discountStartDate")}
                  value={new Date(
                    product.discount_start_date,
                  ).toLocaleDateString()}
                />
              ) : null}
              {product.discount_end_date ? (
                <ProductMetaCard
                  label={t("fields.discountEndDate")}
                  value={new Date(
                    product.discount_end_date,
                  ).toLocaleDateString()}
                />
              ) : null}
            </div>
          ) : null}

          {/* Flags row */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                product.is_out_of_stock === 1
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-500/10 text-green-600 dark:text-green-400",
              )}
            >
              {product.is_out_of_stock === 1
                ? t("statuses.outOfStock")
                : t("statuses.inStock")}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                product.is_hidden === 1
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              {product.is_hidden === 1 ? t("hidden") : t("visible")}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {canViewProductDetails && (
        <ResponsiveModal
          title={product.name}
          maxWidth="2xl"
          height="80vh"
          trigger={null}
          open={isProductDetailsOpen}
          onOpenChange={setIsProductDetailsOpen}
        >
          <ProductDetails product={product} />
        </ResponsiveModal>
      )}
    </>
  );
}

function ProductMetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-medium">{value}</p>
    </div>
  );
}
