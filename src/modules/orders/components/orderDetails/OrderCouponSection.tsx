"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";
import CouponCard from "./CouponCard";

interface Props {
  data: IOrderByID;
}

const OrderCouponSection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  const hasAnyCoupon = data.product_coupon || data.shipping_coupon;

  if (!hasAnyCoupon) return null;

  return (
    <ReusableCard
      icon={<Ticket className="h-6 w-6" />}
      title={t("fields.coupons")}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <CouponCard
          label={t("fields.productCoupon")}
          code={data.product_coupon}
          type={data.product_coupon_type}
          value={data.product_coupon_value}
          variant="product"
        />

        <CouponCard
          label={t("fields.shippingCoupon")}
          code={data.shipping_coupon}
          type={data.shipping_coupon_type}
          value={data.shipping_coupon_value}
          variant="shipping"
        />
      </div>
    </ReusableCard>
  );
};

export default OrderCouponSection;
