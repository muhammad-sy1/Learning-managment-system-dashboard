"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { RowItem } from "@/components/RowItem";
import { formatUtcToLocal } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { Banknote, Calendar, ShoppingBag, Star, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";

interface Props {
  data: IOrderByID;
}

const OrderSummarySection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  // =========================
  // Calculations
  // =========================
  const shippingCost = Number(data?.shipping_cost || 0);
  const discountAmount = Number(data?.shipping_discount_amount || 0);
  const boostAmount = Number(data?.boost_amount || 0);

  // المبلغ الإجمالي (قبل الخصم)
  const grandTotalBeforeDiscount =
    Number(data?.final_total_so_far || 0) + discountAmount;

  // المبلغ بعد الخصم
  const grandTotalAfterDiscount = Number(data?.final_total_so_far || 0);

  return (
    <ReusableCard icon={<ShoppingBag className="h-6 w-6" />} title="ملخص الطلب">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left column */}
        <div className="grid grid-rows-2 gap-4">
          <RowItem
            icon={<Calendar className="h-5 w-5" />}
            label="تاريخ الطلب"
            value={formatUtcToLocal(data.created_at)}
          />

          <RowItem
            icon={<Banknote className="h-5 w-5" />}
            label="المبلغ الإجمالي"
            value={formatPrice(grandTotalBeforeDiscount)}
          />
        </div>

        {/* Right column */}
        <div className="grid grid-rows-2 gap-4">
          <RowItem
            icon={<Truck className="h-5 w-5" />}
            label="تكلفة الشحن"
            value={formatPrice(shippingCost)}
          />

          <RowItem
            icon={<Star className="h-5 w-5" />}
            label="الخصم"
            value={formatPrice(discountAmount)}
          />
        </div>
        <RowItem
          icon={<Star className="h-5 w-5" />}
          label="مبلغ التعزيز"
          value={formatPrice(boostAmount)}
        />

        {/* Total after discount */}
        <div className="flex col-span-2 justify-between items-center p-3 bg-gradient-to-r from-secondary/30 to-muted/30 rounded-xl border">
          <div className="flex items-center gap-2 text-foreground">
            <Banknote className="h-5 w-5" />
            <span className="font-medium">
              {t("fields.totalPriceAfterDiscount")}
            </span>
          </div>
          <span className="font-bold text-foreground">
            {formatPrice(grandTotalAfterDiscount)}
          </span>
        </div>
      </div>
    </ReusableCard>
  );
};

export default OrderSummarySection;
