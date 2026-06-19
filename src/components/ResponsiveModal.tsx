"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ReactNode, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ResponsiveModalProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "fit";
  height?: "auto" | "90vh" | "80vh" | "70vh" | "full";
  scrollable?: boolean;
  tooltipContent?: string;
  preventOutsideClick?: boolean;
}

export function ResponsiveModal({
  trigger,
  title,
  description,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  maxWidth = "fit",
  height = "90vh",
  tooltipContent = "",
  scrollable = true,
  preventOutsideClick = true,
}: ResponsiveModalProps) {
  const [mounted, setMounted] = useState(false);

  const [internalOpen, setInternalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setMounted(true);
  }, []);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  const getMaxWidthClass = () => {
    const widthMap = {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      fit: "w-fit max-w-[90vw]",
    };
    return widthMap[maxWidth];
  };

  const getHeightClass = () => {
    const heightMap = {
      auto: "h-auto",
      "90vh": "max-h-[90dvh]",
      "80vh": "max-h-[80dvh]",
      "70vh": "max-h-[70dvh]",
      full: "h-full",
    };
    return heightMap[height];
  };

  if (!mounted || isDesktop === undefined) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* <DialogTrigger asChild>{trigger}</DialogTrigger> */}
        {tooltipContent ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{tooltipContent}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        )}

        <DialogContent
          onInteractOutside={(e) => {
            if (preventOutsideClick) {
              e.preventDefault();
            }
          }}
          className={`${getMaxWidthClass()} 
          `}
          // ${scrollable
          //   ? `${getHeightClass()} overflow-auto`
          //   : ""}
        >
          <DialogHeader>
            <DialogTitle className="text-center ">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-center ">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div
            className={
              scrollable
                ? `no-scrollbar -mx-4 max-h-[60vh] overflow-y-auto px-4`
                : ""
            }
          >
            {children}
          </div>
          {/* <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {tooltipContent ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            </TooltipTrigger>
            <TooltipContent>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      )}
      {/* <DrawerTrigger asChild>{trigger}</DrawerTrigger> */}
      <DrawerContent className="mx-auto max-w-[97%]">
        <DrawerHeader className="shrink-0">
          <DrawerTitle className="">{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div
          className={`no-scrollbar overflow-y-auto px-4 pb-2 ${getHeightClass()}`}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
