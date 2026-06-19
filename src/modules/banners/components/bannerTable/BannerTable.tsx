"use client";

import {
  CalendarDays,
  Clock,
  IdCard,
  Image as ImageIcon,
  Link2,
  Settings,
  Timer,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import { useGetBanners } from "../../hooks/useGetBanners";

import { BannerType } from "../../types/banner";
import AddBannerForm from "./AddBannerForm";
import BannerRowTable from "./BannerRowTable";
import { usePermissionStore } from "@/hooks/usePermissionStore";

const BANNER_TYPE_TO_RESOURCE: Record<string, string> = {
  HOME_SLIDER: "main-banners",
  HOME: "secondary-banners",
  FAVORITE: "favorate-banners",
  MY_ORDERS: "my-orders-banners",
};

function BannerTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: banners, isPending } = useGetBanners();
  const t = useTranslations("Dashboard.BannersPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");
  const searchParams = useSearchParams();
  const { canCreate } = usePermissionStore();

  const typeFromUrl = (searchParams.get("type") ?? "HOME_SLIDER") as BannerType;
  const resourceKey = BANNER_TYPE_TO_RESOURCE[typeFromUrl] ?? "main-banners";

  const bannerTypeConfig = useMemo(
    () => ({
      HOME_SLIDER: {
        title: t("title"),
        description: t("description"),
        createText: t("createNewBanner"),
        createDescription: t("createBannerDescription"),
      },
      HOME: {
        title: t("titleSlider"),
        description: t("descriptionSlider"),
        createText: t("createNewBannerSlider"),
        createDescription: t("createBannerDescriptionSlider"),
      },
      FAVORITE: {
        title: t("titleFavorite"),
        description: t("descriptionFavorite"),
        createText: t("createNewBannerSlider"),
        createDescription: t("createBannerDescriptionSlider"),
      },
      MY_ORDERS: {
        title: t("titleMyOrders"),
        description: t("descriptionMyOrders"),
        createText: t("createNewBannerSlider"),
        createDescription: t("createBannerDescriptionSlider"),
      },
    }),
    [t],
  );

  const { title, description, createText, createDescription } =
    bannerTypeConfig[typeFromUrl] || bannerTypeConfig.HOME_SLIDER;

  const TABLE_HEADERS = useMemo(
    () => [
      {
        Icon: <IdCard className="h-4 w-4" />,
        label: tHeaders("id"),
      },
      {
        Icon: <Settings className="h-4 w-4" />,
        label: tHeaders("actions"),
      },
      {
        Icon: <ImageIcon className="h-4 w-4" />,
        label: tHeaders("imgOrVideo"),
      },
      {
        Icon: <Clock className="h-4 w-4" />,
        label: tHeaders("showTime"),
      },
      {
        Icon: <Link2 className="h-4 w-4" />,
        label: tHeaders("url"),
      },
      {
        Icon: <CalendarDays className="h-4 w-4" />,
        label: tHeaders("createdAt"),
      },
      {
        Icon: <Timer className="h-4 w-4" />,
        label: tHeaders("expiresAt"),
      },
    ],
    [tHeaders],
  );

  return (
    <div className="space-y-6">
      <ReusableTable
        titleIcon={<IdCard className="h-5 w-5 text-primary" />}
        title={title}
        description={description}
        headers={TABLE_HEADERS}
        data={banners?.data || []}
        isPending={isPending}
        actionButton={
          canCreate(resourceKey) && (
            <ResponsiveModal
              trigger={
                <Button variant="premium">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>{createText}</span>
                </Button>
              }
              title={createText}
              description={createDescription}
              open={modalOpen}
              onOpenChange={setModalOpen}
              maxWidth="xl"
              height="auto"
            >
              <AddBannerForm
                type={typeFromUrl}
                onSuccess={() => setModalOpen(false)}
              />
            </ResponsiveModal>
          )
        }
        paginationProps={
          banners?.data?.length
            ? {
                name: "banners",
                totalItems: banners?.total || 0,
                totalPages: banners?.last_page || 1,
              }
            : undefined
        }
        density="md"
        height={64}
        renderRow={(banner) => (
          <BannerRowTable
            key={banner.id}
            data={banner}
            bannerType={resourceKey}
          />
        )}
      />
    </div>
  );
}

export default BannerTable;
