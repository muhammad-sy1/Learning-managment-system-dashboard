"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { Banknote, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";

interface Props {
  data: IOrderByID;
}

const OrderPaymentSection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  // console.log("hhhhhhhhhhhhhhhhhhhhhhhhh" + JSON.stringify(data));
  return (
    <ReusableCard
      icon={<CreditCard className="h-6 w-6" />}
      title={t("sections.paymentMethod")}
      //   gradientFrom="from-green-500"
      //   gradientTo="to-green-400"
    >
      <div className="space-y-4">
        <div className="relative p-6 bg-gradient-to-br from-secondary/20 to-muted/20 rounded-2xl border overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-12 -translate-x-12 opacity-30"></div>
          <div className="relative flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-lg">
              <Banknote className="h-8 w-8" />
            </div>
            <div>
              <span className="text-2xl text-foreground">
                {data?.payment?.payment_method === "CASH"
                  ? t("paymentMethods.cash")
                  : data?.payment?.payment_method}
              </span>
              <p className="text-muted-foreground mt-1">
                {t("paymentMethods.selectedMethod")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ReusableCard>
  );
};

export default OrderPaymentSection;
