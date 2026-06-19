export const getFieldLabel = (field: string, t?: any): string => {
  if (t) {
    const labels: Record<string, string> = {
      quantity: t("quantity"),
      returned_quantity: t("returnedQuantity"),
      purchase_price: t("price"),
      total_price: t("totalPrice"),
      app_commession: t("commission"),
      size: t("size"),
      color: t("color"),
      product_name: t("product"),
      order_item_id: t("itemId"),
      product_id: t("productId"),
      notes: t("notes"),
      status: t("status"),
    };
    return labels[field] || field;
  }

  const labels: Record<string, string> = {
    quantity: "الكمية",
    returned_quantity: "الكمية المرتجعة",
    purchase_price: "سعر الشراء",
    total_price: "السعر الإجمالي",
    app_commession: "عمولة التطبيق",
    size: "المقاس",
    color: "اللون",
    product_name: "اسم المنتج",
    order_item_id: "رقم العنصر",
    product_id: "رقم المنتج",
    notes: "ملاحظات",
    status: "الحالة",
  };

  return labels[field] || field;
};

export const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === "") return "--";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export const extractChanges = (changes: any) => {
  if (!changes || (Array.isArray(changes) && changes.length === 0)) {
    return { oldValues: {}, newValues: {} };
  }

  if (changes.old && changes.new) {
    return { oldValues: changes.old, newValues: changes.new };
  }

  return { oldValues: changes.old || {}, newValues: changes };
};
