import { SafeImage } from "@/components/SafeImage";
import { TableCell } from "@/components/ui/table";
import { IFinancialSection } from "../../types/fainancial";
import SectionTableActions from "./FinancialTableActions";

export default function FinancialRowTable({
  data,
  sectionType,
  parent_section,
  permissionKey,
}: {
  data: IFinancialSection;
  sectionType: string;
  parent_section?: IFinancialSection;
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
      <TableCell className="font-medium">{data.name}</TableCell>
      <TableCell className="font-medium flex justify-center items-center  gap-3">
        <div className="flex justify-center w-28 items-center">
          <div className="relative   h-12 w-12 rounded-full ">
            <SafeImage
              imageUrl={data.image}
              alt={data.name}
              className="h-12 w-12 rounded-full"
            />
          </div>
        
        </div>
      </TableCell>
      {/* <TableCell>{data.children?.length || 0} subsections</TableCell> */}
      <TableCell>{new Date(data.created_at).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(data.updated_at).toLocaleDateString()}</TableCell>
    </>
  );
}
