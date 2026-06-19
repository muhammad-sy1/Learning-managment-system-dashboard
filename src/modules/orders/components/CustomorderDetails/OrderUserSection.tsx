"use client";

import NavLink from "@/components/NavLink";
import { ReusableCard } from "@/components/ReusableCard";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";
import { SafeImage } from "@/components/SafeImage";

interface Props {
  data: IOrderByID;
}

const OrderUserSection = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");

  return (
    <ReusableCard
      icon={<User2 className="h-6 w-6" />}
      title={t("fields.user")}
      //   gradientFrom="from-green-500"
      //   gradientTo="to-green-400"
    >
      <div className="space-y-4">
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border space-y-3">
          <div className="flex items-center gap-3">
            {data?.user?.image ? (
              <SafeImage
                imageUrl={data.user?.image}
                alt={data.user?.first_name?.charAt(0)}
                disablePopup={false}
              />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                {data.user?.first_name?.charAt(0)}
              </div>
            )}

            <div>
              <div className="font-medium text-lg">
                {data.user?.first_name} {data?.user?.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                +{data?.user?.country_code ?? " "}{" "}
                {data?.user?.phone_number ?? " "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <NavLink href={`/dashboard/users?role=CLIENT&id=${data?.user?.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300">
              {t("fields.viewUser")}
            </Button>
          </NavLink>
        </div>
      </div>
    </ReusableCard>
  );
};

export default OrderUserSection;
