"use client";

import { AreYouSure } from "@/components/AreYouSure";
import { ReusableCard } from "@/components/ReusableCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/utils/formatPrice";
import { Package, RotateCcw, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ConfirmCancelReturn,
  ConfirmReturQuantity,
} from "../../services/orders";
import { IOrderByID } from "../../types/orders";
interface Props {
  data: IOrderByID;
  onUpdated?: () => void;
  setOrderState: any;
}

const OrderProductSection = ({ data, onUpdated, setOrderState }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  const [returnItems, setReturnItems] = useState<Record<number, number>>({});
  const [cancelReturnItems, setCancelReturnItems] = useState<
    Record<number, number>
  >({});
  const [selectedProduct, setSelectedProduct] = useState<{
    orderItem: number;
    product: any;
    maxQuantity: number;
    type?: "return" | "cancel-return";
  } | null>(null);

  // -------- types & derived data (no hooks) --------
  type OrderItem = (typeof data.items)[0];

  type GroupedItem = {
    product: OrderItem["product"];
    totalQuantity: number;
    totalPrice: number;
    returned_quantity: number;
    purchase_price: string;
    orderItem: number;
    total_price: string;
    items: typeof data.items;
  };

  const groupedItems = (data.items as OrderItem[]).reduce(
    (acc: Record<number, GroupedItem>, item) => {
      const productId = item.product.id as number;

      if (!acc[productId]) {
        acc[productId] = {
          product: item.product,
          totalQuantity: 0,
          totalPrice: 0,
          returned_quantity: 0,
          purchase_price: "",
          total_price: "",
          orderItem: item.id,
          items: [],
        };
      }

      acc[productId].totalQuantity += item.quantity;
      acc[productId].returned_quantity += item.returned_quantity;
      acc[productId].purchase_price = String(item.purchase_price);
      acc[productId].total_price = String(item.total_price);
      acc[productId].totalPrice +=
        parseFloat(String(item.total_price)) *
        (item.quantity - item.returned_quantity);
      acc[productId].items.push(item);

      return acc;
    },
    {} as Record<number, GroupedItem>,
  );
  // -------- handlers --------
  const handleOpenReturn = (group: GroupedItem) => {
    const remainingToReturn = group.totalQuantity - group.returned_quantity;
    if (remainingToReturn <= 0) return;

    setSelectedProduct({
      product: group.product,
      orderItem: group.orderItem,
      maxQuantity: remainingToReturn,
      type: "return",
    });

    setReturnItems((prev) => ({
      ...prev,
      [group.orderItem]: 1,
    }));
  };

  const handleQuantityChange = (orderItemId: number, quantity: number) => {
    setReturnItems((prev) => ({
      ...prev,
      [orderItemId]: Math.max(
        1,
        Math.min(quantity, selectedProduct?.maxQuantity || 1),
      ),
    }));
  };

  const handleOpenCancelReturn = (group: GroupedItem) => {
    if (group.returned_quantity <= 0) return;

    setSelectedProduct({
      product: group.product,
      orderItem: group.orderItem,
      maxQuantity: group.returned_quantity,
      type: "cancel-return",
    });

    setCancelReturnItems((prev) => ({
      ...prev,
      [group.orderItem]: group.returned_quantity,
    }));
  };

  const handleCancelReturnQuantityChange = (
    orderItemId: number,
    quantity: number,
  ) => {
    setCancelReturnItems((prev) => ({
      ...prev,
      [orderItemId]: Math.max(
        1,
        Math.min(quantity, selectedProduct?.maxQuantity || 1),
      ),
    }));
  };
  return (
    <ReusableCard
      icon={<Package className="h-6 w-6" />}
      title={`  ${t("sections.products")} ${data.items.length}`}
      //   gradientFrom="from-green-500"
      //   gradientTo="to-green-400"
    >
      <div className="space-y-4">
        {Object.values(groupedItems).map((group) => {
          const price = group.purchase_price || 0;
          const discounted = group.total_price || 0;
          const total = group.totalPrice || 0;
          const quantity = group.totalQuantity || 1;
          const refundedQuantity = group.returned_quantity ?? 0;

          const remainingToReturn = Math.max(0, quantity - refundedQuantity);
          const canReturn = remainingToReturn > 0;
          const canCancelReturn = refundedQuantity > 0;

          const isSelectedForReturn =
            selectedProduct?.product.id === group.product.id &&
            selectedProduct?.type === "return";
          const isSelectedForCancelReturn =
            selectedProduct?.product.id === group.product.id &&
            selectedProduct?.type === "cancel-return";

          return (
            <div
              key={group.product.id}
              className="p-3 rounded-xl border bg-card/50 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-22 h-22 relative rounded-lg overflow-hidden border shadow-sm">
                  <Image
                    src={
                      group.product.images[0]?.image
                        ? process.env.NEXT_PUBLIC_IMAGE_URL +
                          group.product.images[0].image
                        : "/placeholder-product.jpg"
                    }
                    alt={group.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3 text-lg leading-tight">
                    {group.product.name}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div className="flex items-center gap-5 w-fit bg-secondary/20 px-4 py-2 rounded-lg text-sm">
                      <span className="text-muted-foreground">
                        {t("fields.mainQuantity")}
                      </span>
                      <span className="font-semibold">{quantity}</span>
                    </div>
                    <div className="flex items-center gap-5 w-fit bg-secondary/20 px-4 py-2 rounded-lg text-sm">
                      <span className="text-muted-foreground">
                        {t("fields.refundedQuantity")}
                      </span>
                      <span className="font-semibold">{refundedQuantity}</span>
                    </div>

                    <div className="flex items-center justify-between bg-secondary/20 px-2 py-2 rounded-lg text-sm">
                      <span className="text-muted-foreground">
                        {t("fields.unitPriceBeforeDiscount")}:
                      </span>
                      <span className="line-through text-muted-foreground">
                        {formatPrice(price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-primary/10 px-4 py-2 rounded-lg text-sm">
                      <span className="text-primary">
                        {t("fields.unitPriceAfterDiscount")}:
                      </span>
                      <span className="text-primary">
                        {formatPrice(discounted)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-primary/20 px-4 py-2 rounded-lg text-sm">
                      <span className="text-foreground">
                        {t("fields.totalPrice")}
                      </span>
                      <span className="text-primary text-base">
                        {formatPrice(total)}
                      </span>
                    </div>

                    {/* Return product */}
                    <div className="col-span-full mt-4 space-y-2">
                      <Button
                        onClick={() => handleOpenReturn(group)}
                        variant="outline"
                        disabled={!canReturn}
                        className="flex items-center gap-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RotateCcw className="h-4 w-4" />
                        {t("actions.returnProduct")}
                      </Button>

                      {isSelectedForReturn && (
                        <div className="mt-3 p-4 border rounded-lg space-y-3">
                          <Label
                            htmlFor={`return-quantity-${group.product.id}`}
                            className="text-amber-800 font-medium block"
                          >
                            {t("fields.returnQuantity")} (الحد الأقصى:{" "}
                            {selectedProduct?.maxQuantity})
                          </Label>

                          <div className="flex gap-3 items-center flex-wrap">
                            <Input
                              id={`return-quantity-${group.product.id}`}
                              type="number"
                              min={1}
                              max={selectedProduct?.maxQuantity ?? quantity}
                              value={returnItems[group.orderItem] ?? 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  group.orderItem,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="max-w-32 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                            />

                            <AreYouSure
                              onAccept={async () => {
                                const qty = returnItems[group.orderItem] ?? 1;
                                await ConfirmReturQuantity(
                                  group.orderItem,
                                  qty,
                                );
                                // refund: increase returned_quantity
                                setOrderState((prev: any) => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    items: prev.items.map((item: any) =>
                                      item.id === group.orderItem
                                        ? {
                                            ...item,
                                            returned_quantity:
                                              item.returned_quantity + qty,
                                          }
                                        : item,
                                    ),
                                  };
                                });
                                setSelectedProduct(null);
                                onUpdated?.();
                              }}
                              TriggerButton={
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                                  {t("actions.saveReturn")}
                                </Button>
                              }
                              title={t("messages.confirmReturn")}
                            />

                            <Button
                              onClick={() => setSelectedProduct(null)}
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              {t("actions.cancel")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cancel return (unrefund) */}
                    <div className="col-span-full mt-4 space-y-2">
                      {canCancelReturn && (
                        <Button
                          onClick={() => handleOpenCancelReturn(group)}
                          variant="outline"
                          className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          <Undo2 className="h-4 w-4" />
                          {t("actions.cancelReturn")}
                        </Button>
                      )}

                      {isSelectedForCancelReturn && (
                        <div className="mt-3 p-4 border rounded-lg space-y-3">
                          <Label
                            htmlFor={`cancel-return-quantity-${group.product.id}`}
                            className="text-green-800 font-medium block"
                          >
                            {t("fields.cancelReturnQuantity")} (الحد الأقصى:{" "}
                            {selectedProduct?.maxQuantity})
                          </Label>

                          <div className="flex gap-3 items-center flex-wrap">
                            <Input
                              id={`cancel-return-quantity-${group.product.id}`}
                              type="number"
                              min={1}
                              max={
                                selectedProduct?.maxQuantity ?? refundedQuantity
                              }
                              value={
                                cancelReturnItems[group.orderItem] ??
                                refundedQuantity
                              }
                              placeholder={t("fields.cancelReturnQuantity")}
                              onChange={(e) =>
                                handleCancelReturnQuantityChange(
                                  group.orderItem,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="max-w-32 border-green-300 focus:border-green-500 focus:ring-green-500"
                            />

                            <AreYouSure
                              onAccept={async () => {
                                const quantityToCancel =
                                  cancelReturnItems[group.orderItem] ??
                                  refundedQuantity;
                                await ConfirmCancelReturn(
                                  group.orderItem,
                                  quantityToCancel,
                                );
                                // unrefund: decrease returned_quantity
                                setOrderState((prev: any) => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    items: prev.items.map((item: any) =>
                                      item.id === group.orderItem
                                        ? {
                                            ...item,
                                            returned_quantity: Math.max(
                                              0,
                                              item.returned_quantity -
                                                quantityToCancel,
                                            ),
                                          }
                                        : item,
                                    ),
                                  };
                                });
                                onUpdated?.();
                                setSelectedProduct(null);
                              }}
                              TriggerButton={
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                  {t("actions.saveCancelReturn")}
                                </Button>
                              }
                              title={t("messages.confirmCancelReturn")}
                            />

                            <Button
                              onClick={() => setSelectedProduct(null)}
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              {t("actions.cancel")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ReusableCard>
  );
};

export default OrderProductSection;
