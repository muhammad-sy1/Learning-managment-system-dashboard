"use client";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Calendar, FileText, IdCard, Settings, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useGeLogsProduct } from "../../hooks/useGeLogsProduct";
import LogsProductRowTable from "./LogsProductRowTable";

export default function LogsProductTable() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const { data: logsResponse, isPending } = useGeLogsProduct(productId);
  const t = useTranslations("Dashboard.ProductPage.logs");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const TABLE_HEADERS = [
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },
    { Icon: <User2 className="h-4 w-4" />, label: tHeaders("userAction") },
    { Icon: <FileText className="h-4 w-4" />, label: tHeaders("action") },
    { Icon: <FileText className="h-4 w-4" />, label: tHeaders("summary") },
    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("createdAt") },
  ];

  const ratingsData = logsResponse?.data || [];

  return (
    <div className="space-y-6">
      <ReusableTable
        title={t("title")}
        titleIcon={<IdCard className="h-4 w-4" />}
        actionButton={null}
        headers={TABLE_HEADERS}
        data={ratingsData}
        isPending={isPending}
        paginationProps={
          logsResponse?.data
            ? {
                name: "ratings",
                totalItems: logsResponse.data.length || 0,
                totalPages: logsResponse.last_page || 1,
              }
            : undefined
        }
        density="md"
        height={64}
        renderRow={(logs) => <LogsProductRowTable key={logs.id} data={logs} />}
      />
    </div>
  );
}
