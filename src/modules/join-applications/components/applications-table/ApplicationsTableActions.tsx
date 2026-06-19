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
import { queryClient } from "@/lib/react-query/queryClient";
import { Edit, EyeIcon, FileStack, FileText, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { APPLICATIONS_TABLE_QUERY_KEY } from "../..";
import { IApplications } from "../../types/applications";
import ApplicationDetails from "./ApplicationDetails";
import ApplicationContracts from "./ApplicationContracts";
import ApplicationStatusForm from "./ApplicationStatusForm";
import ContractGenerationForm from "./ContractGenerationForm";

interface ApplicationsTableActionsProps extends IApplications {
  permissionKey: string;
}

const ApplicationsTableActions = ({
  permissionKey,
  ...data
}: ApplicationsTableActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isContractGenerationOpen, setIsContractGenerationOpen] =
    useState(false);
  const [isContractsOpen, setIsContractsOpen] = useState(false);
  const tP = useTranslations("Dashboard.applicationsPage");
  const tTable = useTranslations("Dashboard.tableHeaders");
  const { canView, canUpdate } = usePermissionStore();

  const canUpdateApplication = canUpdate(permissionKey);
  const canViewApplication = canView(permissionKey);
  const hasActions = canUpdateApplication || canViewApplication;

  const DETAILS_KEY = "last-opened-application-id";

  useEffect(() => {
    const lastId = sessionStorage.getItem(DETAILS_KEY);
    if (lastId === String(data.id) && canViewApplication) {
      setIsDetailsOpen(true);
    }
  }, [canViewApplication, data.id]);

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

          {canUpdateApplication && (
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <Edit className="ml-2 h-4 w-4" />
              <span>{tP("updateTitle")}</span>
            </DropdownMenuItem>
          )}

          {canViewApplication && (
            <DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>
              <EyeIcon className="ml-2 h-4 w-4" />
              <span>{tP("detailsTitle")}</span>
            </DropdownMenuItem>
          )}

          {canUpdateApplication && (
            <DropdownMenuItem
              onSelect={() => setIsContractGenerationOpen(true)}
            >
              <FileText className="ml-2 h-4 w-4" />
              <span>{tP("contractGenerationForm.title")}</span>
            </DropdownMenuItem>
          )}

          {canViewApplication && (
            <DropdownMenuItem onSelect={() => setIsContractsOpen(true)}>
              <FileStack className="ml-2 h-4 w-4" />
              <span>{tP("contracts.title")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canUpdateApplication && (
        <ResponsiveModal
          trigger={null}
          title={tP("updateTitle")}
          tooltipContent={tP("updateTitle")}
          description={tP("updateDescription")}
          maxWidth="lg"
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <ApplicationStatusForm
            data={data}
            onSuccess={() => {
              setIsEditOpen(false);
              data.onUpdated?.();
              queryClient.invalidateQueries({
                queryKey: [APPLICATIONS_TABLE_QUERY_KEY],
              });
            }}
          />
        </ResponsiveModal>
      )}

      {canViewApplication && (
        <ResponsiveModal
          trigger={null}
          title={tP("detailsTitle")}
          tooltipContent={tP("detailsTitle")}
          maxWidth="2xl"
          height="auto"
          open={isDetailsOpen}
          onOpenChange={handleDetailsOpenChange}
        >
          <ApplicationDetails data={data} />
        </ResponsiveModal>
      )}

      {canUpdateApplication && (
        <ResponsiveModal
          trigger={null}
          title={tP("contractGenerationForm.title")}
          tooltipContent={tP("contractGenerationForm.title")}
          description={tP("contractGenerationForm.description")}
          maxWidth="lg"
          height="auto"
          open={isContractGenerationOpen}
          onOpenChange={setIsContractGenerationOpen}
        >
          <ContractGenerationForm
            data={data}
            onSuccess={() => {
              setIsContractGenerationOpen(false);
              data.onUpdated?.();
              queryClient.invalidateQueries({
                queryKey: [APPLICATIONS_TABLE_QUERY_KEY],
              });
            }}
          />
        </ResponsiveModal>
      )}

      {canViewApplication && (
        <ResponsiveModal
          trigger={null}
          title={tP("contracts.title")}
          tooltipContent={tP("contracts.title")}
          description={tP("contracts.description")}
          maxWidth="2xl"
          height="80vh"
          open={isContractsOpen}
          onOpenChange={setIsContractsOpen}
        >
          <ApplicationContracts
            applicationId={data.id}
            enabled={isContractsOpen}
          />
        </ResponsiveModal>
      )}
    </div>
  );
};

export default ApplicationsTableActions;
