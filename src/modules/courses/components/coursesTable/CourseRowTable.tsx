"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { Edit, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useDeleteCourse from "../../hooks/useDeleteCourse";
import useUpdateCourseStatus from "../../hooks/useUpdateCourseStatus";
import { ICourse } from "../../types/course";
import AddEditCourseForm from "./AddEditCourseForm";
import CourseCurriculumModal from "./CourseCurriculumModal";
import useAuth from "@/modules/auth/store/authStore";

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
  const { mutate: remove, isPending } = useDeleteCourse();
  const updateStatusMutation = useUpdateCourseStatus();
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const user = useAuth((state) => state.user?.role);
  const isInstructor = user === "student";

  const statusOptions = ["draft", "published", "pending_review", "rejected"];

  const getStatusLabel = (status: string) => {
    const key = status?.replace(/\s+/g, "_") || "draft";
    return t(`statuses.${key}`) || status;
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

              {!isInstructor && (
                <DropdownMenuItem onSelect={() => setStatusOpen(true)}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  {t("actions.updateStatus")}
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onSelect={() => setOpen(true)}>
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
                  isLoading={isPending}
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

      <ResponsiveModal
        trigger={null}
        title={t("actions.updateStatus")}
        open={statusOpen}
        onOpenChange={setStatusOpen}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                type="button"
                variant={data.status === status ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  if (status === "rejected") {
                    const reasonValue = window.prompt(
                      t("status.reasonPrompt") ||
                        "Please provide the rejection reason:",
                    );

                    if (reasonValue === null) return;

                    updateStatusMutation.mutate(
                      { id: data.id, status, reason: reasonValue },
                      { onSuccess: () => setStatusOpen(false) },
                    );
                    return;
                  }

                  updateStatusMutation.mutate(
                    { id: data.id, status },
                    { onSuccess: () => setStatusOpen(false) },
                  );
                }}
              >
                {getStatusLabel(status)}
              </Button>
            ))}
          </div>
        </div>
      </ResponsiveModal>

      <ResponsiveModal
        trigger={null}
        title={t("actions.edit")}
        open={open}
        onOpenChange={setOpen}
        maxWidth="md"
      >
        <AddEditCourseForm course={data} onSuccess={() => setOpen(false)} />
      </ResponsiveModal>
    </>
  );
}
