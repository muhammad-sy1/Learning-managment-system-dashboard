"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import { useGetCourses } from "../../hooks/useGetCourses";
// import AddEditCourseForm from "./AddEditCourseForm";
// import CourseRowTable from "./CourseRowTable";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import AddEditCourseForm from "./AddEditCourseForm";
import CourseRowTable from "./CourseRowTable";

export default function CoursesTable() {
  const t = useTranslations("Dashboard.CoursesPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");
  const { data: coursesResp, isPending } = useGetCourses();
  const [open, setOpen] = useState(false);

  const TABLE_HEADERS = [
    { Icon: <></>, label: tHeaders("id") },
    { Icon: <></>, label: tHeaders("actions") },
    { Icon: <></>, label: tHeaders("title") },
    { Icon: <></>, label: tHeaders("status") },
    { Icon: <></>, label: tHeaders("level") },
    { Icon: <></>, label: tHeaders("price") },
    { Icon: <></>, label: tHeaders("reviewsCount") },
    { Icon: <></>, label: tHeaders("totalDuration") },
    { Icon: <></>, label: tHeaders("totalEarnings") },
    { Icon: <></>, label: tHeaders("totalLessons") },
    { Icon: <></>, label: tHeaders("activeStudents") },
    { Icon: <></>, label: tHeaders("averageRating") },
    { Icon: <></>, label: tHeaders("createdAt") },
  ];

  return (
    <div className="space-y-6">
      <ReusableTable
        title={t("title")}
        description={t("description")}
        headers={TABLE_HEADERS}
        data={coursesResp?.data || []}
        isPending={isPending}
        actionButton={
          <ResponsiveModal
            trigger={
              <Button variant="premium">
                <Plus className="mr-2 h-4 w-4" />
                <span>{t("createNew")}</span>
              </Button>
            }
            title={t("createNew")}
            open={open}
            onOpenChange={setOpen}
            maxWidth="md"
          >
            <AddEditCourseForm onSuccess={() => setOpen(false)} />
          </ResponsiveModal>
        }
        paginationProps={
          coursesResp?.data?.length
            ? {
                name: "courses",
                totalItems: coursesResp?.meta?.total || 0,
                totalPages: coursesResp?.meta?.last_page || 1,
              }
            : undefined
        }
        density="md"
        height={64}
        renderRow={(c) => <CourseRowTable key={c.id} data={c} />}
      />
    </div>
  );
}
