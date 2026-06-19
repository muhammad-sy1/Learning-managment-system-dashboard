import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Phone } from "lucide-react";
import { TranslateFn } from "./types";

interface InfoTabsListProps {
  t: TranslateFn;
}

export function InfoTabsList({ t }: InfoTabsListProps) {
  return (
    <TabsList className="grid w-full grid-cols-3 mb-8 h-12 shadow-sm">
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
  );
}
