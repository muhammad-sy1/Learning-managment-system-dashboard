"use client";

import {
  Layers,
  MapPin,
  MessageSquare,
  Package,
  Settings,
  Star,
  Store,
  Tag,
  Ticket,
  Truck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { PermissionType } from "../../types/permessions";

// Hook for permissions management
export const PermissionsConfig = () => {
  const t = useTranslations("permessions");

const permissionPages = useMemo(
  () => [
    {
      id: "clients" as const,
      name: t("pages.clients"),
      icon: Users,
      category: "users" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "merchants" as const,
      name: t("pages.merchants"),
      icon: Store,
      category: "users" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "delivery" as const,
      name: t("pages.delivery"),
      icon: Truck,
      category: "users" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "zones" as const,
      name: t("pages.provinces"),
      icon: MapPin,
      category: "location" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "coupons" as const,
      name: t("pages.coupons"),
      icon: Ticket,
      category: "marketing" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "sections" as const,
      name: t("pages.sections"),
      icon: Layers,
      category: "content" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "sub-sections" as const,
      name: t("pages.subsections"),
      icon: Tag,
      category: "content" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "main-banners" as const,
      name: t("pages.main-banners"),
      icon: Layers,
      category: "banners" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "secondary-banners" as const,
      name: t("pages.secondary-banners"),
      icon: Tag,
      category: "banners" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "favorite-banners" as const,
      name: t("pages.favorite-banners"),
      icon: Tag,
      category: "banners" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "my-orders-banners" as const,
      name: t("pages.my-orders-banners"),
      icon: Tag,
      category: "banners" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "finance" as const,
      name: t("pages.main-finance"),
      icon: Tag,
      category: "finance" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "sub-finance" as const,
      name: t("pages.sub-finance"),
      icon: Tag,
      category: "finance" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "transactions" as const,
      name: t("pages.transactions"),
      icon: Tag,
      category: "finance" as const,
      allowedPermissions: ["view", "create", "update", "delete"] as PermissionType[],
    },
    {
      id: "products" as const,
      name: t("pages.products"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view","create","update","delete","manage-status"] as PermissionType[],
    },
    {
      id: "products-logs" as const,
      name: t("pages.productslogs"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view"] as PermissionType[],
    },
    {
      id: "sub-products" as const,
      name: t("pages.subProducts"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view","create","update","delete","manage-status"] as PermissionType[],
    },
    {
      id: "rating-products" as const,
      name: t("pages.ratingProducts"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view","delete"] as PermissionType[],
    },
    {
      id: "orders" as const,
      name: t("pages.orders"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view","delete"] as PermissionType[],
    },
     {
      id: "orders-restaurant-market" as const,
      name: t("pages.orders"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view","delete"] as PermissionType[],
    },
     {
      id: "orders-custom" as const,
      name: t("pages.orders"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view","delete"] as PermissionType[],
    },
    {
      id: "orders-logs" as const,
      name: t("pages.orders-logs"),
      icon: Package,
      category: "commerce" as const,
      allowedPermissions: ["view"] as PermissionType[],
    },
    {
      id: "chats" as const,
      name: t("pages.chats"),
      icon: MessageSquare,
      category: "support" as const,
      allowedPermissions: ["view","close","send"] as PermissionType[],
    },
    {
      id: "chat-ratings" as const,
      name: t("pages.chat-ratings"),
      icon: Star,
      category: "support" as const,
      allowedPermissions: ["view","delete"] as PermissionType[],
    },
    {
      id: "settings" as const,
      name: t("pages.infosettings"),
      icon: Settings,
      category: "other" as const,
      allowedPermissions: ["view","update"] as PermissionType[],
    },
    {
      id: "join-applications-delivery" as const,
      name: t("pages.join-applications-delivery"),
      icon: Users,
      category: "users" as const,
      allowedPermissions: ["view","update"] as PermissionType[],
    },
    {
      id: "join-applications-partner" as const,
      name: t("pages.join-applications-partner"),
      icon: Users,
      category: "users" as const,
      allowedPermissions: ["view","update"] as PermissionType[],
    }
  ],
  [t]
);


  const categoryNames: Record<string, string> = useMemo(
    () => ({
      users: t("categories.users"),
      location: t("categories.location"),
      marketing: t("categories.marketing"),
      content: t("categories.content"),
      banners: t("categories.banners"),
      commerce: t("categories.commerce"),
      support: t("categories.support"),
      fainance: t("categories.fainance"),
      other: t("categories.other"),
    }),
    [t]
  );

  const permissionNames = useMemo(
    () => ({
      view: t("crud.view"),
      create: t("crud.create"),
      update: t("crud.update"),
      delete: t("crud.delete"),
      all: t("crud.all"),
      close: t("crud.close"),
      send: t("crud.send"),
      "manage-status": t("crud.manageStatus"),
    }),
    [t]
  );

  return {
    permissionPages,
    categoryNames,
    permissionNames,
  };
};
