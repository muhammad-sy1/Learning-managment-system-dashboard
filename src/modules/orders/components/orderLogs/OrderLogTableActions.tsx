"use client";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Eye, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IOrderLog } from "../../types/orderLogs";
import ChangesLogOrder from "./changes/ChangesLogOrder";

const OrderLogTableActions = ({ data }: { data: IOrderLog }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const t = useTranslations("Dashboard.OrdersPage.ordersLogs");
  const tTable = useTranslations("Dashboard.tableHeaders");
  const { canView } = usePermissionStore();

  const canViewOrderLogs = canView("orders-logs");

  if (!canViewOrderLogs) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{tTable("actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <Eye className="ml-2 h-4 w-4" />
            <span>{t("logsTitle")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveModal
        trigger={null}
        title={t("logsTitle")}
        maxWidth="lg"
        height="auto"
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      >
        <ChangesLogOrder data={data} />
      </ResponsiveModal>
    </div>
  );
};

export default OrderLogTableActions;
