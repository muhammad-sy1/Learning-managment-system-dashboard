import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LanguageSwitcher from "@/layouts/dashboard-layout/dashboard-header/LanguageSwitcher";
import ThemeModeSwitcher from "@/layouts/dashboard-layout/dashboard-header/ThemeModeSwitcher";
import { BellIcon, Search } from "lucide-react";
import BackButton from "./BackButton";
import RefreshDataButton from "./RefreshDataButton";
import UserDropdown from "./UserDropdown";
import { useFocusStore } from "@/modules/auth/store/useFocusStore";
import useNotificationsStore from "@/store/useNotificationsStore";
export default function DashboardHeader() {
   const { setFocusField } = useFocusStore();
   const { unreadCount, clearUnread } = useNotificationsStore();

  return (
    <header className="sticky  top-0  z-50 ">
      <div
        className="mx-auto flex h-[65px] p-4  items-center justify-between  border-b bg-white 
        transition ease-linear dark:bg-sidebar"
      >
        <nav className="flex items-center gap-4 px-4">
          <div className="flex items-center gap-4  lg:hidden">
            <SidebarTrigger className="-ms-1" />
            <Separator
              orientation="vertical"
              className="me-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <Logo />
        </nav>
        <div className=" gap-4 flex items-center">
          <ThemeModeSwitcher />
          <LanguageSwitcher />
          <NavLink
            href="/dashboard/notifications"
            className="flex justify-center  relative items-center"
          >
            <Button variant="link" size="icon">
              <BellIcon className="!h-4 !w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-2.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </NavLink>
          <NavLink
            href={`/dashboard/products`}
            className="flex justify-center items-center"
          >
            <Button
              variant="link"
              size="icon"
              onClick={() => setFocusField("search")}
            >
              <Search className="!h-4 !w-4" />
            </Button>
          </NavLink>
          <BackButton />
          <RefreshDataButton />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
