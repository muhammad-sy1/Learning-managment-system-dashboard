"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useGetMerchantCoPriceList } from "../../hooks/useGetMerchantCoPriceList";
import { MerchantCoPriceListFilter } from "../../types/users";
import ImagesTab from "./ImagesTab";
import ItemsTab from "./ItemsTab";

interface CustomOrderPriceListContentProps {
  merchantId: number;
  isOpen: boolean;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function CustomOrderPriceListContent({
  merchantId,
  isOpen,
}: CustomOrderPriceListContentProps) {
  const t = useTranslations(
    "Dashboard.USERS.merchantManagement.customOrderPriceList",
  );
  const [activeTab, setActiveTab] =
    useState<MerchantCoPriceListFilter>("items");

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("items");
    }
  }, [isOpen]);

  const query = useGetMerchantCoPriceList(merchantId, activeTab, isOpen);
  const errorMessage = getErrorMessage(query.error, t("loadError"));

  return (
    <div className="py-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as MerchantCoPriceListFilter)
        }
      >
        <TabsList className="grid h-10 w-full grid-cols-2">
          <TabsTrigger value="items">{t("itemsTab")}</TabsTrigger>
          <TabsTrigger value="images">{t("imagesTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          <ItemsTab
            merchantId={merchantId}
            items={query.data?.items ?? []}
            isLoading={query.isLoading}
            isError={query.isError}
            errorMessage={errorMessage}
            onRetry={() => query.refetch()}
          />
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <ImagesTab
            merchantId={merchantId}
            images={query.data?.images ?? []}
            isLoading={query.isLoading}
            isError={query.isError}
            errorMessage={errorMessage}
            onRetry={() => query.refetch()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
