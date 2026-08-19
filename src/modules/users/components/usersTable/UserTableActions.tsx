"use client";
// import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
// import NavLink from "@/components/NavLink";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { usePermissionStore } from "@/hooks/usePermissionStore";
import {
  // Clock,
  // Edit,
  // FileDown,
  // FileText,
  // KeyRound,
  // Loader2,
  MoreHorizontal,
  UserCog,
  // Package,
  // Trash2,
  // UserCog,
  // UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
// import { toast } from "sonner";
// import useDeleteUser from "../../hooks/useDeleteUser";
// import { getUserToken } from "../../services/users";
import { IUser } from "../../types/users";
// import EditUserForm from "./EditUserForm";
import UpdateUserRole from "./UpdateUserRole";
import UserBlockStatus from "./UserBlockStatus";
// import CustomOrderPriceListContent from "./CustomOrderPriceListContent";
// import WorkingHoursContent from "./WorkingHoursContent";

const UserTableActions = ({
  data,
  mappedKey,
  configTranslate,
}: {
  data: IUser;
  mappedKey: string | undefined;
  configTranslate: Record<string, string>;
}) => {
  // const [isDownloading, setIsDownloading] = useState(false);
  // const [isOpeningWebsite, setIsOpeningWebsite] = useState(false);
  // const { mutate } = useDeleteUser({ configTranslate });
  // const [isEditOpen, setIsEditOpen] = useState(false);
  const [isblockOpen, setIsblockOpen] = useState(false);
  // const { canDelete, canUpdate } = usePermissionStore();
  const t = useTranslations("Dashboard.USERS.merchantManagement");
  const [isUpdateRoleOpen, setIsUpdateRole] = useState(false);
  // const [isWorkingHoursOpen, setIsWorkingHoursOpen] = useState(false);
  // const [isCustomOrderPriceListOpen, setIsCustomOrderPriceListOpen] =
  useState(false);

  // const openWebsiteAsUser = async () => {
  //   const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  //   if (!websiteUrl) {
  //     toast.error(configTranslate.openWebsiteMissingConfig);
  //     return;
  //   }

  //   try {
  //     setIsOpeningWebsite(true);
  //     const token = await getUserToken(data.id);
  //     const separator = websiteUrl.includes("?") ? "&" : "?";
  //     const redirectUrl = `${websiteUrl}${separator}token=${encodeURIComponent(
  //       token,
  //     )}`;

  //     window.open(redirectUrl, "_blank", "noopener,noreferrer");
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : configTranslate.openWebsiteError,
  //     );
  //   } finally {
  //     setIsOpeningWebsite(false);
  //   }
  // };

  return (
    <div className="flex items-center gap-2  justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <>
            {mappedKey === "STUDENT" && (
              <div>
                <DropdownMenuItem onSelect={() => setIsUpdateRole(true)}>
                  <UserCog className="ml-2 h-4 w-4" />
                  <span>{configTranslate.isUpdateRoleOpen}</span>
                </DropdownMenuItem>
              </div>
            )}

            {/* <DropdownMenuItem onSelect={() => setIsblockOpen(true)}>
              {data.blocked_at ? (
                <>
                  <UserX className="ml-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">
                    {configTranslate.unblock}
                  </span>
                </>
              ) : (
                <>
                  <UserX className="ml-2 h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    {configTranslate.block}
                  </span>
                </>
              )}
            </DropdownMenuItem> */}
          </>

          {/*
          {permissionKey === "merchants" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsWorkingHoursOpen(true)}>
                <Clock className="ml-2 h-4 w-4" />
                <span>{t("workingHours.menuLabel")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsCustomOrderPriceListOpen(true)}
              >
                <FileText className="ml-2 h-4 w-4" />
                <span>{t("customOrderPriceList.menuLabel")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink
                  href={`/dashboard/products?merchant_id=${data.id}`}
                  className="flex items-center"
                >
                  <Package className="ml-2 h-4 w-4" />
                  <span>{t("viewProductForMerchant")}</span>
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={async (e) => {
                  e.preventDefault();
                  try {
                    setIsDownloading(true);
                    const blob = await downloadMerchantProducts(data.id);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${data.store_name}.pdf`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  } catch (e) {
                    toast.error("فشل تحميل الملف", {
                      description:
                        (e as string) || "حدث خطأ أثناء تحميل ملف المنتجات.",
                    });
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="ml-2 h-4 w-4" />
                )}
                <span>{t("downloadProductForMerchant")}</span>
              </DropdownMenuItem>
            </>
          )} */}

          {/* {canDelete(permissionKey) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="p-0"
              >
                <AreYouSureDeleteing
                  TriggerButton={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-2 py-1.5 text-sm text-destructive hover:text-destructive"
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      <span>{configTranslate.deleteBtn}</span>
                    </Button>
                  }
                  onAccept={() => {
                    mutate(data.id);
                  }}
                />
              </DropdownMenuItem>
            </>
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveModal
        title={configTranslate.isUpdateRoleOpen}
        maxWidth="2xl"
        trigger={null}
        height="auto"
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRole}
      >
        <UpdateUserRole
          data={data}
          onSuccess={() => setIsUpdateRole(false)}
          configTranslate={configTranslate}
        />
      </ResponsiveModal>

      <ResponsiveModal
        title={configTranslate.status}
        maxWidth="2xl"
        height="auto"
        trigger={null}
        open={isblockOpen}
        onOpenChange={setIsblockOpen}
      >
        <UserBlockStatus
          data={data}
          onSuccess={() => setIsblockOpen(false)}
          configTranslate={configTranslate}
        />
      </ResponsiveModal>

      {/* {permissionKey === "merchants" && (
        <>
          <ResponsiveModal
            title={t("workingHours.title")}
            maxWidth="lg"
            height="auto"
            trigger={null}
            open={isWorkingHoursOpen}
            onOpenChange={setIsWorkingHoursOpen}
          >
            <WorkingHoursContent
              merchantId={data.id}
              isOpen={isWorkingHoursOpen}
            />
          </ResponsiveModal>

          <ResponsiveModal
            title={t("customOrderPriceList.title")}
            maxWidth="2xl"
            height="auto"
            trigger={null}
            open={isCustomOrderPriceListOpen}
            onOpenChange={setIsCustomOrderPriceListOpen}
          >
            <CustomOrderPriceListContent
              merchantId={data.id}
              isOpen={isCustomOrderPriceListOpen}
            />
          </ResponsiveModal>
        </>
      )} */}
    </div>
  );
};

export default UserTableActions;
