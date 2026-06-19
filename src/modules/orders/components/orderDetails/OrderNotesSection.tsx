"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { FileText, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";

interface Props {
  data: IOrderByID;
}

const OrderNotesSection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  return (
    <ReusableCard
      icon={<FileText className="h-6 w-6" />}
      title={t("sections.notes")}
      //   gradientFrom="from-green-500"
      //   gradientTo="to-green-400"
    >
      <div className="space-y-4">
        {data.client_notes && (
          <div className="relative p-6 bg-gradient-to-br from-secondary/20 to-muted/20 rounded-2xl border overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <h5 className="text-lg font-bold text-foreground">
                  {t("notes.clientNotes")}
                </h5>
              </div>
              <p className="text-foreground/80 leading-relaxed bg-card/50 p-4 rounded-lg">
                {data.client_notes}
              </p>
            </div>
          </div>
        )}

        {data.delivery_notes && (
          <div className="relative p-6 bg-gradient-to-br from-secondary/20 to-muted/20 rounded-2xl border overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 -translate-x-10 opacity-30"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                <h5 className="text-lg font-bold text-foreground">
                  {t("notes.deliveryNotes")}
                </h5>
              </div>
              <p className="text-foreground/80 leading-relaxed bg-card/50 p-4 rounded-lg">
                {data.delivery_notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </ReusableCard>
  );
};

export default OrderNotesSection;
