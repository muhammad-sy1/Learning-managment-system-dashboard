import { TransactionCurrency } from "@/modules/fainancial/types/transaction";

export const formatPrice = (
  price: number | string,
  currency: TransactionCurrency = "SYP",
) => {
  const numericPrice = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-SY", {
    style: "currency",
    currency,

    maximumFractionDigits: 20,
    useGrouping: true,
  }).format(numericPrice);
};
