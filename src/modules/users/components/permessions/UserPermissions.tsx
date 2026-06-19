"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Permission, PermissionType } from "../../types/permessions";
import { PermissionsConfig } from "./PermissionsConfig";

interface UserPermissionsProps {
  initialPermissions?: string[];
  onPermissionsChange?: (permissions: string[]) => void;
}

export default function UserPermissions({
  initialPermissions = [],
  onPermissionsChange,
}: UserPermissionsProps) {
  const t = useTranslations("permessions");
  const permessionsConfig = PermissionsConfig();

  const { permissionPages, categoryNames, permissionNames } = permessionsConfig;
  //////////////////
  const convertArrayToObject = (
    permissionsArray: string[],
  ): Record<string, Permission> => {
    const permissions: Record<string, Permission> = {};
    permissionPages.forEach((page) => {
      permissions[page.id] = {
        view: permissionsArray.includes(`${page.id}.view`),
        create: permissionsArray.includes(`${page.id}.create`),
        update: permissionsArray.includes(`${page.id}.update`),
        delete: permissionsArray.includes(`${page.id}.delete`),
        send: permissionsArray.includes(`${page.id}.send`),
        close: permissionsArray.includes(`${page.id}.close`),
        "manage-status": permissionsArray.includes(`${page.id}.manage-status`),
      };
    });

    return permissions;
  };

  const convertObjectToArray = (
    permissionsObject: Record<string, Permission>,
  ): string[] => {
    const permissionsArray: string[] = [];

    Object.entries(permissionsObject).forEach(([pageId, permissions]) => {
      if (permissions.view) permissionsArray.push(`${pageId}.view`);
      if (permissions.create) permissionsArray.push(`${pageId}.create`);
      if (permissions.update) permissionsArray.push(`${pageId}.update`);
      if (permissions.delete) permissionsArray.push(`${pageId}.delete`);
      if (permissions.close) permissionsArray.push(`${pageId}.close`);
      if (permissions.send) permissionsArray.push(`${pageId}.send`);
      if (permissions["manage-status"])
        permissionsArray.push(`${pageId}.manage-status`);
    });

    return permissionsArray;
  };

  /////////////////
  useEffect(() => {
    const newPermissions = convertArrayToObject(initialPermissions);
    setPermissions(newPermissions);
  }, [initialPermissions]);

  const defaultPermissions = useMemo(() => {
    return convertArrayToObject(initialPermissions);
  }, [initialPermissions]);

  const [permissions, setPermissions] =
    useState<Record<string, Permission>>(defaultPermissions);

  const handlePermissionsChange = useCallback(
    (newPermissions: Record<string, Permission>) => {
      const flatPermissions = convertObjectToArray(newPermissions);
      onPermissionsChange?.(flatPermissions);
    },
    [onPermissionsChange],
  );

  const isAllSelected = (pageId: string): boolean => {
    const perm = permissions[pageId];
    const page = permissionPages.find((p) => p.id === pageId);

    if (!page) return false;

    const allowedPerms = page.allowedPermissions ?? [
      "view",
      "create",
      "update",
      "delete",
      "manage-status",
    ];

    return allowedPerms.every(
      (permType) => perm[permType as keyof Permission] === true,
    );
  };

  const updatePermission = (
    pageId: string,
    permissionType: PermissionType,
    checked: boolean,
  ) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev };
      const page = permissionPages.find((p) => p.id === pageId);
      const allowedPerms = page?.allowedPermissions ?? [
        "view",
        "create",
        "update",
        "delete",
        "manage-status",
      ];

      if (permissionType === "all") {
        const updatedPermissions: Permission = {} as Permission;

        Object.keys(newPermissions[pageId]).forEach((key) => {
          updatedPermissions[key as keyof Permission] = false;
        });

        allowedPerms.forEach((perm) => {
          updatedPermissions[perm as keyof Permission] = checked;
        });

        newPermissions[pageId] = updatedPermissions;
      } else {
        newPermissions[pageId] = {
          ...newPermissions[pageId],
          [permissionType]: checked,
        };

        if (checked && permissionType !== "view") {
          newPermissions[pageId].view = true;
        }
        if (!checked && permissionType === "view") {
          newPermissions[pageId] = {
            view: false,
            create: false,
            update: false,
            delete: false,
            send: false,
            close: false,
            "manage-status": false,
          };
        }
      }

      handlePermissionsChange(newPermissions);
      return newPermissions;
    });
  };

  const groupedPages = permissionPages.reduce(
    (acc, page) => {
      const category = page.category || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(page);
      return acc;
    },
    {} as Record<string, typeof permissionPages>,
  );

  return (
    <div className="space-y-6 w-full  overflow-hidden">
      <div className="flex items-center  mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">{t("userPermessions")}</h2>
      </div>

      {Object.entries(groupedPages).map(([category, pages]) => (
        <Card key={category} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {categoryNames[category]}
              </Badge>
              {/* <span className="text-sm text-muted-foreground">
                ({pages.length} {t("pages.count")})
              </span> */}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pages.map((page, index) => {
              const IconComponent = page.icon;
              const pagePermissions = permissions[page.id];
              const allSelected = isAllSelected(page.id);

              return (
                <div key={page.id}>
                  <div className="flex flex-col gap-4 justify-between p-2 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{page.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-center px-2 gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`${page.id}-all`}
                          checked={allSelected}
                          onCheckedChange={(checked) =>
                            updatePermission(page.id, "all", checked as boolean)
                          }
                          className=" w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label
                          htmlFor={`${page.id}-all`}
                          className="text-[15px]  cursor-pointer"
                        >
                          {permissionNames.all}
                        </Label>
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      <div className="flex items-center gap-4">
                        {(
                          (page.allowedPermissions ?? [
                            "view",
                            "create",
                            "update",
                            "delete",
                            "manage-status",
                          ]) as PermissionType[]
                        ).map((permType) => (
                          <div
                            key={permType}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`${page.id}-${permType}`}
                              checked={
                                pagePermissions[permType as keyof Permission]
                              }
                              onCheckedChange={(checked) =>
                                updatePermission(
                                  page.id,
                                  permType,
                                  checked as boolean,
                                )
                              }
                              className="w-5 h-5 cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label
                              htmlFor={`${page.id}-${permType}`}
                              className="text-[14px] cursor-pointer flex items-center gap-1"
                            >
                              {
                                permissionNames[
                                  permType as keyof typeof permissionNames
                                ]
                              }
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {index < pages.length - 1 && <Separator className="my-2" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
