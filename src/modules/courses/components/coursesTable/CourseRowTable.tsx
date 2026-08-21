"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Edit, Loader2, MoreHorizontal, PencilLine, Send, Trash2 } from "lucide-react";
import useAuth from "@/modules/auth/store/authStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import useDeleteCourse from "../../hooks/useDeleteCourse";
import useSubmitCourse from "../../hooks/useSubmitCourse";
import useUpdateCourseStatus from "../../hooks/useUpdateCourseStatus";
import { ICourse } from "../../types/course";
import AddEditCourseForm from "./AddEditCourseForm";
import CourseCurriculumModal from "./CourseCurriculumModal";

const COURSE_STATUS_VARIANTS: Record<
  string,
  | "default"
  | "secondary"
  | "approved"
  | "rejected"
  | "processing"
  | "pending"
  | "outline"
> = {
  draft: "secondary",
  published: "approved",
  pending_review: "pending",
  rejected: "rejected",
};

export default function CourseRowTable({ data }: { data: ICourse }) {
  const t = useTranslations("Dashboard.CoursesPage");
  const { mutate: remove, isPending: isDeleting } = useDeleteCourse();
  const updateStatusMutation = useUpdateCourseStatus();
  const submitMutation = useSubmitCourse();

  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  const user = useAuth((state) => state.user?.role);
  const isInstructor = user === "student";

  const canSubmit =
    isInstructor &&
    (data.status === "draft" || data.status === "rejected");

  const statusOptions = ["published", "rejected"] as const;

  const getStatusLabel = (status: string) => {
    const key = status?.replace(/\s+/g, "_") || "draft";
    return t(`statuses.${key}`) || status;
  };

  const handleSubmit = () => {
    submitMutation.mutate(data.id, {
      onSuccess: (res: any) => {
        const msg = res?.message || t("actions.submitSuccess");
        toast.success(msg);
        setSubmitOpen(false);
      },
      onError: (err: any) => {
        const msg = err?.message || t("actions.submitError");
        toast.error(msg);
      },
    });
  };

  return (
    <>
      <TableCell className="py-4 px-4">{data.id}</TableCell>
      <TableCell className="py-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <CourseCurriculumModal course={data} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t("actions.actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Admin only: update status */}
              {!isInstructor && (
                <DropdownMenuItem onSelect={() => setStatusOpen(true)}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  {t("actions.updateStatus")}
                </DropdownMenuItem>
              )}

              {/* Instructor only: submit for review */}
              {canSubmit && (
                <>
                  <DropdownMenuItem onSelect={() => setSubmitOpen(true)}>
                    <Send className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-primary">{t("actions.submitForReview")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("actions.edit")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="p-0"
              >
                <AreYouSureDeleteing
                  TriggerButton={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-2 py-1.5 text-sm text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("actions.delete")}
                    </Button>
                  }
                  title={t("deleteConfirmTitle")}
                  description={t("deleteConfirmDescription")}
                  onAccept={() => remove(data.id)}
                  isLoading={isDeleting}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>

      <TableCell className="py-4 px-4">{data.title}</TableCell>
      <TableCell className="py-4 px-4">
        <Badge variant={COURSE_STATUS_VARIANTS[data.status] ?? "default"}>
          {getStatusLabel(data.status)}
        </Badge>
      </TableCell>
      <TableCell className="py-4 px-4">{data.level}</TableCell>
      <TableCell className="py-4 px-4">
        {data.is_free ? t("free") : data.price}
      </TableCell>
      <TableCell className="py-4 px-4">{data.reviews_count ?? 0}</TableCell>
      <TableCell className="py-4 px-4">{data.total_duration ?? 0}</TableCell>
      <TableCell className="py-4 px-4">{data.total_earnings ?? 0}</TableCell>
      <TableCell className="py-4 px-4">{data.total_lessons ?? 0}</TableCell>
      <TableCell className="py-4 px-4">{data.active_students ?? 0}</TableCell>
      <TableCell className="py-4 px-4">{data.average_rating ?? 0}</TableCell>
      <TableCell className="py-4 px-4">{data.created_at}</TableCell>

      {/* ── Submit for review dialog ── */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">
              {t("actions.submitConfirmTitle")}
            </DialogTitle>
            <DialogDescription className="text-center leading-relaxed">
              {t("actions.submitConfirmDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            <p className="font-medium">{data.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {getStatusLabel(data.status)}
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSubmitOpen(false)}
              disabled={submitMutation.isPending}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="gap-2"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitMutation.isPending
                ? t("actions.cancel")
                : t("actions.submitForReview")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Update status modal (admin) ── */}
      <ResponsiveModal
        trigger={null}
        title={t("actions.updateStatus")}
        open={statusOpen}
        onOpenChange={setStatusOpen}
        maxWidth="md"
      >
        <div className="space-y-4">
          <RadioGroup
            defaultValue={data.status === "rejected" ? "rejected" : "published"}
            className="space-y-3"
            onValueChange={(status) => {
              if (!statusOptions.includes(status as (typeof statusOptions)[number])) return;
              updateStatusMutation.mutate(
                { id: data.id, status },
                { onSuccess: () => setStatusOpen(false) },
              );
            }}
            disabled={updateStatusMutation.isPending}
          >
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center gap-3 rounded-md border p-3">
                <RadioGroupItem value={status} id={`course-${data.id}-status-${status}`} />
                <Label htmlFor={`course-${data.id}-status-${status}`}>
                  {getStatusLabel(status)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </ResponsiveModal>

      {/* ── Edit modal ── */}
      <ResponsiveModal
        trigger={null}
        title={t("actions.edit")}
        open={editOpen}
        onOpenChange={setEditOpen}
        maxWidth="md"
      >
        <AddEditCourseForm course={data} onSuccess={() => setEditOpen(false)} />
      </ResponsiveModal>
    </>
  );
}
