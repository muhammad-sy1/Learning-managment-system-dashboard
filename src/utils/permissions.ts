import { ROUTE_PERMISSIONS_MAP } from "@/lib/constants";

export class PermissionsUtil {
  static hasPermission(userPermissions: string[], permission: string): boolean {
    return userPermissions.includes(permission);
  }

  static hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string | string[]
  ): boolean {
    if (typeof requiredPermissions === "string") {
      return this.hasPermission(userPermissions, requiredPermissions);
    }

    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.some((perm) =>
        this.hasPermission(userPermissions, perm)
      );
    }

    return false;
  }

  static matchRoute(pathname: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\[.*?\]/g, "[^/]+")
      .replace(/\//g, "\\/");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  static getRequiredPermissions(pathname: string): string | string[] | null {
    const url = new URL(window.location.href);

    const cleanPath = pathname
      .replace(/^\/[a-z]{2}\//, "") 
      .replace(/^dashboard\//, "")
      .replace(/^dashboard/, "")
      .replace(/^\//, "")
      .replace(/\/$/, "");
      
      //  .replace(/\[\.{3}.+?\]/g, ".*") // matches [...slug]
      // .replace(/\[.*?\]/g, "[^/]+") // matches [id] or similar

    if (ROUTE_PERMISSIONS_MAP[cleanPath]) {
      return ROUTE_PERMISSIONS_MAP[cleanPath];
    }

    const searchParams = Object.fromEntries(url.searchParams.entries());

    if (cleanPath === "users" && searchParams.role) {
      return [`${searchParams.role.toLowerCase()}.view`];
    }

    if (cleanPath.includes("/create")) {
      const base = cleanPath.replace("/create", "");
      return [`${base}.create`];
    }

    if (cleanPath.includes("/update")) {
      const base = cleanPath.replace("/update", "");
      return [`${base}.update`];
    }

    if (cleanPath.includes("/view")) {
      const base = cleanPath.replace("/view", "");
      return [`${base}.view`];
    }

    for (const [pattern, permissions] of Object.entries(
      ROUTE_PERMISSIONS_MAP
    )) {
      if (this.matchRoute(cleanPath, pattern)) {
        return permissions;
      }
    }

    return null;
  }

  static canAccessRoute(pathname: string, userPermissions: string[]): boolean {
    const requiredPermissions = this.getRequiredPermissions(pathname);

    if (
      !requiredPermissions ||
      (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)
    ) {
      return true;
    }

    return this.hasAnyPermission(userPermissions, requiredPermissions);
  }
}
