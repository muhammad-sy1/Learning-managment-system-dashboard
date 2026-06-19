"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IProduct } from "../../types/products";
import { ProductImagesSection } from "./components/ProductImagesSection";
import ProductInfoCards from "./components/ProductInfoCards";
import { ProductInfoSection } from "./components/ProductInfoSection";

interface ProductDialogProps {
  product: IProduct;
  isLogs?: boolean;
}

export function ProductDetails({ product, isLogs }: ProductDialogProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState(
    product.images[0]?.color || "",
  );
  const t = useTranslations("Dashboard.ProductPage");

  return (
    <div className="mt-2">
      <div className="flex items-center justify-center ">
        <div>
          <p className="text-muted-foreground text-center mx-auto ">
            {t("fields.productId")}: #{product.id}
          </p>
        </div>
      </div>

      <ScrollArea>
        <div className="p-6 pt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Images */}
            <ProductImagesSection
              product={product}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={(index, color) => {
                setSelectedImageIndex(index);
                setSelectedColor(color);
              }}
            />

            {/* Product Information */}
            <ProductInfoSection
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeSelect={setSelectedSize}
              onColorSelect={(index, color) => {
                setSelectedImageIndex(index);
                setSelectedColor(color);
              }}
              isLogs={isLogs}
            />
          </div>

          {/* Additional Information Cards */}
          <ProductInfoCards product={product} />
        </div>
      </ScrollArea>
    </div>
  );
}
