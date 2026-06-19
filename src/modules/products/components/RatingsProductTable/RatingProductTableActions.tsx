"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
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
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDeleteRatingProduct } from "../../hooks/useDeleteProduct";
import { IRating } from "../../types/ratingsProduct";

interface ProductTableActionsProps {
  data: IRating;
  isSubProduct: boolean;
}

const RatingProductTableActions = ({ data }: ProductTableActionsProps) => {
  const { mutate } = useDeleteRatingProduct();
  const { canDelete } = usePermissionStore();
  const t = useTranslations("DeleteConfirmation");
  const tTable = useTranslations("Dashboard.tableHeaders");

  const canDeleteRating = canDelete("rating-products");

  if (!canDeleteRating) return null;

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
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
            <AreYouSureDeleteing
              TriggerButton={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 py-1.5 text-sm text-destructive hover:text-destructive"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  <span>{t("title")}</span>
                </Button>
              }
              title={t("title")}
              description={t("description")}
              onAccept={() => {
                mutate(data.id);
              }}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RatingProductTableActions;
