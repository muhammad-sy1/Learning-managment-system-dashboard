"use client";
import { TableCell } from "@/components/ui/table";
import { ImageGalleryTableCell } from "../../../../components/ImageGalleryTableCell";
import { IProduct } from "../../types/products";
import ProductCategoryInlineEditor from "./ProductCategoryInlineEditor";
import ProductTableActions from "./ProductTableActions";
import { useTranslations } from "next-intl";

interface ProductTableActionsProps {
  data: IProduct;
  isSubProduct: boolean;
  productPermessions: string;
}

const formatPrice = (price: number | string) => {
  const numericPrice = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat("en-SY", {
    style: "currency",
    currency: "SYP",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

export default function ProductRowTable({
  data,
  productPermessions,
  isSubProduct,
}: ProductTableActionsProps) {
  const t = useTranslations("Dashboard.ProductPage");
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <ProductTableActions
          data={data}
          productPermessions={productPermessions}
          isSubProduct={isSubProduct}
        />
      </TableCell>

      {!isSubProduct && (
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <ImageGalleryTableCell
              data={data}
              alt={data.name}
              size="md"
              maxDisplay={3}
            />
          </div>
        </TableCell>
      )}

      <TableCell className="font-medium">{data.name}</TableCell>
      <TableCell className="py-4 min-w-[180px]">
        <ProductCategoryInlineEditor
          product={data}
          productPermessions={productPermessions}
          field="category"
          label={t("fields.category")}
        />
      </TableCell>
      <TableCell className="py-4 min-w-[180px]">
        <ProductCategoryInlineEditor
          product={data}
          productPermessions={productPermessions}
          field="subcategory"
          label={t("fields.subSection")}
        />
      </TableCell>
      <TableCell>{formatPrice(data.main_price)}</TableCell>
      <TableCell>{formatPrice(data.new_price)}</TableCell>
      <TableCell>{data.is_hidden === 1 ? t("hidden") : t("visible")}</TableCell>
      <TableCell>{new Date(data.created_at).toLocaleDateString()}</TableCell>
    </>
  );
}
