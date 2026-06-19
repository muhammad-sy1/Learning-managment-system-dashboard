import { SafeImage } from "@/components/SafeImage";
import { TableCell } from "@/components/ui/table";
import { ISection } from "../../types/section";
import SectionTableActions from "./SectionTableActions";
import { formatDate } from "@/utils/formatDate";

export default function SectionRowTable({
  data,
  sectionType,
  parent_section,
  permissionKey,
}: {
  data: ISection;
  sectionType: string;
  parent_section?: ISection;
  permissionKey: string;
}) {
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <SectionTableActions
          sectionType={sectionType}
          parent_section={parent_section}
          permissionKey={permissionKey}
          {...data}
        />
      </TableCell>
      <TableCell className="font-medium flex justify-center items-center     gap-3">
        <div className="flex justify-center  w-32 items-center">
          <div className="relative   h-12 w-12 rounded-full ">
            <SafeImage
              imageUrl={data.image}
              alt={data.name}
              className="h-12 w-12 rounded-full"
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="">{data.name}</TableCell>

      {/* <TableCell>{data.children?.length || 0} subsections</TableCell> */}
      <TableCell>
        {formatDate(data.created_at)}
      </TableCell>
      <TableCell>
        {formatDate(data.updated_at)}
      </TableCell>
    </>
  );
}
