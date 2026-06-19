"use client"
import { useTranslations } from "next-intl";
import LogItem from "./LogItem";

const ChangesLogOrder = ({ data }: { data: any }) => {
  const logsData = data?.logs?.data || data?.data || data;
  const t = useTranslations("Dashboard.OrdersPage.ordersLogs");

  if (!logsData || (Array.isArray(logsData) && logsData.length === 0)) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-400 text-sm p-4">
          {t("noChanges")}
        </p>
      </div>
    );
  }

  const logsArray = Array.isArray(logsData) ? logsData : [logsData];

  return (
    <div className="space-y-4 mt-4">
      {logsArray.map((log: any) => (
        <LogItem key={log.id} log={log} />
      ))}
    </div>
  );
};

export default ChangesLogOrder;
