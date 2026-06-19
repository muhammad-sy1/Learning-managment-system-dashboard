import { Hash, Percent, TagIcon, Ticket, Truck } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { useTranslations } from "next-intl";

interface CouponCardProps {
  label: string;
  code?: string | null;
  type?: "FIXED" | "PERCENTAGE" | null;
  value?: string | number | null;
  variant?: "product" | "shipping";
}

const CouponCard = ({
  label,
  code,
  type,
  value,
  variant = "product",
}: CouponCardProps) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  if (!code) return null;

  const isPercentage = type === "PERCENTAGE";

  return (
    <div className="space-y-3 rounded-2xl border p-4 bg-gradient-to-br from-secondary/30 to-muted/30">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        {variant === "shipping" ? (
          <Truck className="h-4 w-4" />
        ) : (
          <Ticket className="h-4 w-4" />
        )}
        {label}
      </div>

      {/* Code */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Hash className="h-4 w-4" />
          <span>{t("fields.couponCode")}</span>
        </div>
        <span className="font-bold">{code}</span>
      </div>

      {/* Type */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TagIcon className="h-4 w-4" />
          <span>{t("fields.couponType")}</span>
        </div>
        <span className="font-medium">
          {isPercentage ? t("fields.percentage") : t("fields.fixed")}
        </span>
      </div>

      {/* Value */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Percent className="h-4 w-4" />
          <span>{t("fields.couponValue")}</span>
        </div>
        <span className="font-bold text-foreground">
          {isPercentage ? `${value}%` : formatPrice(Number(value ?? 0))}
        </span>
      </div>
    </div>
  );
};

export default CouponCard;
