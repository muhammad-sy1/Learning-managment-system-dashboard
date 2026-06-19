import TransactionsFilters from "@/modules/fainancial/components/filters/TransactionsFilters";
import TransactionsTable from "@/modules/fainancial/components/transactionsTable/TransactionsTable";

export default function FainancePage() {
  return (
    <div className="space-y-6">
      <TransactionsFilters />
      <TransactionsTable />
    </div>
  );
}
