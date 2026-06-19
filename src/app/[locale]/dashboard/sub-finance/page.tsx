import FaianancialsTable from "@/modules/fainancial/components/fainancialTable/FinancialsTable";
import FinancialFilters from "@/modules/fainancial/components/filters/FinancialFilters";

export default function SubfainancePage() {
  return (
    <div className="space-y-6">
      <FinancialFilters />
      <FaianancialsTable type="FINANCIAL_SUB_SECTIONS" />
    </div>
  );
}
