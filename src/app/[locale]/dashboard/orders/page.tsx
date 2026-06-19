"use client";
import CustomOrdersTable from "@/modules/orders/components/customOrdersTable/CustomOrdersTable";
import OrdersFilters from "@/modules/orders/components/filters/OrdersFilters";
import OrdersTable from "@/modules/orders/components/ordersTable/OrdersTable";
import { useSearchParams } from "next/navigation";

const OrdersPage = () => {
  const searchParams = useSearchParams();
  const types = searchParams.get("types");

  if (types === "CUSTOM") {
    return (
      <div className="space-y-6">
        <OrdersFilters />
        <CustomOrdersTable />
      </div>
    );
  }

  if (types === "RESTURANT,MARKET") {
    return (
      <div className="space-y-6">
        <OrdersFilters />
        <OrdersTable />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrdersFilters />
      <OrdersTable />
    </div>
  );
};

export default OrdersPage;
