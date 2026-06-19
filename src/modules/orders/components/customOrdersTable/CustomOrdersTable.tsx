"use client";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Banknote, Calendar, IdCard, Map, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetOrders } from "../../hooks/useGetOrders";
import CustomOrdersRowTable from "./CustomOrdersRowTable";

function CustomOrdersTable() {
  const { data: Orders, isPending, refetch } = useGetOrders();
  const t = useTranslations("Dashboard.OrdersPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
      {
        Icon: <IdCard className="h-4 w-4" />,
        label: tHeaders("id"),
      },
      {
        Icon: <Settings className="h-4 w-4" />,
        label: tHeaders("actions"),
      },
      {
        Icon: <User className="h-4 w-4" />,
        label: tHeaders("customer"),
      },

      // {
      //   Icon: <Banknote className="h-4 w-4" />,
      //   label: tHeaders("totalPrice"),
      // },
      {
        Icon: <Banknote className="h-4 w-4" />,
        label: tHeaders("shippingCouponValue"),
      },
      // {
      //   Icon: <Banknote className="h-4 w-4" />,
      //   label: tHeaders("totalPriceAfterDiscount"),
      // },
      {
        Icon: <Banknote className="h-4 w-4" />,
        label: tHeaders("totalPriceAfterDiscount"),
      },
      // {
      //   Icon: <Banknote className="h-4 w-4" />,
      //   label: tHeaders("finalPrice"),
      // },

      {
        Icon: <Calendar className="h-4 w-4" />,
        label: tHeaders("createdAt"),
      },
      {
        Icon: <Calendar className="h-4 w-4" />,
        label: tHeaders("status"),
      },
    ];

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Map className="h-5 w-5 text-primary" />}
          description={t("description")}
          title={t("title")}
          headers={TABLE_HEADERS}
          data={Orders?.orders.data || []}
          isPending={isPending}
          actionButton={null}
          paginationProps={
            Orders?.orders?.data?.length
              ? {
                name: "provinces",
                totalItems: Orders?.orders.total || 0,
                totalPages: Orders?.orders.last_page || 1,
              }
              : undefined
          }
          density="md"
          height={64}
          className=""
          renderRow={(order) => (
            <CustomOrdersRowTable key={order.id} data={{ ...order, onUpdated: refetch }} />
          )}
        />
      </div>
    </div>
  );
}

export default CustomOrdersTable;
