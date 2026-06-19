"use client";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Calendar, Edit, IdCard, Settings, Shield, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetLogOrders } from "../../hooks/useGetLogOrders";
import OrderLogsRowTable from "./OrderLogsRowTable";

function OrderLogsTable() {
  const { data: logsData, isPending } = useGetLogOrders();
  const t = useTranslations("Dashboard.OrdersPage.ordersLogs");
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
      label: tHeaders("user"),
    },
    {
      Icon: <Shield className="h-4 w-4" />,
      label: tHeaders("role"),
    },
    {
      Icon: <Edit className="h-4 w-4" />,
      label: tHeaders("action"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("createdAt"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Edit className="h-5 w-5 text-primary" />}
          description={t("logsDescription")}
          title={t("logsTitle")}
          headers={TABLE_HEADERS}
          data={logsData?.logs?.logs?.data || []}
          isPending={isPending}
          actionButton={null}
          paginationProps={
            logsData?.logs?.logs?.data?.length
              ? {
                  name: "logs",
                  totalItems: logsData?.logs?.logs?.total || 0,
                  totalPages: logsData?.logs?.logs?.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          className=""
          renderRow={(log) => <OrderLogsRowTable key={log.id} data={log} />}
        />
      </div>
    </div>
  );
}

export default OrderLogsTable;
