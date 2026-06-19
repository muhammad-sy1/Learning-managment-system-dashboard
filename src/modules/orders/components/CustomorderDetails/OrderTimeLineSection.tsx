"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { formatUtcToLocal } from "@/utils/formatDate";
import { CheckCircle, Clock1, Package, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";

interface Props {
  data: IOrderByID;
}

const OrderTimeLineSection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  return (
    <ReusableCard
      icon={<Clock1 className="h-6 w-6" />}
      title={t("sections.orderTimeline")}
      //   gradientFrom="from-green-500"
      //   gradientTo="to-green-400"
    >
      <div className="relative space-y-6">
        {/* Timeline line */}
        <div className="absolute right-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/40 to-primary/20"></div>

        <div className="relative flex items-center gap-6 group">
          <div className="relative z-10 p-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="flex-1 p-4 bg-gradient-to-r from-secondary/20 to-muted/20 rounded-xl border group-hover:shadow-md transition-all duration-300">
            <p className="font-bold text-foreground text-lg">
              {t("timeline.orderCreated")}
            </p>
            <p className="text-muted-foreground mt-1">
              {formatUtcToLocal(data.created_at)}
            </p>
          </div>
        </div>

        {data.processing_at && (
          <div className="relative flex items-center gap-6 group">
            <div className="relative z-10 p-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Package className="h-6 w-6" />
            </div>
            <div className="flex-1 p-4 bg-gradient-to-r from-secondary/20 to-muted/20 rounded-xl border group-hover:shadow-md transition-all duration-300">
              <p className="font-bold text-foreground text-lg">
                {t("timeline.processing")}
              </p>
              <p className="text-muted-foreground mt-1">
                {formatUtcToLocal(data.processing_at)}
              </p>
            </div>
          </div>
        )}

        {data.picked_up_at && (
          <div className="relative flex items-center gap-6 group">
            <div className="relative z-10 p-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Truck className="h-6 w-6" />
            </div>
            <div className="flex-1 p-4 bg-gradient-to-r from-secondary/20 to-muted/20 rounded-xl border group-hover:shadow-md transition-all duration-300">
              <p className="font-bold text-foreground text-lg">
                {t("timeline.pickedUp")}
              </p>
              <p className="text-muted-foreground mt-1">
                {formatUtcToLocal(data.picked_up_at)}
              </p>
            </div>
          </div>
        )}

        {data.delivered_at && (
          <div className="relative flex items-center gap-6 group">
            <div className="relative z-10 p-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="flex-1 p-4 bg-gradient-to-r from-secondary/20 to-muted/20 rounded-xl border group-hover:shadow-md transition-all duration-300">
              <p className="font-bold text-foreground text-lg">
                {t("timeline.delivered")}
              </p>
              <p className="text-muted-foreground mt-1">
                {formatUtcToLocal(data.delivered_at)}
              </p>
            </div>
          </div>
        )}
      </div>
    </ReusableCard>
  );
};

export default OrderTimeLineSection;
