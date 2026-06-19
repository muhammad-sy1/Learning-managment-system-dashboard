import ZoneFilters from "@/modules/provinces/components/filters/ZoneFilters";
import ZonesTable from "@/modules/provinces/components/zonesTable/ZonesTable";


export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <ZoneFilters />
      <ZonesTable />
    </div>
  );
}
