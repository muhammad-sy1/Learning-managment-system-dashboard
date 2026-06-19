"use client";

import Loading from "@/app/[locale]/dashboard/loading";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Edit, FileText, Info, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetInfo } from "../../hooks/useGetInfo";
import AppInfoCard from "./AppInfoCard";
import GeneralInfoCard from "./GeneralInfoCard";
import SocialInfoCard from "./SocialInfoCard";
import UpdateInfoForm from "./UpdateInfoForm";

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { data, isPending } = useGetInfo();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const t = useTranslations("Dashboard.InfoPage");

  if (isPending) {
    return <Loading />;
  }

  // console.log("data =================", data);

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Info className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t("pageTitle")}
          </h1>
          <ResponsiveModal
            trigger={
              <Button variant="outline" size="sm" className=" p-0">
                {t("editpageTitle")} <Edit className="h-4 w-4" />
              </Button>
            }
            title={t("pageTitle")}
            maxWidth="2xl"
            height="auto"
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          >
            {data && (
              <UpdateInfoForm
                data={data}
                onSuccess={() => setIsEditOpen(false)}
              />
            )}
          </ResponsiveModal>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          dir="rtl"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12  shadow-sm">
            <TabsTrigger
              value="general"
              className="text-base font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <FileText className="ml-2 h-4 w-4" />
              {t("tabs.general")}
            </TabsTrigger>

            <TabsTrigger
              value="app"
              className="text-base font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Download className="ml-2 h-4 w-4" />
              {t("tabs.app")}
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="text-base font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Phone className="ml-2 h-4 w-4" />
              {t("tabs.contact")}
            </TabsTrigger>
          </TabsList>

          {/* General Tab Content */}
          <TabsContent value="general" className="space-y-6">
            {data?.general && <GeneralInfoCard data={data.general} />}
          </TabsContent>

          {/* App Tab Content */}
          <TabsContent value="app">
            {data?.general && <AppInfoCard data={data.app} />}
          </TabsContent>

          {/* Social Tab Content */}
          <TabsContent value="social" className="space-y-6">
            {data?.social && <SocialInfoCard data={data.social} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
