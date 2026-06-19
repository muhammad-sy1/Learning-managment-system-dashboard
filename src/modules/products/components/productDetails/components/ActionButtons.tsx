import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useDeleteProduct from "../../../hooks/useDeleteProduct";
import { IProduct } from "../../../types/products";
import EditProductForm from "../../productsTable/EditProductForm";

interface ActionButtonsProps {
  product: IProduct;
}

export function ActionButtons({ product }: ActionButtonsProps) {
  const t = useTranslations("Dashboard.ProductPage");
  const tP = useTranslations("DeleteConfirmation");
  const { mutate } = useDeleteProduct();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="space-y-2 pt-2">
      <div className="grid grid-cols-2 gap-2">
        <ResponsiveModal
          trigger={
            <Button variant="outline" size="sm" title={t("actions.edit")}>
              <p>{t("actions.edit")}</p>
              <Edit className="h-4 w-4" />
            </Button>
          }
          tooltipContent={t("actions.update")}
          title={t("actions.update")}
          maxWidth="lg"
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <EditProductForm
            product={product}
            onSuccess={() => setIsEditOpen(false)}
          />
        </ResponsiveModal>

        <AreYouSureDeleteing
          TriggerButton={
            <Button variant="destructive" size="sm" title={t("title")}>
              <p>{t("actions.delete")}</p>
              <Trash2 className="h-4 w-4" />
            </Button>
          }
          title={t("actions.delete")}
          description={tP("description")}
          onAccept={() => mutate(product.id)}
        />
      </div>
    </div>
  );
}
