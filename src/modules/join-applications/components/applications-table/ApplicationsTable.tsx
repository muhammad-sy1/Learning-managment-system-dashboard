"use client";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import {
  BriefcaseBusiness,
  Calendar,
  FileText,
  Map,
  Settings,
  Store,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetApplications } from "../../hooks/useGetApplications";
import ApplicationsRowTable from "./ApplicationsRowTable";
import { useSearchParams } from "next/navigation";

function ApplicationsTable() {
  const searchParams = useSearchParams();
  const rawApplicationType = searchParams.get("type");
  const applicationType =
    rawApplicationType === "partner" || rawApplicationType === "delivery"
      ? rawApplicationType
      : undefined;
  const { data, isPending, refetch } = useGetApplications();
  const t = useTranslations("Dashboard.applicationsPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
    {
      Icon: <FileText className="h-4 w-4" />,
      label: tHeaders("requestKey"),
    },
    {
      Icon: <User className="h-4 w-4" />,
      label: tHeaders("applierName"),
    },
    {
      Icon: <Store className="h-4 w-4" />,
      label:
        applicationType === "partner"
          ? tHeaders("storeAndContact")
          : tHeaders("applicationReason"),
    },
    {
      Icon: <BriefcaseBusiness className="h-4 w-4" />,
      label:
        applicationType === "partner"
          ? tHeaders("businessTypeAndZone")
          : tHeaders("deliveryZone"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("createdAt"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("applicationStatus"),
    },
    {
      Icon: <Settings className="h-4 w-4" />,
      label: tHeaders("actions"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Map className="h-5 w-5 text-primary" />}
          description={t("description")}
          title={
            applicationType === "partner"
              ? t("partnerApplicationsTitle")
              : t("deliveryApplicationsTitle")
          }
          headers={TABLE_HEADERS}
          data={data?.applications.data || []}
          isPending={isPending}
          actionButton={null}
          paginationProps={
            data?.applications.data.length
              ? {
                  name: "applications",
                  totalItems: data?.applications.total || 0,
                  totalPages: data?.applications.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          className=""
          renderRow={(application) => (
            <ApplicationsRowTable
              key={application.id}
              data={{ ...application, onUpdated: refetch }}
              applicationType={applicationType ?? application.type}
            />
          )}
        />
      </div>
    </div>
  );
}

export default ApplicationsTable;
