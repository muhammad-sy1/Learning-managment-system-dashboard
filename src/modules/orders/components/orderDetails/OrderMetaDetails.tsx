"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { formatPrice } from "@/utils/formatPrice";
import {
  Banknote,
  Calculator,
  Coins,
  MapPin,
  Package,
  Repeat,
  Route,
  Store,
  Truck,
} from "lucide-react";
import { IOrderByID } from "../../types/orders";
import { RowItem } from "@/components/RowItem";
import { useTranslations } from "next-intl";

interface Props {
  data: IOrderByID;
}

const OrderMetaDetails = ({ data }: Props) => {
  const pricing = data.delivery_pricing_meta;
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  return (
    <ReusableCard
      icon={<Truck className="h-6 w-6" />}
      title={t("deliveryPricing.title")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Row 1 */}
        <RowItem
          icon={<Calculator className="h-4 w-4 md:h-5 md:w-5" />}
          label={t("deliveryPricing.pricingModel")}
          value={pricing.pricing_model}
        />

        {/* Row 2 */}
        <RowItem
          icon={<Store className="h-4 w-4 md:h-5 md:w-5" />}
          label={t("deliveryPricing.storesCount")}
          value={pricing.stores_count}
        />

        {/* Row 3 */}
        <RowItem
          icon={<MapPin className="h-4 w-4 md:h-5 md:w-5" />}
          label={t("deliveryPricing.maxStoreDistance")}
          value={`${pricing.max_store_to_customer_distance_m} ${t("deliveryPricing.meter")}`}
        />

        {/* Row 4 */}
        <RowItem
          icon={<Coins className="h-4 w-4 md:h-5 md:w-5" />}
          label={t("deliveryPricing.baseDeliveryFee")}
          value={formatPrice(pricing.base_delivery_fee)}
        />

        {/* Row 5 */}
        <RowItem
          icon={<Repeat className="h-4 w-4 md:h-5 md:w-5" />}
          label={t("deliveryPricing.multiStoreExtraFee")}
          value={formatPrice(pricing.multi_store_extra_fee)}
        />

        {/* Row 6 */}
        <RowItem
          icon={<Package className="h-4 w-4 md:h-5 md:w-5" />}
          label={t("deliveryPricing.storeHandlingFees")}
          value={formatPrice(pricing.store_handling_fees)}
        />

        {/* المسافة بين المتاجر */}
        <div className="md:col-span-2 flex justify-between items-center p-2 md:p-3 bg-muted/40 rounded-xl border">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-medium text-sm md:text-base">
              {t("deliveryPricing.storeNetworkDistance")}
            </span>
          </div>
          <span className="font-semibold text-sm md:text-base whitespace-nowrap">
            {pricing.store_network_distance_m} {t("deliveryPricing.meter")}
          </span>
        </div>

        {/* الإجمالي */}
        <div className="md:col-span-2 flex justify-between items-center p-2 md:p-3 bg-gradient-to-r from-secondary/30 to-muted/30 rounded-xl border">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-medium text-sm md:text-base">
              {t("deliveryPricing.finalDeliveryFee")}
            </span>
          </div>
          <span className="font-bold text-sm md:text-base whitespace-nowrap">
            {formatPrice(pricing.final_delivery_fee)}
          </span>
        </div>
      </div>
    </ReusableCard>
  );
};

export default OrderMetaDetails;
