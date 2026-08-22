"use client";

import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  IdCard,
  Loader2,
  Mail,
  Settings,
  Text,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import {
  useApproveInstructor,
  useGetInstructorRequests,
  useRejectInstructor,
} from "../../hooks/useInstructorRequests";
import { IInstructorRequest } from "../../services/instructorRequests";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Review Dialog ────────────────────────────────────────────────────────────

function ReviewDialog({
  request,
  open,
  onClose,
}: {
  request: IInstructorRequest;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.InstructorRequestsPage");
  const approveMutation = useApproveInstructor();
  const rejectMutation = useRejectInstructor();

  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const handleClose = () => {
    if (isPending) return;
    setAction(null);
    setReason("");
    onClose();
  };

  const handleSend = () => {
    if (action === "approve") {
      approveMutation.mutate(request.user_id, {
        onSuccess: (res: any) => {
          toast.success(res?.message || t("approveSuccess"));
          handleClose();
        },
        onError: (err: any) => {
          toast.error(err?.message || t("approveError"));
        },
      });
    } else if (action === "reject") {
      if (!reason.trim()) {
        toast.error(t("rejectReasonRequired"));
        return;
      }
      rejectMutation.mutate(
        { id: request.user_id, reason: reason.trim() },
        {
          onSuccess: (res: any) => {
            toast.success(res?.message || t("rejectSuccess"));
            handleClose();
          },
          onError: (err: any) => {
            toast.error(err?.message || t("rejectError"));
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <UserCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{t("dialogTitle")}</DialogTitle>
          <DialogDescription className="text-center">
            {t("dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Applicant summary */}
        <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                {getInitials(request.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-tight">{request.name}</p>
              <p className="text-xs text-muted-foreground">{request.email}</p>
            </div>
          </div>
          {request.title && (
            <p className="text-xs text-muted-foreground pt-1">{request.title}</p>
          )}
        </div>

        {/* Action selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setAction("approve")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors cursor-pointer",
              action === "approve"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-border hover:bg-muted/50",
            )}
          >
            <CheckCircle2
              className={cn(
                "h-6 w-6",
                action === "approve"
                  ? "text-emerald-600"
                  : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                action === "approve"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "",
              )}
            >
              {t("approve")}
            </span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => setAction("reject")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors cursor-pointer",
              action === "reject"
                ? "border-destructive bg-destructive/5"
                : "border-border hover:bg-muted/50",
            )}
          >
            <XCircle
              className={cn(
                "h-6 w-6",
                action === "reject" ? "text-destructive" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                action === "reject" ? "text-destructive" : "",
              )}
            >
              {t("reject")}
            </span>
          </button>
        </div>

        {/* Rejection reason — slides in when reject is picked */}
        {action === "reject" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">{t("rejectReasonLabel")}</Label>
            <Textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("rejectReasonPlaceholder")}
              className="resize-none"
              disabled={isPending}
            />
          </div>
        )}

        {/* Send button */}
        <Button
          className={cn(
            "w-full gap-2",
            action === "reject" && "variant-destructive",
          )}
          variant={action === "reject" ? "destructive" : "default"}
          disabled={!action || isPending}
          onClick={handleSend}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : action === "approve" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : action === "reject" ? (
            <XCircle className="h-4 w-4" />
          ) : null}
          {isPending ? t("saving") : t("sendBtn")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function InstructorRequestRow({
  data,
  index,
}: {
  data: IInstructorRequest;
  index: number;
}) {
  const t = useTranslations("Dashboard.InstructorRequestsPage");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {/* # */}
      <TableCell className="py-3 px-4 text-sm text-muted-foreground">
        {index + 1}
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3 px-4">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => setDialogOpen(true)}
        >
          <ClipboardList className="h-3.5 w-3.5" />
          {t("reviewAction")}
        </Button>
      </TableCell>

      {/* Name */}
      <TableCell className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 border shrink-0">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {getInitials(data.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{data.name}</span>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="py-3 px-4 text-sm text-muted-foreground">
        {data.email}
      </TableCell>

      {/* Title */}
      <TableCell className="py-3 px-4">
        {data.title ? (
          <Badge variant="secondary" className="text-xs font-normal">
            {data.title}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Bio */}
      <TableCell className="py-3 px-4">
        <p className="max-w-xs truncate text-sm text-muted-foreground" title={data.bio}>
          {data.bio || "—"}
        </p>
      </TableCell>

      {/* Applied At */}
      <TableCell className="py-3 px-4 text-sm text-muted-foreground">
        {formatDate(data.applied_at)}
      </TableCell>

      <ReviewDialog
        request={data}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

export default function InstructorRequestsTable({
  enabled,
}: {
  enabled: boolean;
}) {
  const t = useTranslations("Dashboard.InstructorRequestsPage");
  const { data: resp, isPending } = useGetInstructorRequests(enabled);

  const rows =
    (resp as { data?: IInstructorRequest[] } | null)?.data ?? [];

  const HEADERS = [
    { Icon: <IdCard className="h-3.5 w-3.5" />, label: t("headers.id") },
    { Icon: <Settings className="h-3.5 w-3.5" />, label: t("headers.actions") },
    { Icon: <UserCheck className="h-3.5 w-3.5" />, label: t("headers.name") },
    { Icon: <Mail className="h-3.5 w-3.5" />, label: t("headers.email") },
    { Icon: <Text className="h-3.5 w-3.5" />, label: t("headers.title") },
    { Icon: <ClipboardList className="h-3.5 w-3.5" />, label: t("headers.bio") },
    { Icon: <Calendar className="h-3.5 w-3.5" />, label: t("headers.appliedAt") },
  ];

  return (
    <ReusableTable
      titleIcon={<UserCheck className="h-5 w-5 text-primary" />}
      title={t("title")}
      description={t("description")}
      headers={HEADERS}
      data={rows}
      isPending={isPending}
      density="md"
      height={64}
      renderRow={(record, index) => (
        <InstructorRequestRow
          key={record.user_id}
          data={record}
          index={index}
        />
      )}
    />
  );
}
