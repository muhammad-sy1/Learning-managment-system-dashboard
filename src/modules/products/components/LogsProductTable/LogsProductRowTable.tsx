"use client";
import NavLink from "@/components/NavLink";
import { TableCell } from "@/components/ui/table";
import CommentCell from "@/modules/chats/components/ratingChats/CommentCell";
import { formatDate } from "@/utils/formatDate";
import { useTranslations } from "next-intl";
import { IProductLogs } from "../../types/productLogs";
import LogsProductTableActions from "./LogsProductTableActions";

interface LogsProductRowTableProps {
  data: IProductLogs;
}

export default function LogsProductRowTable({
  data,
}: LogsProductRowTableProps) {
  const t = useTranslations("Dashboard.ProductPage.logs");

  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <LogsProductTableActions data={data} />
      </TableCell>
      <TableCell className="font-medium">
        {data.user ? (
          <NavLink
            className="hover:text-blue-500"
            href={`/dashboard/users?role=CLIENT&id=${data.user.id}`}
          >
            {data.user.first_name ?? "-"} {data.user.last_name ?? ""}
          </NavLink>
        ) : (
          t("deleted_user")
        )}
      </TableCell>
      <TableCell>
        {t(`actions.${data.action}`, { defaultValue: data.action })}
      </TableCell>
    
      <TableCell>
        <CommentCell comment={data.summary ?? "-"} />
      </TableCell>
      <TableCell>{formatDate(data.created_at)}</TableCell>
    </>
  );
}
