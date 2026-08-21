"use client";

import ReusableTable from "@/components/reusable-table/ReusableTable";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Hash,
  Mail,
  Target,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetInstructorStudents } from "../hooks/useGetInstructorStudents";
import InstructorStudentRow from "./InstructorStudentRow";

export default function InstructorStudentsTable() {
  const t = useTranslations("Dashboard.InstructorStudentsPage");
  const { data: resp, isPending } = useGetInstructorStudents();

  const rows = resp?.data ?? [];
  const meta = (resp as any)?.meta;

  const HEADERS = [
    { Icon: <Hash className="h-3.5 w-3.5" />, label: t("headers.id") },
    { Icon: <User className="h-3.5 w-3.5" />, label: t("headers.student") },
    { Icon: <Mail className="h-3.5 w-3.5" />, label: t("headers.email") },
    { Icon: <BookOpen className="h-3.5 w-3.5" />, label: t("headers.course") },
    { Icon: <Target className="h-3.5 w-3.5" />, label: t("headers.completion") },
    { Icon: <Calendar className="h-3.5 w-3.5" />, label: t("headers.enrolledAt") },
    { Icon: <Clock className="h-3.5 w-3.5" />, label: t("headers.lastAccessed") },
  ];

  return (
    <ReusableTable
      title={t("title")}
      description={t("description")}
      titleIcon={<GraduationCap className="h-5 w-5 text-primary" />}
      headers={HEADERS}
      data={rows}
      isPending={isPending}
      density="md"
      height={64}
      paginationProps={
        rows.length > 0 && meta
          ? {
              name: "instructor-students",
              totalItems: meta.total ?? 0,
              totalPages: meta.last_page ?? 1,
            }
          : undefined
      }
      renderRow={(record, index) => (
        <InstructorStudentRow
          key={`${record.student.id}-${record.course.id}`}
          data={record}
          index={index}
        />
      )}
    />
  );
}
