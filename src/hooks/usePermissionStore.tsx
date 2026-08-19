import { create } from "zustand";
import { PermissionsUtil } from "@/utils/permissions";

interface PermissionsState {
  user: IUser | null;
  permissions: string[];

  setUser: (user: IUser | null) => void;
  setPermissions: (permissions: string[]) => void;
  clear: () => void;

  hasPermission: (permission: string | string[]) => boolean;
  canView: (resource: string) => boolean;
  canCreate: (resource: string) => boolean;
  canUpdate: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canClose: (resource: string) => boolean;
  canSend: (resource: string) => boolean;
  canManageStatus: (resource: string) => boolean;
  canAccess: (route: string) => boolean;
}

export const usePermissionStore = create<PermissionsState>((set, get) => ({
  user: null,
  permissions: [],

  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  clear: () => set({ user: null, permissions: [] }),

  hasPermission: (permission) => {
    return PermissionsUtil.hasAnyPermission(get().permissions, permission);
  },

  canView: (resource) => get().hasPermission(`${resource}.view`),
  canCreate: (resource) => get().hasPermission(`${resource}.create`),
  canUpdate: (resource) => get().hasPermission(`${resource}.update`),
  canDelete: (resource) => get().hasPermission(`${resource}.delete`),
  canClose: (resource) => get().hasPermission(`${resource}.close`),
  canSend: (resource) => get().hasPermission(`${resource}.send`),
  canManageStatus: (resource) =>
    get().hasPermission(`${resource}.manageStatus`),

  canAccess: (route) => {
    return PermissionsUtil.canAccessRoute(route, get().permissions);
  },
}));
