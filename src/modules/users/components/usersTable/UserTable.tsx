"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import ReusableTooltip from "@/components/ReusableTooltip";
import { Button } from "@/components/ui/button";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import {
  BadgePercent,
  BookIcon,
  Calendar,
  CircleAlert,
  IdCard,
  Mail,
  Percent,
  Phone,
  Receipt,
  Settings,
  Shuffle,
  Truck,
  UserPen,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import { useGetUsers } from "../../hooks/useGetUsers";
import AddUserForm from "./AddUserForm";
import UserRowTable from "./UserRowTable";

export type permissionType =
  | "merchants"
  | "clients"
  | "admins"
  | "delivery"
  | "students"
  | "instructors";

function UserTable({
  roleFromProps,
  isInstructor,
}: {
  roleFromProps?: string;
  isInstructor?: boolean;
}) {
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const searchParams = useSearchParams();

  const rawQueryRole = searchParams.get("role");
  const queryRole = rawQueryRole?.toUpperCase();
  const queryIsInstructor = searchParams.get("is_instructor") === "1";
  const effectiveIsInstructor = isInstructor || queryIsInstructor;
  const role =
    (roleFromProps ? roleFromProps.toUpperCase() : queryRole) || undefined;

  const shouldPassRoleFromProps = roleFromProps;

  const { data: users, isPending } = useGetUsers(
    shouldPassRoleFromProps ? role : undefined,
    effectiveIsInstructor,
  );

  const tClient = useTranslations("Dashboard.USERS.customerManagement");
  const tAdmins = useTranslations("Dashboard.USERS.adminManagement");
  const tStudent = useTranslations("Dashboard.USERS.studentManagement");
  const tInstructor = useTranslations("Dashboard.USERS.instructorManagement");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const { canCreate } = usePermissionStore();

  const roleConfig: Record<
    string,
    {
      title: string;
      createLabel: string;
      description: string;
      caption: string;
      permission: permissionType;
      status: string;
      blocked: string;
      unblocked: string;
      block: string;
      unblock: string;
      EditUser: string;
      create: string;
      update: string;
      delete: string;
      updateBtn: string;
      isUpdateRoleOpen: string;
      deleteBtn: string;
      openWebsiteAsUser?: string;
      openWebsiteError?: string;
      openWebsiteMissingConfig?: string;
    }
  > = {
    STUDENT: {
      permission: "clients",
      title: tStudent("title"),
      status: tStudent("status"),
      blocked: tStudent("blocked"),
      isUpdateRoleOpen: tStudent("isUpdateRoleOpen"),
      unblocked: tStudent("unblocked"),
      block: tStudent("block"),
      unblock: tStudent("unblock"),
      createLabel: tStudent("createNewUser"),
      description: tStudent("createUserDescription"),
      caption: tStudent("tableCaption"),
      EditUser: tStudent("EditUser"),
      create: tStudent("create"),
      update: tStudent("updated"),
      delete: tStudent("delete"),
      updateBtn: tStudent("update"),
      deleteBtn: tStudent("deleteBtn"),
      openWebsiteAsUser: tStudent("openWebsiteAsUser"),
      openWebsiteError: tStudent("openWebsiteError"),
      openWebsiteMissingConfig: tStudent("openWebsiteMissingConfig"),
    },
    CLIENT: {
      permission: "clients",
      title: tClient("title"),
      status: tClient("status"),
      blocked: tClient("blocked"),
      isUpdateRoleOpen: tClient("isUpdateRoleOpen"),
      unblocked: tClient("unblocked"),
      block: tClient("block"),
      unblock: tClient("unblock"),
      createLabel: tClient("createNewUser"),
      description: tClient("createUserDescription"),
      caption: tClient("tableCaption"),
      EditUser: tClient("EditUser"),
      create: tClient("create"),
      update: tClient("updated"),
      delete: tClient("delete"),
      updateBtn: tClient("update"),
      deleteBtn: tClient("deleteBtn"),
      openWebsiteAsUser: tClient("openWebsiteAsUser"),
      openWebsiteError: tClient("openWebsiteError"),
      openWebsiteMissingConfig: tClient("openWebsiteMissingConfig"),
    },
    INSTRUCTOR: {
      permission: "merchants",
      title: tInstructor("title"),
      status: tInstructor("status"),
      blocked: tInstructor("blocked"),
      isUpdateRoleOpen: tInstructor("isUpdateRoleOpen"),
      unblocked: tInstructor("unblocked"),
      block: tInstructor("block"),
      unblock: tInstructor("unblock"),
      createLabel: tInstructor("createNewUser"),
      description: tInstructor("createUserDescription"),
      caption: tInstructor("tableCaption"),
      EditUser: tInstructor("EditUser"),
      create: tInstructor("create"),
      update: tInstructor("updated"),
      delete: tInstructor("delete"),
      updateBtn: tInstructor("update"),
      deleteBtn: tInstructor("deleteBtn"),
    },
    ADMIN: {
      permission: "admins",
      EditUser: tAdmins("EditUser"),
      isUpdateRoleOpen: tAdmins("isUpdateRoleOpen"),
      title: tAdmins("title"),
      status: tAdmins("status"),
      blocked: tAdmins("blocked"),
      unblocked: tAdmins("unblocked"),
      block: tAdmins("block"),
      unblock: tAdmins("unblock"),
      createLabel: tAdmins("createNewUser"),
      description: tAdmins("createUserDescription"),
      caption: tAdmins("tableCaption"),
      create: tAdmins("create"),
      update: tAdmins("updated"),
      delete: tAdmins("delete"),
      updateBtn: tAdmins("update"),
      deleteBtn: tAdmins("deleteBtn"),
    },
  };

  // Map our app roles to the existing roleConfig keys to reuse translations and behavior
  const mappedKey = (() => {
    const lowerRole =
      roleFromProps?.toLowerCase() ||
      role?.toLowerCase() ||
      (effectiveIsInstructor ? "instructor" : undefined);

    if (lowerRole === "student" || lowerRole === "client") return "STUDENT";
    if (lowerRole === "instructor") return "INSTRUCTOR";
    if (lowerRole === "admin") return "ADMIN";
    if (effectiveIsInstructor) return "INSTRUCTOR";
    if (lowerRole === "delivery") return "DELIVERY";
    if (lowerRole === "merchant") return "MERCHANT";

    return role as string | undefined;
  })();

  const config = mappedKey ? roleConfig[mappedKey] : undefined;

  const headerIcons = {
    ordersTotalIncome: Truck,
    shippingDiscountsTotal: Percent,
    totalSales: Receipt,
    totalAppCommission: BadgePercent,
    orderDiscountsTotal: Percent,
    totalOtherTransactions: Shuffle,
    totalFinalAmount: Wallet,
  };

  function HeaderWithTooltip({
    icon: Icon,
    titleKey,
    descriptionKey,
  }: {
    icon: React.ElementType;
    titleKey: string;
    descriptionKey: string;
  }) {
    return {
      Icon: (
        <ReusableTooltip
          trigger={
            <Button variant="outline" size="sm">
              <Icon className="h-4 w-4" />
            </Button>
          }
          tooltipContent={tHeaders(descriptionKey)}
        />
      ),
      label: tHeaders(titleKey),
    };
  }

  const TABLE_HEADERS = [
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },

    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("image") },
    ...(role === "MERCHANT"
      ? [
          {
            Icon: <BookIcon className="h-4 w-4" />,
            label: tHeaders("coverImage"),
          },
        ]
      : []),
    { Icon: <UserPen className="h-4 w-4" />, label: tHeaders("first_name") },
    { Icon: <UserPen className="h-4 w-4" />, label: tHeaders("last_name") },
    { Icon: <Mail className="h-4 w-4" />, label: tHeaders("email") },
    // { Icon: <BookIcon className="h-4 w-4" />, label: tHeaders("bio") },
    ...(role === "MERCHANT"
      ? [
          {
            Icon: <BookIcon className="h-4 w-4" />,
            label: tHeaders("store_name"),
          },
          {
            Icon: <BookIcon className="h-4 w-4" />,
            label: tHeaders("store_location"),
          },
          HeaderWithTooltip({
            icon: headerIcons.totalSales,
            titleKey: "totalSales.title",
            descriptionKey: "totalSales.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.totalAppCommission,
            titleKey: "totalAppCommission.title",
            descriptionKey: "totalAppCommission.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.orderDiscountsTotal,
            titleKey: "orderDiscountsTotal.title",
            descriptionKey: "orderDiscountsTotal.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.totalOtherTransactions,
            titleKey: "totalOtherTransactions.title",
            descriptionKey: "totalOtherTransactions.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.totalFinalAmount,
            titleKey: "totalFinalAmount.title",
            descriptionKey: "totalFinalAmount.description",
          }),
          {
            Icon: <Receipt className="h-4 w-4" />,
            label: tHeaders("app_commession"),
          },
        ]
      : []),

    ...(role === "DELIVERY"
      ? [
          {
            Icon: <CircleAlert className="h-4 w-4" />,
            label: tHeaders("deliveryType"),
          },
          {
            Icon: <MdManageAccounts className="h-4 w-4" />,
            label: tHeaders("deliveryManager"),
          },
          HeaderWithTooltip({
            icon: headerIcons.ordersTotalIncome,
            titleKey: "delivery.ordersTotalIncome.title",
            descriptionKey: "delivery.ordersTotalIncome.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.shippingDiscountsTotal,
            titleKey: "delivery.shippingDiscountsTotal.title",
            descriptionKey: "delivery.shippingDiscountsTotal.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.orderDiscountsTotal,
            titleKey: "delivery.orderDiscountsTotal.title",
            descriptionKey: "delivery.orderDiscountsTotal.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.totalAppCommission,
            titleKey: "delivery.totalAppCommission.title",
            descriptionKey: "delivery.totalAppCommission.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.totalOtherTransactions,
            titleKey: "delivery.totalOtherTransactions.title",
            descriptionKey: "delivery.totalOtherTransactions.description",
          }),
          HeaderWithTooltip({
            icon: headerIcons.totalFinalAmount,
            titleKey: "delivery.totalFinalAmount.title",
            descriptionKey: "delivery.totalFinalAmount.description",
          }),
          {
            Icon: <Receipt className="h-4 w-4" />,
            label: tHeaders("app_commession"),
          },
        ]
      : []),
    { Icon: <Phone className="h-4 w-4" />, label: tHeaders("statusBlocked") },
    { Icon: <Phone className="h-4 w-4" />, label: tHeaders("phone") },

    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("createdAt") },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Users className="h-5 w-5 text-primary" />}
          title={config?.title}
          headers={TABLE_HEADERS}
          actionButton={
            <ResponsiveModal
              trigger={
                canCreate(config?.permission ?? "") ? (
                  <Button variant="premium">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>{config?.createLabel}</span>
                  </Button>
                ) : null
              }
              title={config?.createLabel}
              description={config?.description}
              open={addUserModalOpen}
              onOpenChange={setAddUserModalOpen}
              maxWidth="2xl"
              height="auto"
            >
              <AddUserForm
                onSuccess={() => setAddUserModalOpen(false)}
                configTranslate={config || {}}
              />
            </ResponsiveModal>
          }
          data={users?.data || []}
          isPending={isPending}
          caption={config?.caption}
          paginationProps={
            users?.data?.length
              ? {
                  name: "users",
                  totalItems: users?.total || 0,
                  totalPages: users?.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          renderRow={(user) => (
            <UserRowTable
              key={user.id}
              data={user}
              permissionKey={config!.permission}
              configTranslate={config || {}}
            />
          )}
        />
      </div>
    </div>
  );
}

export default UserTable;
