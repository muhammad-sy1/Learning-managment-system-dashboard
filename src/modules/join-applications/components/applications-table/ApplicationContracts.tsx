"use client";

import { AreYouSure } from "@/components/AreYouSure";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { formatUtcToLocal } from "@/utils/formatDate";
import { Eye, FileText, FileType, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import useCancelApplicationContract from "../../hooks/useCancelApplicationContract";
import { useGetApplicationContracts } from "../../hooks/useGetApplicationContracts";
import {
  IApplicationContract,
  TApplicationContractStatus,
} from "../../types/applications";
import { Textarea } from "@/components/ui/textarea";
import useSendMessage from "../../hooks/useSendMessage";

const STATUS_VARIANTS: Record<
  TApplicationContractStatus,
  "approved" | "canceled" | "processing"
> = {
  signed: "approved",
  canceled: "canceled",
  waiting_signing: "processing",
};

function getPdfUrl(path: string | null) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;

  const storageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  if (storageUrl) {
    return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  return `/storage/${path.replace(/^\//, "")}`;
}

export default function ApplicationContracts({
  applicationId,
  enabled = true,
}: {
  applicationId: number | string;
  enabled?: boolean;
}) {
  const t = useTranslations("Dashboard.applicationsPage.contracts");
  const [selectedHtmlContract, setSelectedHtmlContract] =
    useState<IApplicationContract | null>(null);
  const [selectedPdfContract, setSelectedPdfContract] =
    useState<IApplicationContract | null>(null);
  const { data, isLoading, isError, refetch } = useGetApplicationContracts({
    id: applicationId,
    enabled,
  });

  const { mutate, isPending } = useCancelApplicationContract();

  const contracts = useMemo(() => data ?? [], [data]);

  const { mutate: mutateMessage, isPending: isPendingMessage } =
    useSendMessage();

  const handleCancel = (contractId: number) => {
    mutate(
      { id: contractId },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-40 w-[min(1100px,82vw)] max-w-full items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[min(1100px,82vw)] max-w-full rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
        {t("loadError")}
      </div>
    );
  }

  if (!contracts.length) {
    return (
      <div className="w-[min(1100px,82vw)] max-w-full rounded-xl border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  const handleSend = (contractId: number) => {
    mutateMessage({ id: contractId });
  };

  return (
    <div className="w-[min(1100px,82vw)] max-w-full space-y-4">
      {contracts.map((contract) => (
        <div
          key={contract.id}
          className="w-full rounded-xl border bg-card p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {contract.slug || t("untitled")}
                </h3>
                <Badge variant={STATUS_VARIANTS[contract.status]}>
                  {t(`statuses.${contract.status}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("fields.id")}: {contract.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedHtmlContract(contract)}
                disabled={!contract.html}
              >
                <FileText className="h-4 w-4" />
                {t("viewHtml")}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedPdfContract(contract)}
                disabled={!contract.pdf_path}
              >
                <FileType className="h-4 w-4" />
                {t("viewPdf")}
              </Button>

              {contract.status !== "canceled" && (
                <AreYouSure
                  title={t("cancelTitle")}
                  description={t("cancelDescription")}
                  isLoading={isPending}
                  onAccept={() => handleCancel(contract.id)}
                  TriggerButton={
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("cancelContract")}
                    </Button>
                  }
                />
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ContractInfoItem label={t("fields.slug")} value={contract.slug} />
            <ContractInfoItem label={t("fields.type")} value={contract.type} />
            <ContractInfoItem
              label={t("fields.pdfPath")}
              value={contract.pdf_path}
              className="md:col-span-2"
            />
            <ContractInfoItem
              label={t("fields.generatedAt")}
              value={formatUtcToLocal(contract.generated_at)}
            />
            <ContractInfoItem
              label={t("fields.acceptedAt")}
              value={formatUtcToLocal(contract.accepted_at)}
            />
            <ContractInfoItem
              label={t("fields.generatedBy")}
              value={contract.generated_by ?? "-"}
            />
            <div className="flex flex-col gap-3 items-center justify-between rounded-lg border bg-muted/30 p-3 col-span-2">
              <Textarea className="max-h-fit">{contract.message}</Textarea>
              <Button
                type="button"
                onClick={() => handleSend(contract.id)}
                disabled={isPendingMessage}
              >
                إرسال إلى واتساب
                {isPendingMessage && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <ResponsiveModal
        trigger={null}
        title={t("htmlTitle")}
        tooltipContent={t("htmlTitle")}
        maxWidth="2xl"
        height="80vh"
        open={!!selectedHtmlContract}
        onOpenChange={(open) => {
          if (!open) setSelectedHtmlContract(null);
        }}
      >
        <iframe
          title={selectedHtmlContract?.slug || t("htmlTitle")}
          srcDoc={selectedHtmlContract?.html || ""}
          sandbox=""
          className="h-[70vh] w-full rounded-lg border bg-white"
        />
      </ResponsiveModal>

      <ResponsiveModal
        trigger={null}
        title={t("pdfTitle")}
        tooltipContent={t("pdfTitle")}
        maxWidth="2xl"
        height="80vh"
        open={!!selectedPdfContract}
        onOpenChange={(open) => {
          if (!open) setSelectedPdfContract(null);
        }}
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm">
              <a
                href={getPdfUrl(selectedPdfContract?.pdf_path ?? null)}
                target="_blank"
                rel="noreferrer"
              >
                <Eye className="h-4 w-4" />
                {t("openPdf")}
              </a>
            </Button>
          </div>
          <iframe
            title={selectedPdfContract?.slug || t("pdfTitle")}
            src={getPdfUrl(selectedPdfContract?.pdf_path ?? null)}
            className="h-[70vh] w-full rounded-lg border"
          />
        </div>
      </ResponsiveModal>
    </div>
  );
}

function ContractInfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | number | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border bg-muted/30 p-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="break-all text-sm font-medium text-foreground">
        {value || "-"}
      </span>
    </div>
  );
}
