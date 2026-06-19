import ApplicationsTable from "@/modules/join-applications/components/applications-table/ApplicationsTable";
import ApplicationsFilters from "@/modules/join-applications/components/filters/ApplicationsFilters";

export default function JoinApplicationsPage() {
  return (
    <div className="space-y-6">
      <ApplicationsFilters />

      <ApplicationsTable />
    </div>
  );
}
