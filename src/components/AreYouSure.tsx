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
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import Spinner from "./ui/spinner";

export function AreYouSure({
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
  const t = useTranslations('confirmation');

  const handleAccept = () => {
    onAccept();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const titleText = title || t('title');
  const descriptionText = description || t('description');
  const triggerButton = TriggerButton || <Button>{t('confirm')}</Button>;

  // Desktop Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center ">
            {/* Warning Icon */}
            <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary rounded-full flex items-center justify-center">
              <Info className="w-8 h-8 text-red-500" />
            </div>

            <DialogTitle className="text-xl font-bold text-foreground text-center">
              {titleText}
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-base leading-relaxed text-center">
              {descriptionText}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none">
              <X className="w-4 h-4 mr-2" />
              {t('cancel')}
            </Button>

            <Button onClick={handleAccept} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner />
                  {t('loading')}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t('yesConfirm')}
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
      <DrawerContent >
        <DrawerHeader className="text-center space-y-4 pb-6">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          <DrawerTitle className="text-xl font-bold text-foreground text-center">
            {titleText}
          </DrawerTitle>

          <DrawerDescription className="text-muted-foreground text-base leading-relaxed px-4 text-center">
            {descriptionText}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <DrawerFooter className="px-0 pt-0">
            <div className="flex flex-col gap-3">
              <Button onClick={handleAccept} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner />
                    {t('loading')}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t('yesConfirm')}
                  </>
                )}
              </Button>

              <DrawerClose asChild>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl">
                  <X className="w-4 h-4 mr-2" />
                  {t('cancel')}
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}