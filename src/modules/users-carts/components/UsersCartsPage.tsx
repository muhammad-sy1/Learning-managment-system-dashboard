"use client";

import AppPagination from "@/components/reusable-table/AppPagination";
import { ImageGalleryTableCell } from "@/components/ImageGalleryTableCell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/utils/formatPrice";
import { Phone, ShoppingCart, Store, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetUsersCarts } from "../hooks/useGetUsersCarts";
import {
  IMerchantCart,
  IUserCart,
  IUserCartItem,
  IUserCartSummary,
} from "../types/usersCarts";
import UsersCartsFilters from "./UsersCartsFilters";

export default function UsersCartsPage() {
  const t = useTranslations("Dashboard.UsersCartsPage");
  const tTable = useTranslations("Table");
  const { data, isPending } = useGetUsersCarts();
  const users = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <UsersCartsFilters />

      <div className="relative overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm">
        <div className="border-b px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{t("listTitle")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("totalUsers", { total: data?.total ?? 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isPending ? (
            <UsersCartsSkeleton />
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {users.map((userCart) => (
                <UserCartCard key={userCart.user.id} userCart={userCart} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
              <div className="rounded-full bg-muted p-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{tTable("noDataTitle")}</p>
                <p className="text-sm text-muted-foreground/80">
                  {t("emptySubtitle")}
                </p>
              </div>
            </div>
          )}
        </div>

        {data && users.length > 0 ? (
          <div className="border-t px-4 sm:px-6">
            <AppPagination
              name="users-carts"
              totalItems={data.total || 0}
              totalPages={data.last_page || 1}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function UserCartCard({ userCart }: { userCart: IUserCart }) {
  const t = useTranslations("Dashboard.UsersCartsPage");

  return (
    <Card className="rounded-lg border-border/60 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="line-clamp-1 text-base">
                {userCart.user.name || t("unknownUser")}
              </CardTitle>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span dir="ltr">{userCart.user.phone_number_e164 || "-"}</span>
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-md">
            #{userCart.user.id}
          </Badge>
        </div>

        <SummaryGrid
          summary={userCart.cart_summary}
          includeMerchants
          variant="user"
        />
      </CardHeader>

      <CardContent className="space-y-4">
        {userCart.merchant_carts.map((merchantCart) => (
          <MerchantCartPanel
            key={merchantCart.merchant.id}
            merchantCart={merchantCart}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function MerchantCartPanel({
  merchantCart,
}: {
  merchantCart: IMerchantCart;
}) {
  const t = useTranslations("Dashboard.UsersCartsPage");

  return (
    <section className="rounded-lg border border-border/50 bg-muted/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-semibold">
              {merchantCart.merchant.name || t("unknownMerchant")}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span dir="ltr">
                {merchantCart.merchant.phone_number_e164 || "-"}
              </span>
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-md">
          #{merchantCart.merchant.id}
        </Badge>
      </div>

      <div className="mt-4">
        <SummaryGrid summary={merchantCart.cart_summary} variant="merchant" />
      </div>

      <div className="mt-4 space-y-3">
        {merchantCart.cart_items.length > 0 ? (
          merchantCart.cart_items.map((item) => (
            <ProductCartItem key={item.id} item={item} />
          ))
        ) : (
          <p className="rounded-md border border-dashed bg-background/60 p-4 text-center text-sm text-muted-foreground">
            {t("noProducts")}
          </p>
        )}
      </div>
    </section>
  );
}

function ProductCartItem({ item }: { item: IUserCartItem }) {
  const t = useTranslations("Dashboard.UsersCartsPage");
  const product = item.product;
  const galleryImages = [
    ...(product.images ?? []).map((image) => ({
      image: image.image || image.url || "",
      color: image.color,
    })),
    ...(product.image ? [{ image: product.image, color: null }] : []),
    ...(product.main_image ? [{ image: product.main_image, color: null }] : []),
  ].filter((image) => image.image);
  const hasDiscount =
    Boolean(product.has_discount) &&
    product.main_price !== undefined &&
    product.main_price !== null &&
    Number(product.main_price) !== Number(product.new_price);

  return (
    <div className="rounded-lg border border-border/50 bg-background p-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <ImageGalleryTableCell
          data={{ name: product.name, images: galleryImages }}
          alt={product.name}
          size="lg"
          maxDisplay={3}
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-semibold">
              {product.name}
            </h4>
            <Badge variant="outline" className="rounded-md">
              {t("quantityValue", { quantity: item.quantity })}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-primary">
              {formatPrice(product.new_price)}
            </span>
            {hasDiscount ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.main_price ?? 0)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <ProductAttribute label={t("color")} value={item.color} />
            <ProductAttribute label={t("size")} value={item.size} />
            <ProductAttribute label={t("option")} value={item.option} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductAttribute({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <span className="rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-xs">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

function SummaryGrid({
  summary,
  includeMerchants = false,
}: {
  summary: IUserCartSummary;
  includeMerchants?: boolean;
  variant: "user" | "merchant";
}) {
  const t = useTranslations("Dashboard.UsersCartsPage");
  const items = [
    { label: t("itemsCount"), value: summary.items_count },
    { label: t("totalQuantity"), value: summary.total_quantity },
    { label: t("totalPrice"), value: formatPrice(summary.total_price) },
    ...(includeMerchants
      ? [{ label: t("merchantsCount"), value: summary.merchants_count ?? 0 }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border/50 bg-background/80 p-3"
        >
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="mt-1 line-clamp-1 text-sm font-semibold">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function UsersCartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`users-carts-skeleton-${index}`}
          className="rounded-lg border border-border/60 p-5"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((__, itemIndex) => (
              <Skeleton
                key={`users-carts-summary-skeleton-${index}-${itemIndex}`}
                className="h-16 rounded-lg"
              />
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
