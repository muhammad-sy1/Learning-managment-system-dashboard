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
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useDeleteZone from "../../hooks/useDeleteZone";
import { IZone } from "../../types/zone";
import EditZoneForm from "./EditZoneForm";

const ZoneTableActions = (data: IZone) => {
  const { mutate } = useDeleteZone();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const t = useTranslations("DeleteConfirmation");
  const tP = useTranslations("Dashboard.ZonePage");
  const tTable = useTranslations("Dashboard.tableHeaders");
  const { canDelete, canUpdate } = usePermissionStore();

  const canUpdateZone = canUpdate("zones");
  const canDeleteZone = canDelete("zones");
  const hasActions = canUpdateZone || canDeleteZone;

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

          {canUpdateZone && (
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <Edit className="ml-2 h-4 w-4" />
              <span>{tP("titleTable")}</span>
            </DropdownMenuItem>
          )}

          {canDeleteZone && (
            <>
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
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canUpdateZone && (
        <ResponsiveModal
          trigger={null}
          title={tP("titleTable")}
          description={tP("descriptionTable")}
          maxWidth="lg"
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <EditZoneForm data={data} onSuccess={() => setIsEditOpen(false)} />
        </ResponsiveModal>
      )}
    </div>
  );
};

export default ZoneTableActions;
