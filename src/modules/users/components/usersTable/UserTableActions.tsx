"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCog } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IUser } from "../../types/users";
import UpdateUserRole from "./UpdateUserRole";
import UserBlockStatus from "./UserBlockStatus";

const UserTableActions = ({
  data,
  mappedKey,
  configTranslate,
}: {
  data: IUser;
  mappedKey: string | undefined;
  configTranslate: Record<string, string>;
}) => {
  const [isblockOpen, setIsblockOpen] = useState(false);
  const t = useTranslations("Dashboard.USERS.merchantManagement");
  const [isUpdateRoleOpen, setIsUpdateRole] = useState(false);
  useState(false);

  return (
    <div className="flex items-center gap-2  justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <>
            {mappedKey === "STUDENT" && (
              <div>
                <DropdownMenuItem onSelect={() => setIsUpdateRole(true)}>
                  <UserCog className="ml-2 h-4 w-4" />
                  <span>{configTranslate.isUpdateRoleOpen}</span>
                </DropdownMenuItem>
              </div>
            )}

          </>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveModal
        title={configTranslate.isUpdateRoleOpen}
        maxWidth="2xl"
        trigger={null}
        height="auto"
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRole}
      >
        <UpdateUserRole
          data={data}
          onSuccess={() => setIsUpdateRole(false)}
          configTranslate={configTranslate}
        />
      </ResponsiveModal>

      <ResponsiveModal
        title={configTranslate.status}
        maxWidth="2xl"
        height="auto"
        trigger={null}
        open={isblockOpen}
        onOpenChange={setIsblockOpen}
      >
        <UserBlockStatus
          data={data}
          onSuccess={() => setIsblockOpen(false)}
          configTranslate={configTranslate}
        />
      </ResponsiveModal>
    </div>
  );
};

export default UserTableActions;
