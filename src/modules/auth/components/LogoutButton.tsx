"use client";

import { useTranslations } from "next-intl";
import { logoutService } from "../services/authService";
import useAuth from "../store/authStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AreYouSure } from "@/components/AreYouSure";

export default function LogoutButton() {
  const auth = useAuth();
  const t = useTranslations("UserDropdown");

  const handleLogout = async () => {
    logoutService();
    auth.logout();
  };

  return (
    <AreYouSure
      onAccept={handleLogout}
      TriggerButton={
        <Button
          className=" space-x-2 w-full justify-start  rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive"
          variant="ghost"
          type="button"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("logout")}</span>
        </Button>
      }
    />
  );
}
