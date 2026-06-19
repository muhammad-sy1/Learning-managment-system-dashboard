import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IProduct } from "../../../types/products";
import { resolveProductMediaUrl } from "../../../utils/productMedia";

interface ProductImagesProps {
  product: IProduct;
  selectedImageIndex: number;
  onImageSelect: (index: number, color: string) => void;
}

export function ProductImagesSection({
  product,
  selectedImageIndex,
  onImageSelect,
}: ProductImagesProps) {
  const t = useTranslations("Dashboard.ProductPage");
  const hasDiscount = product.has_offer === 1;
  const selectedImageUrl = resolveProductMediaUrl(
    product.images[selectedImageIndex]?.image,
  );

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square relative bg-muted">
            <Image
              src={selectedImageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {hasDiscount && (
              <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                {t("sections.discount")}{" "}
                {Math.round(
                  ((Number.parseFloat(String(product.main_price)) -
                    Number.parseFloat(String(product.new_price))) /
                    Number.parseFloat(String(product.main_price))) *
                    100
                )}
                %
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index, image.color || "")}
            className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all ${
              selectedImageIndex === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Image
              src={resolveProductMediaUrl(image.image) || "/images/imgPlaceholder.png"}
              alt={`${product.name} - Color ${image.color}`}
              fill
              className="object-cover"
            />
            {image.color ? (
              <div
                className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-white"
                style={{ backgroundColor: `#${image.color}` }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
