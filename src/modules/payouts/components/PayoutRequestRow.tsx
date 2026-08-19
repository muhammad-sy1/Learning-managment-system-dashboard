"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { IPayoutRequest, PayoutStatus } from "../types/payout";
import { useProcessAdminPayout } from "../hooks/usePayouts";
import { TableCell } from "@/components/ui/table";

const STATUS_VARIANTS: Record<
  PayoutStatus,
  "pending" | "approved" | "rejected"
> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
};

interface PayoutRequestRowProps {
  data: IPayoutRequest;
  isAdmin: boolean;
}

export default function PayoutRequestRow({
  data,
  isAdmin,
}: PayoutRequestRowProps) {
  const t = useTranslations("Dashboard.PayoutRequestsPage");
  const processMutation = useProcessAdminPayout();

  const process = (status: "approved" | "rejected") => {
    let rejectionReason: string | undefined;

    if (status === "rejected") {
      rejectionReason = window.prompt(t("rejectionReasonPrompt")) ?? undefined;
      if (!rejectionReason?.trim()) return;
    }

    processMutation.mutate({
      payout_id: data.id,
      status,
      ...(rejectionReason ? { rejection_reason: rejectionReason } : {}),
    });
  };

  return (
    <>
      <TableCell className="px-4 py-4">{data.id}</TableCell>
      {isAdmin && (
        <>
          <TableCell className="px-4 py-4">
            {data.instructor?.name ?? t("unknownInstructor")}
          </TableCell>
          <TableCell className="px-4 py-4">
            {data.instructor?.email ?? "-"}
          </TableCell>
        </>
      )}
      <TableCell className="px-4 py-4">{data.amount}</TableCell>
      <TableCell className="px-4 py-4">
        <Badge variant={STATUS_VARIANTS[data.status]}>
          {t(`statuses.${data.status}`)}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-4">{data.created_at}</TableCell>
      {isAdmin && (
        <TableCell className="px-4 py-4">
          {data.status === "pending" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t("actions.title")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => process("approved")}>
                  <Check className="mr-2 h-4 w-4" />
                  {t("actions.approve")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => process("rejected")}>
                  <X className="mr-2 h-4 w-4" />
                  {t("actions.reject")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            "-"
          )}
        </TableCell>
      )}
    </>
  );
}
