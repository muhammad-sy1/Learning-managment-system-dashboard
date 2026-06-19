import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IProduct } from "../../../types/products";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import { ActionButtons } from "./ActionButtons";
import PriceSection from "./PriceSection";

interface ProductInfoProps {
  product: IProduct;
  selectedSize: string;
  selectedColor: string;
  onSizeSelect: (size: string) => void;
  onColorSelect: (index: number, color: string) => void;
  isLogs?: boolean;
}

type ProductPageTranslations = ReturnType<typeof useTranslations>;

interface ProductSummarySectionProps {
  name: string;
  description: string;
  t: ProductPageTranslations;
}

interface SizesSectionProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  t: ProductPageTranslations;
}

interface ColorImageOption {
  image: IProduct["images"][number];
  index: number;
}

interface ColorsSectionProps {
  images: ColorImageOption[];
  selectedColor: string;
  onColorSelect: (index: number, color: string) => void;
  t: ProductPageTranslations;
}

export function ProductInfoSection({
  product,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
  isLogs,
}: ProductInfoProps) {
  const t = useTranslations("Dashboard.ProductPage");
  const sizes = product?.sizes?.split(";").filter(Boolean) || [];
  const seenColors = new Set<string>();
  const colorImages = product.images.reduce<ColorImageOption[]>(
    (acc, image, index) => {
      const normalizedColor = image.color?.trim().toLowerCase();

      if (!normalizedColor || seenColors.has(normalizedColor)) {
        return acc;
      }

      seenColors.add(normalizedColor);
      acc.push({ image, index });

      return acc;
    },
    [],
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge
          variant={
            product.status.toLowerCase() as "pending" | "rejected" | "approved"
          }
        >
          {getStatusIcon(product.status)}
          {t(`statuses.${product.status.toLowerCase()}`)}
        </Badge>
        <Badge variant="secondary">{product.section.name}</Badge>
      </div>

      <ProductSummarySection
        name={product.name}
        description={product.description}
        t={t}
      />

      <PriceSection product={product} t={t} />

      {sizes.length > 0 && (
        <SizesSection
          sizes={sizes}
          selectedSize={selectedSize}
          onSizeSelect={onSizeSelect}
          t={t}
        />
      )}

      {colorImages.length > 0 && (
        <ColorsSection
          images={colorImages}
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
          t={t}
        />
      )}

      {!isLogs && <ActionButtons product={product} />}
    </div>
  );
}

function ProductSummarySection({
  name,
  description,
  t,
}: ProductSummarySectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold mb-2">{t("fields.name")}</h3>
        <p className="text-lg font-semibold leading-relaxed text-pretty">
          {name || "-"}
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">{t("fields.description")}</h3>
        <p className="text-muted-foreground leading-relaxed text-pretty text-sm">
          {description || "-"}
        </p>
      </div>
    </div>
  );
}

function SizesSection({
  sizes,
  selectedSize,
  onSizeSelect,
  t,
}: SizesSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{t("sections.availableSizes")}</h3>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size: string) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSizeSelect(size)}
            className="min-w-10 h-8"
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ColorsSection({
  images,
  selectedColor,
  onColorSelect,
  t,
}: ColorsSectionProps) {
  return (
    <div>
      <div className="font-semibold mb-2">{t("sections.availableColors")}</div>
      <div className="flex gap-2">
        {images.map(({ image, index }) => (
          <button
            key={index}
            onClick={() => onColorSelect(index, image.color || "")}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              selectedColor === image.color
                ? "border-primary ring-2 ring-primary/20 scale-110"
                : "border-border hover:border-primary/50"
            }`}
            style={{ backgroundColor: `#${image.color}` }}
          />
        ))}
      </div>
    </div>
  );
}
