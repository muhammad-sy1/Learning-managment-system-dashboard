"use client";
import Loading from "@/app/[locale]/dashboard/loading";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import { useGetOrdersById } from "../../hooks/useGetOrdersById";

import { useEffect, useState } from "react";
import OrderAddressSection from "./OrderAddressSection";
import OrderCouponSection from "./OrderCouponSection";
import OrderNotesSection from "./OrderNotesSection";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderProductSection from "./OrderProductSection";
import OrderSummarySection from "./OrderSummarySection";
import OrderTimeLineSection from "./OrderTimeLineSection";
import OrderUserSection from "./OrderUserSection";
import { IOrderByID, OrderType } from "../../types/orders";
import AssigningOrder from "./AssigningOrder";
import OrderMetaDetails from "./OrderMetaDetails";

interface IProps {
  id: number | string;
  onUpdated?: () => void;
  orderType?: OrderType;
}

const OrderDetails = ({ id, onUpdated, orderType }: IProps) => {
  const { data: Order, isPending } = useGetOrdersById({ id, orderType });
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  const [orderState, setOrderState] = useState<IOrderByID | null>(null);

  // keep a local copy so we can update returned_quantity optimistically
  useEffect(() => {
    if (Order?.order) {
      setOrderState(Order.order);
    }
  }, [Order]);

  // while loading and we still don't have local order

  const order = orderState;

  if (isPending && !orderState) {
    return <Loading customHeight="h-96" text={t("loading.title")} />;
  }
  if (!order) return null;

  const getStatusText = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return t("statuses.processing");
      case "COMPLETED":
        return t("statuses.completed");
      case "DELEVIRING":
        return t("statuses.dilivering");
      case "PREPARING":
        return t("statuses.preparing");
      case "CANCELED":
        return t("statuses.canceled");
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 p-2">
      {/* Header with enhanced status */}
      <div className="flex items-center gap-4 justify-center mt-2">
        <Badge>
          {order.type == "MARKET"
            ? t("orderType.market")
            : order.type == "RESTURANT"
              ? t("orderType.restaurant")
              : t("orderType.custom")}
        </Badge>
        <div className="text-sm text-center text-muted-foreground bg-card px-4 py-2 rounded-full border">
          {t("orderNumber")} #{order.id}
        </div>
        <Badge
          variant={
            order.status.toLocaleLowerCase() as
              | "processing"
              | "completed"
              | "deleviring"
              | "canceled"
              | "default"
          }
          className="px-4 py-2 rounded-full "
        >
          {getStatusText(order?.status)}
        </Badge>
      </div>

      <ScrollArea>
        <div className="space-y-6 px-1 pb-8">
          {/*Timeline */}
          <OrderTimeLineSection data={order} />

          {/* {(order.status == "PROCESSING" || order.status == "PREPARING") && ( */}
          <AssigningOrder data={order} />
          {/* )} */}

          <OrderMetaDetails data={order} />
          
          {/* Enhanced Order Summary */}
          <OrderSummarySection data={order} />

          {/* coupon  */}
          {(order.discount_amount || order.shipping_discount_amount) && (
            <OrderCouponSection data={order} />
          )}

          {/* user Card */}
          <OrderUserSection data={order} />

          {/* Products Section */}

          <OrderProductSection
            data={order}
            onUpdated={onUpdated}
            setOrderState={setOrderState}
          />

          {/* Address Section */}
          <OrderAddressSection data={order} />
          {/* Payment Section */}
          <OrderPaymentSection data={order} />

          {/* Notes Section */}
          {(order.client_notes || order.delivery_notes) && (
            <OrderNotesSection data={order} />
          )}

          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderDetails;
