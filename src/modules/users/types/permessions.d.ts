  export type PermissionType =
    | "view"
    | "create"
    | "update"
    | "delete"
    | "all"
    | "manage-status"
    | "close"
    | "send";

  export interface Permission {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    send: boolean;
    close: boolean;
    "manage-status": boolean;
  }

  export interface PagePermission {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    permissions: Permission;
    category?: string;
  }
