import UsersFilters from "@/modules/users/components/filters/UsersFilters";
import UserTable from "@/modules/users/components/usersTable/UserTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <UsersFilters />
      <UserTable />
    </div>
  );
}
