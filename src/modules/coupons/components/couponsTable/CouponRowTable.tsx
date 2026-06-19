import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { formatPrice } from "@/utils/formatPrice";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ICoupon } from "../../types/coupons";
import CouponTableActions from "./CouponsTableActions";
import { formatUtcToLocal } from "@/utils/formatDate";

export default function CouponRowTable({ data }: { data: ICoupon }) {
  const t = useTranslations("Dashboard.CouponsPage.fields");
  const tUsers = useTranslations("users");
  const isActive = new Date(data.expires_at) > new Date();
  const appliesToLabels: Record<string, string> = {
    PRODUCTS: t("appliesTo.products"),
    CUSTOM_ORDER_SHIPPING: t("appliesTo.CUSTOM_ORDER_SHIPPING"),
    SHIPPING: t("appliesTo.shipping"),
  };

  // Helper function to display boolean values
  const renderBooleanValue = (value: number | boolean) => {
    const isTrue = value === 1 || value === true;
    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium ${
          isTrue
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-gray-50 text-gray-600 border-gray-200"
        }`}
      >
        {isTrue ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        {isTrue ? tUsers("yes") : tUsers("no")}
      </Badge>
    );
  };

  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <CouponTableActions {...data} />
      </TableCell>
      <TableCell className="font-medium w-40">{data.code}</TableCell>
      <TableCell className="font-medium w-40">
        {appliesToLabels[data.applies_to] || data.applies_to}
      </TableCell>
      <TableCell>
        {data.type === "PERCENTAGE" ? t("percentage") : t("fixed")}
      </TableCell>
      <TableCell>
        {data.type === "PERCENTAGE"
          ? `${Number(data.value).toFixed(0)}%`
          : `${formatPrice(data.value)}`}
      </TableCell>
      <TableCell>
        {data.min_order_amount ? formatPrice(data.min_order_amount) : "-"}
      </TableCell>
      <TableCell>
        {data.usage_limit !== null ? data.usage_limit : "∞"}
      </TableCell>
      <TableCell>{data.uses_count || 0}</TableCell>
      <TableCell>
        <div className="flex w-full justify-center">
          {renderBooleanValue(data.is_company_sponsored)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex w-full justify-center">
          {renderBooleanValue(data.is_global_for_products)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex w-full justify-center">
          {renderBooleanValue(data.is_global_for_users)}
        </div>
      </TableCell>
      <TableCell>
        {isActive ? (
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200 px-2.5 py-1 text-sm font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("active")}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 bg-gray-50 text-gray-600 border-gray-200 px-2.5 py-1 text-sm font-medium"
          >
            <XCircle className="w-3.5 h-3.5" />
            {t("expired")}
          </Badge>
        )}
      </TableCell>
      <TableCell>{formatUtcToLocal(data.updated_at)}</TableCell>
      <TableCell>{formatUtcToLocal(data.expires_at)}</TableCell>
      <TableCell>{formatUtcToLocal(data.created_at)}</TableCell>
    </>
  );
}
