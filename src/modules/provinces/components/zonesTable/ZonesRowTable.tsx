import { TableCell } from "@/components/ui/table";
import { formatDate } from "@/utils/formatDate";
import { IZone } from "../../types/zone";
import ZoneTableActions from "./ZoneTableActions";

export default function ZonesRowTable({ data }: { data: IZone }) {
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <ZoneTableActions {...data} />
      </TableCell>
      <TableCell className="font-medium">{data.name}</TableCell>

      <TableCell>{formatDate(data.created_at)}</TableCell>
    </>
  );
}
