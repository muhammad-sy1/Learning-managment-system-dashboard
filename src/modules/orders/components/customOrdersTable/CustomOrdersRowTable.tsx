import NavLink from "@/components/NavLink";
import { TableCell } from "@/components/ui/table";
import { formatDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { useTranslations } from "next-intl";
import { IOrder } from "../../types/orders";
import OrdersTableActions from "./CustomOrdersTableActions";

export default function CustomOrdersRowTable({
  data,
}: {
  data: IOrder & { onUpdated?: () => void };
}) {
  const fullName = `${data?.user?.first_name ?? "-"} ${
    data?.user?.last_name ?? ""
  }`;
  const t = useTranslations("Dashboard.OrdersPage");
  const getStatusText = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return t("statuses.processing");
      case "COMPLETED":
        return t("statuses.completed");
      case "DELEVIRING":
        return t("statuses.dilivering");
      case "CANCELED":
        return t("statuses.canceled");
      default:
        return status;
    }
  };
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <OrdersTableActions {...data} />
      </TableCell>
      <TableCell className="font-medium ">
        {data.user ? (
          <NavLink
            className="hover:text-blue-500"
            href={`/dashboard/users?role=CLIENT&id=${data.user.id}`}
          >
            {fullName}
          </NavLink>
        ) : (
          t("messages.deleted_user")
        )}
      </TableCell>
      {/* <TableCell>
        {formatPrice(
          Number(data.total_price) +
            Number(data.shipping_discount_amount) +
            Number(data.discount_amount),
        )}
      </TableCell> */}

      <TableCell>{formatPrice(data.shipping_discount_amount)}</TableCell>
      {/* <TableCell>{formatPrice(data.discount_amount)}</TableCell> */}
      <TableCell>
        {formatPrice(data.shipping_cost)}
      </TableCell>
      {/* <TableCell>{formatPrice(data.total_price)}</TableCell> */}
        {/* <TableCell>
          {formatPrice(data.total_price + data.shipping_cost)}
        </TableCell> */}

      <TableCell>{formatDate(data.created_at)}</TableCell>
      <TableCell>{getStatusText(data.status)}</TableCell>
    </>
  );
}
