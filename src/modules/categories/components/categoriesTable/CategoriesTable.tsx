"use client";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import { Folder, Settings, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetCategories } from "../../hooks/useGetCategories";
import AddCategoryForm from "./AddCategoryForm";
import CategoryRowTable from "./CategoryRowTable";

export default function CategoriesTable() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { data, isPending } = useGetCategories();
  const t = useTranslations("Dashboard.CategoriesPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const TABLE_HEADERS = [
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },
    { Icon: <Folder className="h-4 w-4" />, label: t("name") },
    { Icon: <Folder className="h-4 w-4" />, label: t("studentType") },
    { Icon: <Folder className="h-4 w-4" />, label: t("parentCategory") },
    { Icon: <Folder className="h-4 w-4" />, label: t("status") },
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("createdAt") },
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("updatedAt") },
  ];

  const categories = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <ReusableTable
        titleIcon={<Folder className="h-5 w-5 text-primary" />}
        title={t("title")}
        description={t("description")}
        actionButton={
          <ResponsiveModal
            trigger={
              <Button variant="premium">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>{t("createNewCategory")}</span>
              </Button>
            }
            title={t("createNewCategory")}
            description={t("createCategoryDescription")}
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
            maxWidth="xl"
            height="auto"
          >
            <AddCategoryForm onSuccess={() => setAddModalOpen(false)} />
          </ResponsiveModal>
        }
        headers={TABLE_HEADERS}
        data={categories}
        isPending={isPending}
        caption={t("tableCaption")}
        density="md"
        height={64}
        renderRow={(category) => (
          <CategoryRowTable key={category.id} data={category} />
        )}
      />
    </div>
  );
}
