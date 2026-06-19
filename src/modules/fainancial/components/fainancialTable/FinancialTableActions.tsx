"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
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
import {
  Edit,
  Layers,
  Layers2,
  MoreHorizontal,
  Receipt,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useDeleteFainance from "../../hooks/Financials/useDeleteFainance";
import { IFinancialSection } from "../../types/fainancial";
import EditSectionForm from "./EditFinancialForm";

interface SectionTableActionsProps extends IFinancialSection {
  sectionType: string;
  parent_section?: IFinancialSection;
  permissionKey: string;
}

const FinancialTableActions = ({
  sectionType,
  parent_section,
  permissionKey,
  ...data
}: SectionTableActionsProps) => {
  const { mutate } = useDeleteFainance();
  const { canView, canDelete, canUpdate } = usePermissionStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const t = useTranslations("DeleteConfirmation");
  const tP = useTranslations("Dashboard.SectionPage");
  const tSubsection = useTranslations("Dashboard.SubSectionPage");
  const tTable = useTranslations("Dashboard.tableHeaders");

  const canUpdateSection = canUpdate(permissionKey);
  const canDeleteSection = canDelete(permissionKey);
  const canViewTransactions = canView("transactions");
  const canViewMainTransactions =
    sectionType === "FINANCIAL_MAIN_SECTIONS" && canViewTransactions;
  const canViewSubTransactions =
    sectionType === "FINANCIAL_SUB_SECTIONS" && canViewTransactions;
  const canViewSubsections =
    sectionType === "FINANCIAL_MAIN_SECTIONS" && canView("sub-finance");

  const hasActions =
    canUpdateSection ||
    canViewMainTransactions ||
    canViewSubTransactions ||
    canViewSubsections ||
    canDeleteSection;

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

          {canUpdateSection && (
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <Edit className="ml-2 h-4 w-4" />
              <span>
                {sectionType === "CATIGORIES"
                  ? tP("editSection")
                  : tSubsection("editSubsection")}
              </span>
            </DropdownMenuItem>
          )}

          {canViewMainTransactions && (
            <DropdownMenuItem asChild>
              <NavLink
                href={`/dashboard/transactions?section_id=${data.id}`}
                className="flex items-center"
              >
                <Receipt className="ml-2 h-4 w-4" />
                <span>{tP("showTransactions")}</span>
              </NavLink>
            </DropdownMenuItem>
          )}

          {canViewSubTransactions && (
            <DropdownMenuItem asChild>
              <NavLink
                href={`/dashboard/transactions?sub_section_id=${data.id}`}
                className="flex items-center"
              >
                <Layers2 className="ml-2 h-4 w-4" />
                <span>{tP("logs")}</span>
              </NavLink>
            </DropdownMenuItem>
          )}

          {canViewSubsections && (
            <DropdownMenuItem asChild>
              <NavLink
                href={`/dashboard/sub-finance?type=${"FINANCIAL_SUB_SECTIONS"}&parent_id=${
                  data.id
                }`}
                className="flex items-center"
              >
                <Layers className="ml-2 h-4 w-4" />
                <span>{tP("showSubsections")}</span>
              </NavLink>
            </DropdownMenuItem>
          )}

          {canDeleteSection && (
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

      {canUpdateSection && (
        <ResponsiveModal
          trigger={null}
          tooltipContent={tP("editSection")}
          title={
            sectionType === "CATIGORIES"
              ? tP("editSection")
              : tSubsection("editSubsection")
          }
          description={
            sectionType === "CATIGORIES"
              ? tP("description")
              : tSubsection("description")
          }
          maxWidth="lg"
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <EditSectionForm
            data={data}
            sectionType={sectionType}
            parent_section={parent_section}
            onSuccess={() => setIsEditOpen(false)}
          />
        </ResponsiveModal>
      )}
    </div>
  );
};

export default FinancialTableActions;
