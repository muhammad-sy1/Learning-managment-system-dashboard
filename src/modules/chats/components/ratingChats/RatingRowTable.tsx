import NavLink from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { formatDate, formatUtcToLocal } from "@/utils/formatDate";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { IReview } from "../../types/chats";
import CommentCell from "./CommentCell";

interface RatingRowTableProps {
  data: IReview;
}

export default function RatingRowTable({ data }: RatingRowTableProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center   justify-center ">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="mx-2 text-sm">({rating})</span>
      </div>
    );
  };

  const t = useTranslations("Dashboard.RatingsPage");

  return (
    <>
      <TableCell className="py-3">{data.id}</TableCell>
      <TableCell className="font-medium">
        {data.conversation.user ? (
          <NavLink
            href={`/dashboard/users?role=CLIENT&id=${data.conversation.user?.id}`}
            className="hover:text-blue-500 "
          >
            {data.conversation.user?.first_name +
              data.conversation.user?.last_name}
          </NavLink>
        ) : (
          <span className="text-red-400">{t("userNotFound")} </span>
        )}

        <br />
        <span className="text-sm text-muted-foreground">
          {data.conversation?.user?.email || ""}
        </span>
      </TableCell>
      <TableCell>{renderStars(data.rating)}</TableCell>
      <TableCell>
        <CommentCell comment={data.comment} />
      </TableCell>
      <TableCell>{formatUtcToLocal(data.created_at)}</TableCell>
      <TableCell>
        {data?.conversation?.closed_at
          ? formatUtcToLocal(data?.conversation?.closed_at)
          : "--"}
      </TableCell>
      <TableCell>
        <NavLink
          href={`/dashboard/messages?conversation=${data.conversation.id}`}
        >
          <Button variant="outline" size="sm" className="mb-2 w-full md:w-auto">
            {t("actions.view")}
          </Button>
        </NavLink>
      </TableCell>
    </>
  );
}
