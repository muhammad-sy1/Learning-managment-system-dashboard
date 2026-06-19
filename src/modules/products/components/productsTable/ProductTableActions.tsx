"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import NavLink from "@/components/NavLink";
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
import { usePermissionStore } from "@/hooks/usePermissionStore";
import {
  BadgeCheck,
  CheckCircle2,
  Edit,
  Eye,
  History,
  Layers,
  MoreHorizontal,
  PlusIcon,
  StarIcon,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useDeleteProduct from "../../hooks/useDeleteProduct";
import useToggleFinalReviewProduct from "../../hooks/useToggleFinalReviewProduct";
import { IProduct } from "../../types/products";
import { ProductDetails } from "../productDetails/ProductDetails";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import ProductStatusForm from "./ProductStatusForm";

interface ProductTableActionsProps {
  data: IProduct;
  isSubProduct: boolean;
  productPermessions: string;
  preventParentClick?: boolean;
}

const ProductTableActions = ({
  data,
  isSubProduct,
  productPermessions,
  preventParentClick = false,
}: ProductTableActionsProps) => {
  const { mutate } = useDeleteProduct();
  const { mutate: toggleFinalReview, isPending: isToggleFinalReviewing } =
    useToggleFinalReviewProduct();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [addSupProductModalOpen, setAddSupProductModalOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const { canView, canUpdate, canCreate, canDelete, hasPermission } =
    usePermissionStore();
  const t = useTranslations("DeleteConfirmation");
  const tP = useTranslations("Dashboard.ProductPage");

  const canManageStatus = hasPermission(`${productPermessions}.manage-status`);
  const canViewProductDetails = canView(productPermessions);
  const canUpdateProduct = canUpdate(productPermessions);
  const canCreateSubProducts = !isSubProduct && canCreate("sub-products");
  const canViewSubProducts = !isSubProduct && canView("sub-products");
  const canViewRatings = !isSubProduct && canView("rating-products");
  const canViewLogs = canView("products-logs");
  const canDeleteProduct = canDelete(productPermessions);
  const isFinalReviewed = Number(data.is_final_reviewed) === 1;

  const hasDropdownActions =
    canViewProductDetails ||
    canUpdateProduct ||
    canCreateSubProducts ||
    canViewSubProducts ||
    canViewRatings ||
    canViewLogs ||
    canDeleteProduct;

  const stopParentClick = (event: React.SyntheticEvent) => {
    if (preventParentClick) {
      event.stopPropagation();
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-2"
      onClick={stopParentClick}
      onKeyDown={stopParentClick}
      onMouseDown={stopParentClick}
    >
      {canManageStatus && (
        <>
          <ResponsiveModal
            trigger={
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                {data.status === "APPROVED" ? (
                  <BadgeCheck className="h-4 w-4 fill-green-500 text-white" />
                ) : (
                  <BadgeCheck className="h-4 w-4" />
                )}
              </Button>
            }
            title={tP("updateStutus")}
            maxWidth="lg"
            tooltipContent={tP("actions.approvedOrRejected")}
            height="auto"
            open={isEditStatusOpen}
            onOpenChange={setIsEditStatusOpen}
          >
            <ProductStatusForm
              data={data}
              onSuccess={() => setIsEditStatusOpen(false)}
            />
          </ResponsiveModal>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0  ${
              isFinalReviewed
                ? "bg-emerald-500! text-white hover:bg-emerald-600!"
                : ""
            }`}
            onClick={() =>
              toggleFinalReview({
                id: data.id,
                is_final_reviewed: isFinalReviewed ? 0 : 1,
              })
            }
            disabled={isToggleFinalReviewing}
            title={isFinalReviewed ? "Final reviewed" : "Mark final reviewed"}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </>
      )}

      {hasDropdownActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{tP("actions.actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {canViewProductDetails && (
              <DropdownMenuItem onSelect={() => setIsProductDetailsOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>{tP("actions.view")}</span>
              </DropdownMenuItem>
            )}

            {canUpdateProduct && (
              <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>{tP("actions.update")}</span>
              </DropdownMenuItem>
            )}

            {canCreateSubProducts && (
              <DropdownMenuItem
                onSelect={() => setAddSupProductModalOpen(true)}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>{tP("addSubProduct")}</span>
              </DropdownMenuItem>
            )}

            {canViewSubProducts && (
              <DropdownMenuItem asChild>
                <NavLink
                  href={`?parent_id=${data.id}`}
                  className="flex items-center"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  <span>{tP("actions.viewSubProduct")}</span>
                </NavLink>
              </DropdownMenuItem>
            )}

            {canViewRatings && (
              <DropdownMenuItem asChild>
                <NavLink
                  href={`ratings?product_id=${data.id}`}
                  className="flex items-center"
                >
                  <StarIcon className="mr-2 h-4 w-4" />
                  <span>{tP("actions.viewStarsProduct")}</span>
                </NavLink>
              </DropdownMenuItem>
            )}

            {canViewLogs && (
              <DropdownMenuItem asChild>
                <NavLink
                  href={`logs?product_id=${data.id}`}
                  className="flex items-center"
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>{tP("actions.viewLogs")}</span>
                </NavLink>
              </DropdownMenuItem>
            )}

            {canDeleteProduct && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="p-0"
                >
                  <AreYouSureDeleteing
                    TriggerButton={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-2 py-1.5 text-sm text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{t("title")}</span>
                      </Button>
                    }
                    title={t("title")}
                    description={t("description")}
                    onAccept={() => {
                      mutate(data.id);
                    }}
                  />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {canUpdateProduct && (
        <ResponsiveModal
          title={tP("actions.update")}
          maxWidth="lg"
          trigger={null}
          height="auto"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        >
          <EditProductForm
            product={data}
            isSubProduct={isSubProduct}
            onSuccess={() => setIsEditOpen(false)}
          />
        </ResponsiveModal>
      )}

      {canCreateSubProducts && (
        <ResponsiveModal
          title={tP("addSubProduct")}
          maxWidth="lg"
          height="auto"
          trigger={null}
          open={addSupProductModalOpen}
          onOpenChange={setAddSupProductModalOpen}
        >
          <AddProductForm
            isSupProduct
            parentId={data.id}
            onSuccess={() => setAddSupProductModalOpen(false)}
          />
        </ResponsiveModal>
      )}

      {canViewProductDetails && (
        <ResponsiveModal
          title={data.name}
          maxWidth="xl"
          height="80vh"
          trigger={null}
          open={isProductDetailsOpen}
          onOpenChange={setIsProductDetailsOpen}
        >
          <ProductDetails product={data} />
        </ResponsiveModal>
      )}
    </div>
  );
};

export default ProductTableActions;
