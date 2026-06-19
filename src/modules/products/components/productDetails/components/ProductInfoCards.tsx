import NavLink from "@/components/NavLink";
import { ReusableCard } from "@/components/ReusableCard";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { MapPin, Package, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { IProduct } from "../../../types/products";
import {
  getEmbeddedVideoUrl,
  resolveProductMediaUrl,
} from "../../../utils/productMedia";

const ProductInfoCards = ({ product }: { product: IProduct }) => {
  const t = useTranslations("Dashboard.ProductPage");
  const merchantName = [
    product?.merchant?.first_name,
    product?.merchant?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const merchantId = product?.merchant?.id;
  const hasDiscount =
    (product.has_discount ?? product.has_offer === true) ||
    product.has_offer === 1;
  const resolvedVideoUrl = resolveProductMediaUrl(product.video_url);
  const embeddedVideoUrl = getEmbeddedVideoUrl(product.video_url);

  const formatBoolean = (value: boolean | number | null | undefined) =>
    value === 1 || value === true ? t("statuses.yes") : t("statuses.no");

  const renderValue = (value: string | number | null | undefined) => {
    if (value == null || value === "") {
      return "-";
    }

    return String(value);
  };

  const renderDate = (value: string | null | undefined) => {
    if (!value) {
      return "-";
    }

    return formatDate(value);
  };

  const getProductTypeLabel = (type: string | null | undefined) => {
    switch (type) {
      case "RESTURANT":
        return t("typeValues.restaurant");
      case "MARKET":
        return t("typeValues.market");
      default:
        return renderValue(type);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Merchant Information */}
      <ReusableCard
        icon={<User className="h-6 w-6" />}
        title={t("sections.merchantInformation")}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            {t("fields.merchantName")}:
          </span>
          <span className="font-medium text-end">
            {renderValue(merchantName)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            {t("fields.merchantId")}:
          </span>
          <span className="font-medium">
            {merchantId ? `#${merchantId}` : "-"}
          </span>
        </div>

        {merchantId ? (
          <NavLink href={`/dashboard/users?role=MERCHANT&id=${merchantId}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 mt-2 bg-transparent h-7 text-xs"
            >
              <User className="h-3 w-3" />
              {t("actions.viewMerchant")}
            </Button>
          </NavLink>
        ) : null}
      </ReusableCard>

      {/* Availability */}
      <ReusableCard
        icon={<MapPin className="h-6 w-6" />}
        title={t("sections.geographicAvailability")}
      >
        <div className="space-y-1">
          {product?.zones?.length ? (
            product.zones.map((province, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-xs">{province.name}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      </ReusableCard>

      {/* Product Details */}
      <ReusableCard
        icon={<Package className="h-6 w-6" />}
        title={t("sections.productDetails")}
        className="md:col-span-2"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DetailRow
            label={t("fields.createdAt")}
            value={renderDate(product.created_at)}
          />
          <DetailRow
            label={t("fields.updatedAt")}
            value={renderDate(product.updated_at)}
          />
          <DetailRow
            label={t("fields.type")}
            value={getProductTypeLabel(product.type)}
          />
          <VideoPreviewRow
            label={t("fields.videoUrl")}
            rawUrl={product.video_url}
            resolvedUrl={resolvedVideoUrl}
            embeddedUrl={embeddedVideoUrl}
          />
          <DetailRow
            label={t("fields.visitsCount")}
            value={renderValue(product.visits_count)}
          />
          <DetailRow
            label={t("fields.isRefundable")}
            value={formatBoolean(product.is_refundable)}
          />
          <DetailRow
            label={t("fields.isHidden")}
            value={formatBoolean(product.is_hidden)}
          />
          <DetailRow
            label={t("fields.isPriceLinkedToUSD")}
            value={formatBoolean(product.is_price_linked_to_usd)}
          />
          <DetailRow
            label={t("fields.hasDiscount")}
            value={formatBoolean(hasDiscount)}
          />
          <DetailRow
            label={t("fields.discountStartDate")}
            value={renderDate(product.discount_start_date)}
          />
          <DetailRow
            label={t("fields.discountEndDate")}
            value={renderDate(product.discount_end_date)}
          />
          <DetailRow
            label={t("fields.weight")}
            value={renderValue(product.weight)}
          />
        </div>
      </ReusableCard>
    </div>
  );
};

function DetailRow({
  label,
  value,
  isLink = false,
  fullWidth = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : undefined}>
      <span className="text-muted-foreground text-xs">{label}</span>
      {isLink && value !== "-" ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      )}
    </div>
  );
}

function VideoPreviewRow({
  label,
  rawUrl,
  resolvedUrl,
  embeddedUrl,
}: {
  label: string;
  rawUrl?: string | null;
  resolvedUrl: string;
  embeddedUrl: string | null;
}) {
  if (!resolvedUrl) {
    return <DetailRow label={label} value="-" />;
  }

  return (
    <div className="md:col-span-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-2 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
        <div className="aspect-video bg-black">
          {embeddedUrl ? (
            <iframe
              src={embeddedUrl}
              title={label}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              className="h-full w-full"
              controls
              preload="metadata"
              src={resolvedUrl}
            />
          )}
        </div>
      </div>
      <a
        href={resolvedUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {rawUrl || resolvedUrl}
      </a>
    </div>
  );
}

export default ProductInfoCards;
