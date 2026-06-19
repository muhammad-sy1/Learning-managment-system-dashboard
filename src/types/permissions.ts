import type React from "react";
// Permission types for the application
export type PermissionType = "view" | "create" | "update" | "delete" | "all";

export interface Permission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface PagePermission {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  permissions: Permission;
}

export interface UserPermissions {
  permissions: string[]; // Array of permission strings like "users.view", "products.create"
  role?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  image?: string;
  phone_number?: string;
  permissions: string[];
  role?: string;
}
