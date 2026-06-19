"use client";
import { ReusableCard } from "@/components/ReusableCard";
import { FileText, Home, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";
import { RowItem } from "@/components/RowItem";

interface Props {
  data: IOrderByID;
}

const OrderAddressSection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  const { address } = data;

  return (
    <ReusableCard
      icon={<Home className="h-6 w-6" />}
      title={t("sections.deliveryAddress")}
    >
      <div className="relative p-6 bg-gradient-to-br from-secondary/20 to-muted/20 rounded-2xl border overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>

        <div className="relative space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              {address?.zone.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <RowItem
                label={t("addressFields.neighborhood")}
                value={address?.neighborhood}
              />
              <RowItem
                label={t("addressFields.street")}
                value={address?.street}
              />
            </div>
            <div className="space-y-3">
              <RowItem
                label={t("addressFields.buildingNumber")}
                value={address?.building_number}
              />
              <RowItem
                label={t("addressFields.floorNumber")}
                value={address?.floor_number}
              />
            </div>
          </div>

          {address?.notes && (
            <div className="mt-6 p-4 bg-card/50 rounded-xl border">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">
                    {t("fields.notes")}:
                  </span>
                  <p className="text-foreground/80 whitespace-pre-line mt-2 leading-relaxed">
                    {address.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReusableCard>
  );
};

export default OrderAddressSection;
