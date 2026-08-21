import { SafeImage } from "@/components/SafeImage";
import { TableCell } from "@/components/ui/table";
import { formatUtcToLocal } from "@/utils/formatDate";
import UserTableActions from "./UserTableActions";
import { IUser } from "../../types/users";

export default function UserRowTable({
  data,
  configTranslate,
  mappedKey,
}: {
  data: IUser;
  mappedKey: string | undefined;
  configTranslate: Record<string, string>;
}) {
  return (
    <>
      <TableCell className=" py-3">{data.id}</TableCell>
      <TableCell>
        <UserTableActions
          data={data}
          mappedKey={mappedKey}
          configTranslate={configTranslate}
        />
      </TableCell>
      <TableCell className="font-medium flex justify-center items-center  gap-3">
        <div className="flex justify-center w-25 items-center">
          <div className="relative rounded-full ">
            <SafeImage
              imageUrl={data.name}
              alt={data.name ?? "User image"}
              className="h-10 w-10 rounded-full"
            />
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span className="truncate">{data.name}</span>
      </TableCell>

      <TableCell>{data.email}</TableCell>

      <TableCell>
        {formatUtcToLocal(data.created_at)}
      </TableCell>
    </>
  );
}
