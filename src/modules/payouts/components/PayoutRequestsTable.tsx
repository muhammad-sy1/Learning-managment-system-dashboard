"use client";

import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
// import { usePermissionStore } from "@/hooks/usePermissionStore";
import { WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useGetInstructorEarnings,
  useGetPayoutRequests,
  useRequestInstructorPayout,
} from "../hooks/usePayouts";
import PayoutRequestRow from "./PayoutRequestRow";
import useAuth from "@/modules/auth/store/authStore";

export default function PayoutRequestsTable() {
  const t = useTranslations("Dashboard.PayoutRequestsPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");
  const user = useAuth((state) => state.user);
  const isInstructor = user?.role === "student";
  const isAdmin = user?.role === "admin";
  const { data, isPending } = useGetPayoutRequests();
  const earningsQuery = useGetInstructorEarnings(isInstructor);
  const requestMutation = useRequestInstructorPayout();

  const summary = earningsQuery.data?.data?.summary;
  const headers = [
    { Icon: <WalletCards className="h-4 w-4" />, label: tHeaders("id") },
    ...(isAdmin
      ? [
          { Icon: <WalletCards className="h-4 w-4" />, label: t("instructor") },
          { Icon: <WalletCards className="h-4 w-4" />, label: t("email") },
        ]
      : []),
    { Icon: <WalletCards className="h-4 w-4" />, label: t("amount") },
    { Icon: <WalletCards className="h-4 w-4" />, label: t("status") },
    { Icon: <WalletCards className="h-4 w-4" />, label: t("createdAt") },
    ...(isAdmin
      ? [
          {
            Icon: <WalletCards className="h-4 w-4" />,
            label: tHeaders("actions"),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {isInstructor && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-background p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("totalPending")}
              </p>
              <p className="text-lg font-semibold">
                {summary?.total_pending ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalPaid")}</p>
              <p className="text-lg font-semibold">
                {summary?.total_paid ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("totalEarned")}
              </p>
              <p className="text-lg font-semibold">
                {summary?.total_earned ?? "-"}
              </p>
            </div>
          </div>
          <Button
            variant="premium"
            disabled={requestMutation.isPending}
            onClick={() => requestMutation.mutate()}
          >
            {t("requestPayout")}
          </Button>
        </div>
      )}

      <ReusableTable
        titleIcon={<WalletCards className="h-5 w-5 text-primary" />}
        title={t("title")}
        description={t("description")}
        headers={headers}
        data={data?.data ?? []}
        isPending={isPending}
        paginationProps={
          data?.data?.length
            ? {
                name: "payout-requests",
                totalItems: data.meta?.total ?? 0,
                totalPages: data.meta?.last_page ?? 1,
              }
            : undefined
        }
        density="md"
        height={64}
        renderRow={(item) => (
          <PayoutRequestRow key={item.id} data={item} isAdmin={isAdmin} />
        )}
      />
    </div>
  );
}
