"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useDeleteCategory from "../../hooks/useDeleteCategory";
import { ICategory } from "../../types/category";
import EditCategoryForm from "./EditCategoryForm";

interface CategoryTableActionsProps extends ICategory {}

export default function CategoryTableActions({
  id,
  ...data
}: CategoryTableActionsProps) {
  const { mutate } = useDeleteCategory();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const t = useTranslations("Dashboard.CategoriesPage");

  return (
    <div className="flex items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <Edit className="ml-2 h-4 w-4" />
            <span>{t("edit")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0"
          >
            <AreYouSureDeleteing
              TriggerButton={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 py-1.5 text-sm text-destructive hover:text-destructive"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  <span>{t("delete")}</span>
                </Button>
              }
              title={t("deleteTitle")}
              description={t("deleteDescription")}
              onAccept={() => mutate(id)}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveModal
        trigger={null}
        tooltipContent={t("edit")}
        title={t("edit")}
        description={t("editDescription")}
        maxWidth="lg"
        height="auto"
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      >
        <EditCategoryForm
          data={{ id, ...data }}
          onSuccess={() => setIsEditOpen(false)}
        />
      </ResponsiveModal>
    </div>
  );
}
