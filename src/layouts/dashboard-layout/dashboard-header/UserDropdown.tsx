"use client";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import LogoutButton from "@/modules/auth/components/LogoutButton";
import useAuth from "@/modules/auth/store/authStore";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserDropdown() {
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("UserDropdown");

  const handleVisitProfile = () => {
    router.push("/dashboard/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative hover:!bg-transparent">
          <SafeImage
            // fill
            imageUrl={auth.user?.image}
            alt={auth.user?.full_name || t("fallbackName")}
            className="h-10 w-10 rounded-full"
            IsStyle2={true}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-2"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center space-x-3 p-2 mb-2">
          <div className="relative h-10 w-10 rounded-full">
            <SafeImage
              // fill
              imageUrl={auth.user?.image}
              alt={auth.user?.full_name || t("fallbackName")}
              className="h-10 w-10 rounded-full"
              IsStyle2={true}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {auth.user?.full_name || t("fallbackName")}
            </p>
            <p className="text-xs text-muted-foreground">
              {auth.user?.email || t("fallbackEmail")}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleVisitProfile}
          className="cursor-pointer flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
        >
          <User className="h-4 w-4" />
          <span>{t("visitProfile")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
