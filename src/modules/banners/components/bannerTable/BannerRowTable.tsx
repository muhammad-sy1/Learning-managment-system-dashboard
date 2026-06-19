import { SafeImage } from "@/components/SafeImage";
import { SafeVideo } from "@/components/SafeVideo";
import { TableCell } from "@/components/ui/table";
import { getFileType } from "@/utils/fileType";
import { formatUtcToLocal } from "@/utils/formatDate";
import Link from "next/link";
import { IBanner } from "../../types/banner";
import BannerTableActions from "./BannerTableActions";

export default function BannerRowTable({
  data,
  bannerType,
}: {
  data: IBanner;
  bannerType: string;
}) {
  const file = getFileType(data.file);
  // console.log("file type", file);
  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell>
        <BannerTableActions data={data} bannerType={bannerType} />
      </TableCell>
      <TableCell className="font-medium relative">
        <div className="flex justify-center items-center">
          <div className="relative   h-14 w-14   rounded-full ">
            {file === "video" ? (
              <SafeVideo videoUrl={data.file} alt={`Banner ${data.id}`} />
            ) : (
              <SafeImage imageUrl={data.file} alt={`Banner ${data.id}`} />
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{data.show_time} sec</TableCell>
      <TableCell className="">
        {" "}
        <Link
          target="_blank"
          className="hover:text-blue-500   max-w-[270px] truncate inline-block align-middle "
          href={data.url ?? "#"}
        >
          {data.url ?? "__"}
        </Link>
      </TableCell>
      <TableCell>{formatUtcToLocal(data.created_at)}</TableCell>
      <TableCell>{formatUtcToLocal(data.expires_at)}</TableCell>
    </>
  );
}
