"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { BookOpen, Clock } from "lucide-react";
import { IInstructorStudentRecord } from "../types";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string | null, fallback: string) {
  if (!dateStr) return fallback;
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function CompletionBadge({ value }: { value: string }) {
  const pct = Math.round(parseFloat(value));
  const color =
    pct >= 80
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
      : pct >= 40
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
        : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
        {pct}%
      </span>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 80 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function InstructorStudentRow({
  data,
  index,
}: {
  data: IInstructorStudentRecord;
  index: number;
}) {
  const t = useTranslations("Dashboard.InstructorStudentsPage");

  return (
    <>
      {/* # */}
      <TableCell className="py-4 px-4 text-muted-foreground text-sm">
        {index + 1}
      </TableCell>

      {/* Student */}
      <TableCell className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={data.student.avatar ?? undefined} alt={data.student.name} />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {getInitials(data.student.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{data.student.name}</span>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="py-4 px-4">
        <span className="text-sm text-muted-foreground">{data.student.email}</span>
      </TableCell>

      {/* Course */}
      <TableCell className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span className="text-sm font-medium">{data.course.title}</span>
        </div>
      </TableCell>

      {/* Completion */}
      <TableCell className="py-4 px-4">
        <CompletionBadge value={data.completion_percentage} />
      </TableCell>

      {/* Enrolled At */}
      <TableCell className="py-4 px-4">
        <span className="text-sm text-muted-foreground">
          {formatDate(data.enrolled_at, t("notAvailable"))}
        </span>
      </TableCell>

      {/* Last Accessed */}
      <TableCell className="py-4 px-4">
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {data.last_accessed_at
            ? formatDate(data.last_accessed_at, t("notAvailable"))
            : <span className="italic">{t("neverAccessed")}</span>}
        </div>
      </TableCell>
    </>
  );
}
