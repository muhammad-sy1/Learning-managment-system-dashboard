import CouponsTable from "@/modules/coupons/components/couponsTable/CouponsTable";
import CouponsFilters from "@/modules/coupons/components/filters/CouponsFilters";

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <CouponsFilters />
      <CouponsTable />
    </div>
  );
}
