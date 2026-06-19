"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  IdCard,
  Map,
  MapPin,
  Settings,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetZones } from "../../hooks/useGetZones";
import AddZoneForm from "./AddZoneForm";
import ZonesRowTable from "./ZonesRowTable";
import { usePermissionStore } from "@/hooks/usePermissionStore";

function ZonesTable() {
  const [addZoneModalOpen, setAddZoneModalOpen] = useState(false);
  const { data: zones, isPending } = useGetZones();
  const t = useTranslations("Dashboard.ZonePage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");
  const { canCreate } = usePermissionStore();

  console.log("zones", zones);

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
    {
      Icon: <IdCard className="h-4 w-4" />,
      label: tHeaders("id"),
    },
    {
      Icon: <Settings className="h-4 w-4" />,
      label: tHeaders("actions"),
    },
    {
      Icon: <MapPin className="h-4 w-4" />,
      label: tHeaders("name"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("createdAt"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Map className="h-5 w-5 text-primary" />}
          description={t("description")}
          title={t("title")}
          headers={TABLE_HEADERS}
          data={zones?.data || []}
          isPending={isPending}
          caption={t("tableCaption")}
          actionButton={
            <ResponsiveModal
              trigger={
                canCreate("zones") ? (
                  <Button variant={"premium"}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>{t("createNewZone")}</span>
                  </Button>
                ) : null
              }
              title={t("createNewZone")}
              description={t("createZoneDescription")}
              open={addZoneModalOpen}
              onOpenChange={setAddZoneModalOpen}
              maxWidth="xl"
              height="auto"
            >
              <AddZoneForm onSuccess={() => setAddZoneModalOpen(false)} />
            </ResponsiveModal>
          }
          paginationProps={
            zones?.data?.length
              ? {
                  name: "zones",
                  totalItems: zones?.total || 0,
                  totalPages: zones?.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          className=""
          renderRow={(zone) => <ZonesRowTable key={zone.id} data={zone} />}
        />
      </div>
    </div>
  );
}

export default ZonesTable;
