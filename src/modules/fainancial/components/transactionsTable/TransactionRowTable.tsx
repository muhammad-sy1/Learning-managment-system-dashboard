// TransactionRowTable.tsx
import { TableCell } from "@/components/ui/table";
import { formatUtcToLocal } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { ITransaction } from "../../types/transaction";
import TransactionTableActions from "./TransactionTableActions";

interface TransactionRowTableProps {
  data: ITransaction;
  permissionKey: string;
}

export default function TransactionRowTable({
  data,
  permissionKey,
}: TransactionRowTableProps) {
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <TransactionTableActions
          transaction={data}
          permissionKey={permissionKey}
        />
      </TableCell>
      <TableCell className="font-medium">
        {data?.actor
          ? `${data.actor.first_name ?? ""} ${data.actor.last_name ?? ""}`.trim()
          : "-"}
      </TableCell>

      <TableCell className="font-medium">{data.description}</TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {/* <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              data.type === "+"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.type}
          </span> */}
          {formatPrice(data.amount, data.currency ?? "SYP")}
        </div>
      </TableCell>
      <TableCell>
        {data.section?.name || `Section ${data.section_id}`}
      </TableCell>
      <TableCell>{formatUtcToLocal(data.date)}</TableCell>
      <TableCell>{formatUtcToLocal(data.created_at)}</TableCell>
    </>
  );
}
