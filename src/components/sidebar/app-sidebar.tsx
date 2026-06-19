"use client";

import NavLink from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import { SidebarRoutes } from "./SidebarRoutes";

type SubMenuItem = {
  id?: string;
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  searchParams?: Record<string, string>;
};

export type MenuItem = {
  id?: string;
  href?: string;
  label: string;
  searchParams?: Record<string, string>;
  icon: React.ComponentType<any>;
  children?: SubMenuItem[];
  menuType?: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});
  const routes = SidebarRoutes();

  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.indexOf("dashboard");
  const withoutLocale = "/" + segments.slice(dashboardIndex).join("/");

  const currentSearch = searchParams?.toString() || "";
  const currentPath =
    withoutLocale + (currentSearch ? `?${currentSearch}` : "");

  const createHrefWithParams = React.useCallback(
    (href: string, params?: Record<string, string>) => {
      if (!params) return href;
      const urlParams = new URLSearchParams(params);

      return `${href}?${urlParams.toString()}`;
    },
    [],
  );


  const isActiveLink = React.useCallback(
    (href: string, searchParams?: Record<string, string>) => {
      try {
        const fullHref = createHrefWithParams(href, searchParams);

        const currentUrl = new URL(currentPath, window.location.origin);
        const targetUrl = new URL(fullHref, window.location.origin);

        if (currentUrl.pathname !== targetUrl.pathname) return false;

        const currentParams = currentUrl.searchParams;
        const targetParams = targetUrl.searchParams;

        if (currentParams.toString() !== targetParams.toString()) {
          return false;
        }

        return true;
      } catch (err) {
        console.error("isActiveLink error:", err);
        return false;
      }
    },
    [currentPath, createHrefWithParams],
  );

  const isAnyChildActive = (children: SubMenuItem[] = []) => {
    return children.some((child) =>
      isActiveLink(child.href, child.searchParams),
    );
  };

  React.useEffect(() => {
    const initiallyOpenMenus: Record<string, boolean> = {};

    routes.forEach((route) => {
      if (route.children) {
        initiallyOpenMenus[route.menuType || route.label] = isAnyChildActive(
          route.children,
        );
      }
    });

    setOpenMenus(initiallyOpenMenus);
  }, [currentPath]);

  const toggleMenu = (menuType: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuType]: !prev[menuType],
    }));
  };

  const isMenuOpen = (menuType: string) => {
    return openMenus[menuType] || false;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              size="lg"
              className={`
                w-full flex items-center
                rounded
                font-medium text-lg
                transition-all duration-300
                ${open ? "justify-between" : "justify-center"}
                hover:bg-card/40 
                active:bg-card/50
                cursor-pointer
              `}
            >
              {open && (
                <h2 className="flex items-center gap-1.5 text-xl font-bold tracking-tight truncate group">
                  <span className="text-gray-800 dark:text-gray-100 font-extrabold">
                    Lista Stores
                  </span>
                </h2>
              )}

              {open ? (
                <ChevronRight className="h-5 w-5 text-sidebar-foreground transition-transform duration-300" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-sidebar-foreground transition-transform duration-300" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2 border-t ">
        <SidebarMenu className="space-y-1 mt-2">
          {routes.map((route) => {
            const Icon = route.icon;
            const hasChildren = route.children && route.children.length > 0;
            const menuType = route.menuType || route.label;

            if (hasChildren) {
              const isActive = isAnyChildActive(route.children);
              const isOpen = isMenuOpen(menuType);

              return (
                <SidebarMenuItem key={route.label}>
                  <SidebarMenuButton
                    onClick={() => toggleMenu(menuType)}
                    className={`flex font-medium items-center justify-between space-x-2 h-10 rounded-md transition-all duration-300 px-3 w-full ${
                      isActive
                        ? "bg-sidebar-primary text-white "
                        : "text-muted-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={16} strokeWidth={3} />
                      {open && <span>{route.label}</span>}
                    </div>
                    {open &&
                      (isOpen ? (
                        <ChevronUp
                          size={16}
                          className="transition-transform duration-300"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="transition-transform duration-300"
                        />
                      ))}
                  </SidebarMenuButton>

                  {open && (
                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        maxHeight: isOpen
                          ? route.children!.length * 45 + "px"
                          : "0",
                        opacity: isOpen ? 1 : 0.7,
                      }}
                    >
                      <div className="ml-6 mt-1 space-y-1">
                        {route.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isActiveLink(
                            child.href,
                            child.searchParams,
                          );
                          const childHref = createHrefWithParams(
                            child.href,
                            child.searchParams,
                          );

                          return (
                            <SidebarMenuButton key={childHref} asChild>
                              <NavLink
                                href={childHref}
                                className={`flex font-medium items-center space-x-2 h-9 rounded-md transition-all duration-300 px-3 ${
                                  isChildActive
                                    ? "bg-sidebar-primary text-white tracking-wide  "
                                    : "text-muted-foreground hover:bg-sidebar-accent"
                                }`}
                              >
                                <ChildIcon size={14} strokeWidth={3} />
                                <span>{child.label}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </SidebarMenuItem>
              );
            }

            const isActive = isActiveLink(route.href!);
            return (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton
                  asChild
                  className={`flex font-medium items-center   tracking-wide space-x-2 h-11 letter-spacing rounded-md transition-all duration-300 px-3 ${
                    isActive
                      ? "bg-sidebar-primary text-white"
                      : "text-muted-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <NavLink href={route.href!}>
                    <Icon size={16} strokeWidth={3} />
                    {open && <span>{route.label}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
