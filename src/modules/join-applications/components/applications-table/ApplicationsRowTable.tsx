import NavLink from "@/components/NavLink";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { formatUtcToLocal } from "@/utils/formatDate";
import { useTranslations } from "next-intl";
import {
  IApplications,
  TApplicationBusinessType,
  TApplicationReason,
  TApplicationStatus,
  TApplicationType,
} from "../../types/applications";
import ApplicationsTableActions from "./ApplicationsTableActions";

export default function ApplicationsRowTable({
  data,
  applicationType,
}: {
  data: IApplications & { onUpdated?: () => void };
  applicationType?: TApplicationType;
}) {
  const fullName = `${data?.user?.first_name ?? "-"} ${
    data?.user?.last_name ?? ""
  }`.trim();
  const resolvedApplicationType = applicationType ?? data.type;

  const t = useTranslations("Dashboard.applicationsPage");
  const applicationStatusT = useTranslations(
    "Dashboard.applicationsPage.statuses",
  );

  const permissionKey =
    resolvedApplicationType === "partner"
      ? "join-applications-partner"
      : "join-applications-delivery";

  const getStatusText = (status: TApplicationStatus) => {
    switch (status) {
      case "approved":
        return applicationStatusT("approved");
      case "rejected":
        return applicationStatusT("rejected");
      case "submitted":
        return applicationStatusT("submitted");
      case "under_review":
        return applicationStatusT("under_review");
      default:
        return status;
    }
  };

  const getStatusVariant = (
    status: TApplicationStatus,
  ): "default" | "secondary" | "approved" | "rejected" => {
    switch (status) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "under_review":
        return "secondary";
      case "submitted":
      default:
        return "default";
    }
  };

  const applicationReasonLabel: Record<TApplicationReason, string> = {
    extra_income: t("reasons.extra_income"),
    flexible_hours: t("reasons.flexible_hours"),
    stable_income: t("reasons.stable_income"),
    new_experience: t("reasons.new_experience"),
  };

  const applicationBusinessTypeLabel: Record<TApplicationBusinessType, string> =
    {
      supermarket: t("businessTypes.supermarket"),
      restaurant: t("businessTypes.restaurant"),
      electronics: t("businessTypes.electronics"),
      clothing: t("businessTypes.clothing"),
      pharmacy: t("businessTypes.pharmacy"),
      other: t("businessTypes.other"),
    };

  return (
    <>
      <TableCell className="py-3 font-medium">{data.request_key}</TableCell>
      <TableCell className="font-medium ">
        {data.user ? (
          <div className="space-y-1">
            <NavLink
              className="hover:text-blue-500"
              href={`/dashboard/users?role=CLIENT&id=${data.user.id}`}
            >
              {fullName || "-"}
            </NavLink>
            <div className="text-xs text-muted-foreground">
              {data.user.phone_number_e164 || "-"}
            </div>
          </div>
        ) : (
          "-"
        )}
      </TableCell>

      {resolvedApplicationType === "delivery" ? (
        <TableCell>
          {data.reason_key ? applicationReasonLabel[data.reason_key] : "-"}
        </TableCell>
      ) : (
        <TableCell>
          <div className="space-y-1">
            <div className="font-medium">{data.store_name || "-"}</div>
            <div className="text-xs text-muted-foreground">
              {data.contact_name || "-"}
            </div>
          </div>
        </TableCell>
      )}

      <TableCell>
        {resolvedApplicationType === "partner" ? (
          <div className="space-y-1">
            <div>
              {data.business_type_key
                ? applicationBusinessTypeLabel[data.business_type_key]
                : "-"}
            </div>
            <div className="text-xs text-muted-foreground">
              {data?.zone?.name || "-"}
            </div>
          </div>
        ) : (
          data?.zone?.name || "-"
        )}
      </TableCell>

      <TableCell>{formatUtcToLocal(data.created_at)}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(data.status)}>
          {getStatusText(data.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <ApplicationsTableActions {...data} permissionKey={permissionKey} />
      </TableCell>
    </>
  );
}
