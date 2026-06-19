"use client";

import NavLink from "@/components/NavLink";
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
import { queryClient } from "@/lib/react-query/queryClient";
import { Edit, EyeIcon, History, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ORDERS_TABLE_QUERY_KEY } from "../..";
import { IOrder } from "../../types/orders";
import CustomOrderDetails from "../CustomorderDetails/CustomOrderDetails";
import OrderStatusForm from "./OrderStatusForm";

const CustomOrdersTableActions = (data: IOrder) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const tP = useTranslations("Dashboard.OrdersPage");
  const tTable = useTranslations("Dashboard.tableHeaders");
  const { canView, canUpdate } = usePermissionStore();

  const canUpdateOrder = canUpdate("orders");
  const canViewOrder = canView("orders");
  const canViewOrderLogs = canView("orders-logs");
  const hasActions = canUpdateOrder || canViewOrder || canViewOrderLogs;

  const DETAILS_KEY = "last-opened-order-id";

  useEffect(() => {
    const lastId = sessionStorage.getItem(DETAILS_KEY);
    if (lastId === String(data.id) && canViewOrder) {
      setIsDetailsOpen(true);
    }
  }, [canViewOrder, data.id]);

  const handleDetailsOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (open) {
      sessionStorage.setItem(DETAILS_KEY, String(data.id));
    } else {
      sessionStorage.removeItem(DETAILS_KEY);
    }
  };

  if (!hasActions) return null;

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

          {canUpdateOrder && (
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <Edit className="ml-2 h-4 w-4" />
              <span>{tP("title")}</span>
            </DropdownMenuItem>
          )}

          {canViewOrder && (
            <DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>
              <EyeIcon className="ml-2 h-4 w-4" />
              <span>{tP("detailsOrder")}</span>
            </DropdownMenuItem>
          )}

          {canViewOrderLogs && (
            <DropdownMenuItem asChild>
              <NavLink href={`/dashboard/orders/logs?order_id=${data.id}`} className="flex items-center">
                <History className="ml-2 h-4 w-4" />
                <span>{tP("actions.logs")}</span>
              </NavLink>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canUpdateOrder && (
        <ResponsiveModal
          trigger={null}
          title={tP("title")}
          tooltipContent={tP("title")}
          description={tP("updateStutus")}
          maxWidth="lg"
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <OrderStatusForm
            data={data}
            onSuccess={() => {
              setIsEditOpen(false);
              data.onUpdated?.();
              queryClient.invalidateQueries({
                queryKey: [ORDERS_TABLE_QUERY_KEY],
              });
            }}
          />
        </ResponsiveModal>
      )}

      {canViewOrder && (
        <ResponsiveModal
          trigger={null}
          title={tP("detailsOrder")}
          tooltipContent={tP("detailsOrder")}
          maxWidth="2xl"
          height="auto"
          open={isDetailsOpen}
          onOpenChange={handleDetailsOpenChange}
        >
          <CustomOrderDetails
            id={data.id}
            orderType={data.type}
            onUpdated={data.onUpdated}
          />
        </ResponsiveModal>
      )}
    </div>
  );
};

export default CustomOrdersTableActions;
