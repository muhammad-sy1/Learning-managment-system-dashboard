import ProductsFilters from "@/modules/products/components/filters/ProductsFilters";
import ProductsTable from "@/modules/products/components/productsTable/ProductsTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <ProductsFilters />
      <ProductsTable />
    </div>
  );
}
