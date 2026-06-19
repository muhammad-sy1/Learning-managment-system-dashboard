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
import { IProductLogs } from "../../types/productLogs";
import { ProductDetails } from "../productDetails/ProductDetails";

interface ProductTableActionsProps {
  data: IProductLogs;
}

const LogsProductTableActions = ({ data }: ProductTableActionsProps) => {
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const { canView } = usePermissionStore();
  const tP = useTranslations("Dashboard.ProductPage");
  const tTable = useTranslations("Dashboard.tableHeaders");

  const canViewLogs = canView("products-logs");

  if (!canViewLogs) return null;

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
          <DropdownMenuItem
            onSelect={() => setIsProductDetailsOpen(true)}
            disabled={!data.snapshot}
          >
            <Eye className="ml-2 h-4 w-4" />
            <span>{tP("actions.view")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveModal
        trigger={null}
        title={`${tP("logs.title")} #${data.id}`}
        tooltipContent={tP("actions.view")}
        maxWidth="xl"
        height="80vh"
        open={isProductDetailsOpen}
        onOpenChange={setIsProductDetailsOpen}
      >
        {data.snapshot && <ProductDetails isLogs={true} product={data.snapshot} />}
      </ResponsiveModal>
    </div>
  );
};

export default LogsProductTableActions;
