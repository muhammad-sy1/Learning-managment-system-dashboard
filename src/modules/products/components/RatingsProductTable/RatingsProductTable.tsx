"use client";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Calendar, IdCard, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useGetRatingsProducts } from "../../hooks/useGetRatingsProducts";
import RatingsProductRowTable from "./RatingsProductRowTable";

export default function RatingsProductTable() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const id = searchParams.get("id");
  const { data: ratingsResponse, isPending } = useGetRatingsProducts(
    productId,
    id
  );
  const isSubProduct = Boolean(searchParams.get("parent_id"));
  const t = useTranslations("Dashboard.ProductPage.ratings");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const TABLE_HEADERS = [
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("user") },
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("rating") },
    { Icon: <IdCard className="h-4 w-4" />, label: tHeaders("comment") },
    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("createdAt") },
  ];

  const ratingsData = ratingsResponse?.data || [];

  return (
    <div className="space-y-6">
      <ReusableTable
        title={t("title")}
        titleIcon={<IdCard className="h-4 w-4" />}
        actionButton={null}
        headers={TABLE_HEADERS}
        data={ratingsData}
        isPending={isPending}
        paginationProps={
          ratingsResponse?.data
            ? {
                name: "ratings",
                totalItems: ratingsResponse.data.length || 0,
                totalPages: ratingsResponse.last_page || 1,
              }
            : undefined
        }
        density="md"
        height={64}
        renderRow={(rating) => (
          <RatingsProductRowTable
            key={rating.id}
            data={rating}
            isSubProduct={isSubProduct}
          />
        )}
      />
    </div>
  );
}
