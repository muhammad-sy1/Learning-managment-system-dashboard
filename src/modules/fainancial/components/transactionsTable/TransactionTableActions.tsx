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
import useDeleteTransaction from "../../hooks/transactions/useDeleteTransaction";
import { ITransaction } from "../../types/transaction";
import EditTransactionForm from "./EditTransactionForm";

interface ITransactionActionsProps {
  transaction: ITransaction;
  permissionKey: string;
}

const TransactionTableActions = ({
  transaction,
  permissionKey,
}: ITransactionActionsProps) => {
  const { mutate } = useDeleteTransaction();
  const { canDelete, canUpdate } = usePermissionStore();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const t = useTranslations("DeleteConfirmation");
  const tUpdate = useTranslations("Dashboard.TransactionsPage");
  const tTable = useTranslations("Dashboard.tableHeaders");

  const canUpdateTransaction = canUpdate(permissionKey);
  const canDeleteTransaction = canDelete(permissionKey);
  const hasActions = canUpdateTransaction || canDeleteTransaction;

  const config = {
    title: tUpdate("updateTransaction"),
    description: tUpdate("updateTransactionDescription"),
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

          {canUpdateTransaction && (
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <Edit className="ml-2 h-4 w-4" />
              <span>{config.title}</span>
            </DropdownMenuItem>
          )}

          {canDeleteTransaction && (
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
                    mutate(transaction.id);
                  }}
                />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canUpdateTransaction && (
        <ResponsiveModal
          trigger={null}
          title={config.title}
          description={config.description}
          maxWidth="lg"
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <EditTransactionForm
            data={transaction}
            onSuccess={() => setIsEditOpen(false)}
          />
        </ResponsiveModal>
      )}
    </div>
  );
};

export default TransactionTableActions;
