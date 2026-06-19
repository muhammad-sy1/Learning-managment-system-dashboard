"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Barcode,
  Calendar1,
  Circle,
  Clock,
  DollarSign,
  Hash,
  Maximize,
  MoreHorizontal,
  Tag,
  TicketPercent,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetCoupons } from "../../hooks/useGetCoupons";
import AddCouponForm from "./AddCouponForm";
import CouponRowTable from "./CouponRowTable";
import { usePermissionStore } from "@/hooks/usePermissionStore";

function CouponsTable() {
  const [addCouponModalOpen, setAddCouponModalOpen] = useState(false);
  const { data: coupons, isPending } = useGetCoupons();
  const t = useTranslations("Dashboard.CouponsPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");
  const { canCreate } = usePermissionStore();

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
    {
      Icon: <Hash className="h-4 w-4" />,
      label: tHeaders("id"),
    },
    {
      Icon: <MoreHorizontal className="h-4 w-4" />,
      label: tHeaders("actions"),
    },
    {
      Icon: <Barcode className="h-4 w-4" />,
      label: tHeaders("code"),
    },
    {
      Icon: <Tag className="h-4 w-4" />,
      label: tHeaders("type"),
    },
    {
      Icon: <Tag className="h-4 w-4" />,
      label: tHeaders("typeShipping"),
    },
    {
      Icon: <DollarSign className="h-4 w-4" />,
      label: tHeaders("value"),
    },
    {
      Icon: <DollarSign className="h-4 w-4" />,
      label: tHeaders("minOrderAmount"),
    },
    {
      Icon: <Maximize className="h-4 w-4" />,
      label: tHeaders("usageLimit"),
    },
    {
      Icon: <BarChart3 className="h-4 w-4" />,
      label: tHeaders("uses_count"),
    },
    {
      Icon: <Circle className="h-4 w-4" />,
      label: tHeaders("isCompanySponsored"),
    },
    {
      Icon: <Circle className="h-4 w-4" />,
      label: tHeaders("isGlobalForProducts"),
    },
    {
      Icon: <Circle className="h-4 w-4" />,
      label: tHeaders("isGlobalForUsers"),
    },
    {
      Icon: <Circle className="h-4 w-4" />,
      label: tHeaders("status"),
    },
    {
      Icon: <Calendar1 className="h-4 w-4" />,
      label: tHeaders("updatedAt"),
    },
    {
      Icon: <Clock className="h-4 w-4" />,
      label: tHeaders("expiresAt"),
    },
    {
      Icon: <Calendar1 className="h-4 w-4" />,
      label: tHeaders("createdAt"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<TicketPercent className="h-5 w-5 text-primary" />}
          description={t("description")}
          title={t("title")}
          headers={TABLE_HEADERS}
          data={coupons?.data || []}
          isPending={isPending}
          actionButton={
            <ResponsiveModal
              trigger={
                canCreate("coupons") ? (
                  <Button variant="premium">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>{t("createNewCoupon")}</span>
                  </Button>
                ) : null
              }
              title={t("createNewCoupon")}
              description={t("createCouponDescription")}
              open={addCouponModalOpen}
              onOpenChange={setAddCouponModalOpen}
              maxWidth="xl"
              height="auto"
            >
              <AddCouponForm onSuccess={() => setAddCouponModalOpen(false)} />
            </ResponsiveModal>
          }
          paginationProps={
            coupons?.data?.length
              ? {
                  name: "coupons",
                  totalItems: coupons?.total || 0,
                  totalPages: coupons?.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          className=""
          renderRow={(coupon) => (
            <CouponRowTable key={coupon.id} data={coupon} />
          )}
        />
      </div>
    </div>
  );
}

export default CouponsTable;
