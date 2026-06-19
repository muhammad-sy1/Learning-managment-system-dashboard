"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import { Calendar, Folder, ImageIcon, Settings, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGetFainancials } from "../../hooks/Financials/useGetFainancials";
import AddSectionForm from "./AddFinancialForm";
import SectionRowTable from "./FinancialRowTable";
import { usePermissionStore } from "@/hooks/usePermissionStore";

function FinancialsTable({ type: propType }: { type: string }) {
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const { canCreate, hasPermission } = usePermissionStore();

  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");
  const type = typeFromUrl || propType;
  const parent_id = searchParams.get("parent_id") ?? undefined;

  const { data: sections, isPending } = useGetFainancials({ type, parent_id });

  const t = useTranslations("Dashboard.FinancialSectionPage");
  const tsubsections = useTranslations("Dashboard.FinancialSubSectionPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const sectionConfig: Record<
    string,
    {
      title: string;
      createLabel: string;
      description: string;
      caption: string;
      permission: string;
    }
  > = {
    FINANCIAL_MAIN_SECTIONS: {
      title: t("title"),
      createLabel: t("createNewSection"),
      description: t("createSectionDescription"),
      caption: t("tableCaption"),
      permission: "fainance",
    },
    FINANCIAL_SUB_SECTIONS: {
      title: tsubsections("title"),
      createLabel: tsubsections("createNewSubSection"),
      description: tsubsections("createSubSectionDescription"),
      caption: tsubsections("tableCaption"),
      permission: "sub-finance",
    },
  };

  const config = type ? sectionConfig[type] : undefined;

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("name") },
    { Icon: <ImageIcon className="h-4 w-4" />, label: tHeaders("image") },
    // { Icon: <Folder className="h-4 w-4" />, label: tHeaders("subsections") },
    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("createdAt") },
    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("updatedAt") },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Folder className="h-5 w-5 text-primary" />}
          title={config?.title}
          description={config?.description}
          actionButton={
            <ResponsiveModal
              trigger={
                canCreate(config?.permission ?? "") ? (
                  <Button variant="premium">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>{config?.createLabel}</span>
                  </Button>
                ) : null
              }
              title={config?.createLabel}
              description={config?.description}
              open={addSectionModalOpen}
              onOpenChange={setAddSectionModalOpen}
              maxWidth="xl"
              height="auto"
            >
              <AddSectionForm
                onSuccess={() => setAddSectionModalOpen(false)}
                parent_id={parent_id}
                type={type}
              />
            </ResponsiveModal>
          }
          headers={TABLE_HEADERS}
          data={sections?.data.sections.data || []}
          isPending={isPending}
          caption={config?.caption}
          paginationProps={
            sections?.data?.sections?.data?.length
              ? {
                  name: config?.permission ?? "sections",
                  totalItems: sections?.data.sections?.total || 0,
                  totalPages: sections?.data?.sections?.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          renderRow={(section) => (
            <SectionRowTable
              key={section.id}
              data={section}
              sectionType={type}
              parent_section={sections?.data?.parent_section}
              permissionKey={config?.permission ?? ""}
            />
          )}
        />
      </div>
    </div>
  );
}

export default FinancialsTable;
