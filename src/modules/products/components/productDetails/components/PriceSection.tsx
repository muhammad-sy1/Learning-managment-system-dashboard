import React from "react";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/modules/products/types/products";

type CurrencyCode = "SYP" | "USD";

function parseAmount(value?: string | number | null) {
  if (value == null || value === "") {
    return null;
  }

  const numericValue = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null;
  }

  return numericValue;
}

function formatCurrencyValue(value: number, currency: CurrencyCode) {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-SY", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getPriceBlock({
  currentCandidate,
  baseCandidate,
  currency,
}: {
  currentCandidate?: string | number | null;
  baseCandidate?: string | number | null;
  currency: CurrencyCode;
}) {
  const candidateCurrent = parseAmount(currentCandidate);
  const candidateBase = parseAmount(baseCandidate);
  const hasDiscount =
    candidateCurrent !== null &&
    candidateBase !== null &&
    candidateCurrent < candidateBase;
  const current = hasDiscount
    ? candidateCurrent
    : candidateCurrent ?? candidateBase;

  if (current === null) {
    return null;
  }

  const previous = hasDiscount ? candidateBase : null;
  const discountPercentage =
    hasDiscount && candidateBase
      ? Math.round(((candidateBase - candidateCurrent) / candidateBase) * 100)
      : null;

  return {
    currency,
    current: formatCurrencyValue(current, currency),
    previous:
      previous !== null ? formatCurrencyValue(previous, currency) : null,
    discountPercentage,
  };
}

export default function PriceSection({
  product = {} as IProduct,
  t,
}: {
  product?: IProduct;
  t?: (key: string) => string;
}) {
  const priceBlocks = [
    getPriceBlock({
      currentCandidate: product.new_price,
      baseCandidate: product.main_price,
      currency: "SYP",
    }),
    getPriceBlock({
      currentCandidate: product.new_price_usd,
      baseCandidate: product.main_price_usd,
      currency: "USD",
    }),
  ].filter(Boolean) as Array<{
    currency: CurrencyCode;
    current: string;
    previous: string | null;
    discountPercentage: number | null;
  }>;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {priceBlocks.map((priceBlock) => (
          <div
            key={priceBlock.currency}
            className="rounded-2xl border border-border/50 bg-muted/20 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {priceBlock.currency}
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-primary">
                    {priceBlock.current}
                  </span>
                </div>
                {priceBlock.previous && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="line-through">{priceBlock.previous}</span>
                    {priceBlock.discountPercentage ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                        -{priceBlock.discountPercentage}%
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0">
                {priceBlock.currency}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {t?.("sections.vatIncluded") ?? ""}
      </p>
    </div>
  );
}
