"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import Spinner from "./ui/spinner";
import { useTranslations } from "next-intl";

export function AreYouSureDeleteing({
  onAccept,
  TriggerButton,
  description,
  title,
  isLoading = false,
}: {
  onAccept: () => void;
  TriggerButton?: React.ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const t = useTranslations("DeleteConfirmation");

  const handleAccept = () => {
    onAccept();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const deleteTitle = title || t("title");
  const deleteDescription = description || t("description");
  const triggerButton = TriggerButton || (
    <Button>{t("defaultTriggerButton")}</Button>
  );

  // Desktop Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent
          className="sm:max-w-md"
          dir="rtl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        > 
          <DialogHeader className="text-center space-y-4">
            {/* Warning Icon */}
            <div className="mx-auto w-16 h-16 bg-rose-100/90 rounded-full flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>

            <DialogTitle className="text-xl font-bold text-foreground text-center">
              {deleteTitle}
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-base leading-relaxed text-center">
              {deleteDescription}
            </DialogDescription>
          </DialogHeader>

          {/* Warning Message */}
          <div className="bg-rose-50/90 border border-rose-200 rounded-lg p-4 my-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-rose-800">
                <p className="font-semibold mb-1">{t("warningTitle")}</p>
                <p className="text-rose-700">{t("warningMessage")}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none border-gray-300  hover:bg-gray-100"
            >
              {t("cancelButton")}
            </Button>

            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  {t("deletingStatus")}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 me-2" />
                  {t("deleteButton")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile Drawer
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent dir="rtl">
        <DrawerHeader className="text-center space-y-4 pb-6">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <DrawerTitle className="text-xl font-bold  text-center!">
            {deleteTitle}
          </DrawerTitle>

          <DrawerDescription className="text-gray-600 text-base leading-relaxed px-4 text-center">
            {deleteDescription}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800 text-center">
                <p className="font-medium mb-1">{t("warningTitle")}</p>
                <p>{t("warningMessageFull")}</p>
              </div>
            </div>
          </div>

          <DrawerFooter className="px-0 pt-0">
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAccept}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {t("deletingStatus")}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 me-2" />
                    {t("deleteButton")}
                  </>
                )}
              </Button>

              <DrawerClose asChild>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl"
                >
                  <X className="w-4 h-4 me-2" />
                  {t("cancelButton")}
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
