"use client";
import NavLink from "@/components/NavLink";
import { SafeImage } from "@/components/SafeImage";
import { TableCell } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { IRating } from "../../types/ratingsProduct";
import RatingProductTableActions from "./RatingProductTableActions";
import { formatDate } from "@/utils/formatDate";

interface RatingsProductRowTableProps {
  data: IRating;
  isSubProduct: boolean;
}

export default function RatingsProductRowTable({
  data,
  isSubProduct,
}: RatingsProductRowTableProps) {
  const t = useTranslations("Dashboard.ProductPage.ratings");

  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <RatingProductTableActions data={data} isSubProduct={isSubProduct} />
      </TableCell>

      <TableCell className="font-medium">
        {data.user ? (
          <div className="flex items-center gap-2 justify-center">
            <SafeImage
              imageUrl={data.user.image}
              alt={data.user.first_name??"-"}
              className="h-10 w-10 rounded-full"
            />
            <NavLink
              className="hover:text-blue-500"
              href={`/dashboard/users?role=CLIENT&id=${data.user.id}`}
            >
              {data.user.first_name ?? "-"} {data.user.last_name ?? ""}
            </NavLink>
          </div>
        ) : (
          t("deleted_user")
        )}
      </TableCell>

      <TableCell>{data.rating}</TableCell>

      <TableCell>{data.comment}</TableCell>

      <TableCell>
        {formatDate(data.created_at)}
      </TableCell>
    </>
  );
}
