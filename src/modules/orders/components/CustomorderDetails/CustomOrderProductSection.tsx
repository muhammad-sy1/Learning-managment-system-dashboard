import React from "react";
import {
  MapPin,
  Receipt,
  ImageIcon,
  ShoppingCart,
  DollarSign,
  StoreIcon,
  Package,
} from "lucide-react";

// shadcn/ui components (assumes your project has them at these paths)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ICustomOrderStore, IOrderByID } from "../../types/orders";
import { ReusableCard } from "@/components/ReusableCard";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// type Item = {
//   name: string;
//   quantity: string | number;
// };

// type Merchant = {
//   id: number;
//   image: string | null;
//   store_location: string | null;
//   store_name: string;
// };

// type Store = {
//   id: number;
//   items: Item[];
//   items_image: string | null;
//   note: string | null;
//   paid_amount: number | null;
//   receipt_image: string | null;
//   paid_at: string | null;
//   receipt_threshold?: number | null;
//   merchant: Merchant;
// };

// type Props = {
//   stores: Store[];
// };

const FallbackText = ({ text = "غير محدد حاليا" }: { text?: string }) => (
  <span className="text-sm text-muted-foreground">{text}</span>
);

const StoreCard: React.FC<{ store: ICustomOrderStore }> = ({ store }) => {
  const imageUrl = store.merchant.image
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL || ""}/${store.merchant.image}`
    : null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={store.merchant.store_name} />
            ) : (
              <AvatarImage src={"/logo.svg"} alt={store.merchant.store_name} />
            )}
          </Avatar>

          <div>
            <h3 className="font-semibold">{store.merchant.store_name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {store.merchant.store_location || <FallbackText />}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              المبلغ المدفوع
              <Receipt className="h-4 w-4 ml-2" />
            </Badge>
            <div className="font-medium">
              {store.paid_amount !== null && store.paid_amount !== undefined ? (
                <span>{formatPrice(store.paid_amount)}</span>
              ) : (
                <FallbackText />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4">
        {/* Items list */}
        <div>
          <h4 className="text-sm font-medium mb-2">العناصر</h4>
          <ul className="space-y-2">
            {store.items && store.items.length ? (
              store.items.map((it, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-muted/20 p-3 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{it.name}</div>
                  </div>
                  <div className="text-sm font-medium">× {it.quantity}</div>
                </li>
              ))
            ) : (
              <div className="p-3 rounded-lg bg-muted/20">
                <FallbackText />
              </div>
            )}
          </ul>
        </div>

        {/* Items image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">صورة العناصر</h4>
            {store.items_image ? (
              <Image
                src={process.env.NEXT_PUBLIC_MEDIA_URL + store.items_image}
                alt={`items-${store.id}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed rounded-md h-40">
                <ImageIcon className="h-8 w-8 mb-2" />
                <FallbackText />
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">صورة الإيصال</h4>
            {store.receipt_image ? (
              <Image
                src={process.env.NEXT_PUBLIC_MEDIA_URL + store.receipt_image}
                alt={`receipt-${store.id}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed rounded-md h-40">
                <Receipt className="h-8 w-8 mb-2" />
                <FallbackText />
                <div className="mt-2">
                  <Button variant="ghost" size="sm" disabled>
                    عرض الإيصال
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Note & paid_at */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">ملاحظة المتجر</div>
            <div className="font-medium">{store.note || <FallbackText />}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">وقت الدفع</div>
            <div className="font-medium">
              {store.paid_at || <FallbackText />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// formatPrice helper (تكييف بسيط، استبدل بformatPrice الموجود عندك)
function formatPrice(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "غير محدد حاليا";
  const n = Number(value);
  return new Intl.NumberFormat("ar-SY", {
    style: "currency",
    currency: "SYP",
    maximumFractionDigits: 0,
  }).format(n);
}

const CustomOrderProductSection = ({
  stores,
}: {
  stores: ICustomOrderStore[];
}) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  // console.log("sssssssssssssssssssssss"+JSON.stringify(stores));
  if (!stores || !stores.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">لا توجد متاجر في هذا الطلب</p>
      </div>
    );
  }

  return (
    <ReusableCard
      icon={<Package className="h-6 w-6" />}
      title={`المتاجر (${stores.length})`}
    >
      <div className="space-y-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="p-4 rounded-xl border bg-card/50 hover:bg-card/70 transition-all"
          >
            {/* Store Header */}
            <div className="flex gap-4 items-start">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                <Image
                  src={
                    store.merchant.image
                      ? process.env.NEXT_PUBLIC_IMAGE_URL + store.merchant.image
                      : "/placeholder-store.jpg"
                  }
                  alt={store.merchant.store_name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-lg">
                  {store.merchant.store_name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {store.merchant.store_location}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t" />

            {/* Store Items */}
            {store.items && store.items.length > 0 ? (
              <div className="space-y-3">
                {store.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-secondary/20 px-4 py-2 rounded-lg text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold">× {item.quantity}</span>
                  </div>
                ))}
              </div>
            ) : store.items_image ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border cursor-zoom-in">
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL + store.items_image
                        }
                        alt="items"
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl p-0 overflow-hidden">
                    <div className="relative w-full h-[80vh]">
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL + store.items_image
                        }
                        alt="items-large"
                        fill
                        className="object-contain bg-black"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">لا توجد منتجات</p>
            )}

            {/* Note */}
            {store.note && (
              <div className="mt-3 text-sm bg-primary/10 px-4 py-2 rounded-lg">
                <span className="font-medium">ملاحظات المتجر:</span>{" "}
                {store.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </ReusableCard>
  );
};

export default CustomOrderProductSection;
