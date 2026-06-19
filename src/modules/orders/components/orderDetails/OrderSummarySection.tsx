"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { formatDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { Banknote, Calendar, ShoppingBag, Star, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";
import { RowItem } from "@/components/RowItem";

interface Props {
  data: IOrderByID;
}

const OrderSummarySection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  // console.log("firstfirstfirstfirstfirstfirstfirstfirstfirstfirst" + JSON.stringify(data));
  const itemsTotalAfterDiscount = data?.items.reduce(
    (sum: number, item: any) => {
      const unitAfterDiscount = Number(item.total_price || 0); // unit price *after* discount
      const effectiveQty = Math.max(
        0,
        (item.quantity || 0) - (item.returned_quantity || 0),
      );
      return sum + unitAfterDiscount * effectiveQty;
    },
    0,
  );

  const grandTotalBeforeDiscountTile =
    itemsTotalAfterDiscount +
    (data?.discount_amount || 0) +
    (data?.shipping_cost || 0);

  const grandTotalAfterDiscountTile =
    itemsTotalAfterDiscount + (data?.shipping_cost || 0);

  return (
    <ReusableCard
      icon={<ShoppingBag className="h-6 w-6" />}
      title={t("sections.orderSummary")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="grid grid-rows-2 gap-4">
          <RowItem
            icon={<Calendar className="h-5 w-5" />}
            label={t("fields.orderDate")}
            value={formatDate(data.created_at)}
          />
          <RowItem
            icon={<Banknote className="h-5 w-5" />}
            label={t("fields.totalAmount")}
            value={formatPrice(grandTotalBeforeDiscountTile)}
          />
        </div>

        <div className="grid grid-rows-2 gap-4">
          <RowItem
            icon={<Truck className="h-5 w-5" />}
            label={t("fields.shippingCost")}
            value={formatPrice(data.shipping_cost)}
          />
          <RowItem
            icon={<Star className="h-5 w-5" />}
            label={t("fields.discount")}
            value={formatPrice(data.discount_amount)}
          />
        </div>

        <div className="flex col-span-2 justify-between items-center p-3 bg-gradient-to-r from-secondary/30 to-muted/30 rounded-xl border h-full">
          <div className="flex items-center gap-2 text-foreground">
            <Banknote className="h-5 w-5" />
            <span className="font-medium">
              {t("fields.totalPriceAfterDiscount")}
            </span>
          </div>
          <span className="font-bold text-foreground">
            {formatPrice(grandTotalAfterDiscountTile)}
          </span>
        </div>
      </div>
    </ReusableCard>
  );
};

export default OrderSummarySection;
