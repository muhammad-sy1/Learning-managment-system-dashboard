import SectionsFilters from "@/modules/sections/components/filters/SectionsFilters";
import SectionsTable from "@/modules/sections/components/sectionsTable/SectionsTable";

export default function ProvincePage() {
  return (
    <div className="space-y-6">
      <SectionsFilters />

      <SectionsTable type="CATIGORIES" />
    </div>
  );
}
