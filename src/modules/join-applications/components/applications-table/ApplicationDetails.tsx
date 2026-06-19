"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { RowItem } from "@/components/RowItem";
import { Badge } from "@/components/ui/badge";
import { formatUtcToLocal } from "@/utils/formatDate";
import {
  Building2,
  CalendarClock,
  ClipboardList,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  IApplications,
  TApplicationBusinessType,
  TApplicationReason,
  TApplicationStatus,
} from "../../types/applications";

const STATUS_VARIANTS: Record<
  TApplicationStatus,
  "default" | "secondary" | "approved" | "rejected"
> = {
  approved: "approved",
  rejected: "rejected",
  submitted: "default",
  under_review: "secondary",
};

export default function ApplicationDetails({ data }: { data: IApplications }) {
  const t = useTranslations("Dashboard.applicationsPage");
  const applicationStatusT = useTranslations(
    "Dashboard.applicationsPage.statuses",
  );
  const applicationTypeT = useTranslations("Dashboard.applicationsPage.types");

  const fullName = `${data.user?.first_name ?? ""} ${
    data.user?.last_name ?? ""
  }`.trim();

  const getReasonLabel = (reason: TApplicationReason | null) => {
    if (!reason) return "-";

    const reasonLabels: Record<TApplicationReason, string> = {
      extra_income: t("reasons.extra_income"),
      flexible_hours: t("reasons.flexible_hours"),
      stable_income: t("reasons.stable_income"),
      new_experience: t("reasons.new_experience"),
    };

    return reasonLabels[reason];
  };

  const getBusinessTypeLabel = (businessType: TApplicationBusinessType | null) => {
    if (!businessType) return "-";

    const businessTypeLabels: Record<TApplicationBusinessType, string> = {
      supermarket: t("businessTypes.supermarket"),
      restaurant: t("businessTypes.restaurant"),
      electronics: t("businessTypes.electronics"),
      clothing: t("businessTypes.clothing"),
      pharmacy: t("businessTypes.pharmacy"),
      other: t("businessTypes.other"),
    };

    return businessTypeLabels[businessType];
  };

  const getStatusLabel = (status: TApplicationStatus) => {
    const statusLabels: Record<TApplicationStatus, string> = {
      approved: applicationStatusT("approved"),
      rejected: applicationStatusT("rejected"),
      submitted: applicationStatusT("submitted"),
      under_review: applicationStatusT("under_review"),
    };

    return statusLabels[status];
  };

  const zoneLabel =
    data.type === "partner"
      ? t("details.fields.storeZone")
      : t("details.fields.deliveryZone");

  return (
    <div className="space-y-4">
      <ReusableCard
        icon={<ClipboardList className="h-5 w-5" />}
        title={t("details.sections.summary")}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RowItem label={t("details.fields.id")} value={data.id} />
          <RowItem
            label={t("details.fields.requestKey")}
            value={data.request_key}
          />
          <RowItem
            label={t("details.fields.applicationType")}
            value={applicationTypeT(data.type)}
          />
          <div className="flex items-center justify-between rounded-xl border bg-gradient-to-r from-secondary/30 to-muted/30 p-3">
            <span className="font-semibold text-foreground">
              {t("details.fields.applicationStatus")}
            </span>
            <Badge variant={STATUS_VARIANTS[data.status]}>
              {getStatusLabel(data.status)}
            </Badge>
          </div>
          <RowItem label={zoneLabel} value={data.zone?.name || "-"} />
        </div>
      </ReusableCard>

      <ReusableCard
        icon={<UserRound className="h-5 w-5" />}
        title={t("details.sections.applicant")}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RowItem label={t("details.fields.userId")} value={data.user?.id} />
          <RowItem
            label={t("details.fields.applicantName")}
            value={fullName || "-"}
          />
          <RowItem
            icon={<Phone className="h-4 w-4" />}
            label={t("details.fields.phone")}
            value={data.user?.phone_number_e164 || "-"}
          />
          <RowItem
            label={t("details.fields.contactName")}
            value={data.contact_name || "-"}
          />
        </div>
      </ReusableCard>

      <ReusableCard
        icon={<Building2 className="h-5 w-5" />}
        title={t("details.sections.application")}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RowItem
            label={t("details.fields.storeName")}
            value={data.store_name || "-"}
          />
          <RowItem
            label={t("details.fields.businessType")}
            value={getBusinessTypeLabel(data.business_type_key)}
          />
          <RowItem
            label={t("details.fields.applicationReason")}
            value={getReasonLabel(data.reason_key)}
          />
          <RowItem
            icon={<MapPin className="h-4 w-4" />}
            label={zoneLabel}
            value={data.zone?.name || "-"}
          />
        </div>

        <NoteBlock
          label={t("details.fields.note")}
          value={data.note}
          className="mt-4"
        />
      </ReusableCard>

      <ReusableCard
        icon={<ShieldCheck className="h-5 w-5" />}
        title={t("details.sections.review")}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RowItem
            label={t("details.fields.reviewedBy")}
            value={data.reviewed_by ?? "-"}
          />
          <RowItem
            label={t("details.fields.reviewedAt")}
            value={formatUtcToLocal(data.reviewed_at)}
          />
          <RowItem
            icon={<CalendarClock className="h-4 w-4" />}
            label={t("details.fields.createdAt")}
            value={formatUtcToLocal(data.created_at)}
          />
          <RowItem
            icon={<CalendarClock className="h-4 w-4" />}
            label={t("details.fields.updatedAt")}
            value={formatUtcToLocal(data.updated_at)}
          />
        </div>

        <NoteBlock
          label={t("details.fields.reviewNote")}
          value={data.review_note}
          className="mt-4"
        />
      </ReusableCard>
    </div>
  );
}

function NoteBlock({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-card/50 p-4 ${className}`}>
      <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <span>{label}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {value || "-"}
      </p>
    </div>
  );
}
