"use client";

import { TableCell } from "@/components/ui/table";
import { useTranslations } from "next-intl";
// import { useState } from "react";
import { IOrderLog } from "../../types/orderLogs";
import OrderLogTableActions from "./OrderLogTableActions";

interface OrderLogsRowTableProps {
  data: IOrderLog;
}

export default function OrderLogsRowTable({ data }: OrderLogsRowTableProps) {
  const t = useTranslations("Dashboard.OrdersPage.ordersLogs");

  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <OrderLogTableActions data={data} />
      </TableCell>
      <TableCell className="font-medium">{data.user.name}</TableCell>
      <TableCell>{data.user.role}</TableCell>
      <TableCell>{data.action}</TableCell>
      <TableCell>{data.created_at}</TableCell>
    </>
  );
}
