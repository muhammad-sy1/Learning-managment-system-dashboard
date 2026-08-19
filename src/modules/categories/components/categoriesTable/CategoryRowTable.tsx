import { TableCell } from "@/components/ui/table";
import { ICategory } from "../../types/category";
import CategoryTableActions from "./CategoryTableActions";
import { formatDate } from "@/utils/formatDate";

export default function CategoryRowTable({ data }: { data: ICategory }) {
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <CategoryTableActions {...data} />
      </TableCell>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.student_type}</TableCell>
      <TableCell>{data.parent?.name || "-"}</TableCell>
      <TableCell>{data.is_active ? "Active" : "Inactive"}</TableCell>
      <TableCell>{formatDate(data.created_at)}</TableCell>
      <TableCell>{formatDate(data.updated_at)}</TableCell>
    </>
  );
}
