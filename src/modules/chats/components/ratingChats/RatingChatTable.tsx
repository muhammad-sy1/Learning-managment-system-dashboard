"use client"; 
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Calendar, MessageSquare, Star, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetRatings } from "../../hooks/useGetRatings";
import RatingRowTable from "./RatingRowTable";

function RatingChatTable() {
  const { data: ratingsData, isPending } = useGetRatings();
  const t = useTranslations("Dashboard.RatingsPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
    {
      Icon: <MessageSquare className="h-4 w-4" />,
      label: tHeaders("id"),
    },
    {
      Icon: <User className="h-4 w-4" />,
      label: tHeaders("user"),
    },
    {
      Icon: <Star className="h-4 w-4" />,
      label: tHeaders("rating"),
    },
    {
      Icon: <MessageSquare className="h-4 w-4" />,
      label: tHeaders("comment"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("createdAt"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("closedAt"),
    },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("conversation"),
    },
  ];

  const ratings = ratingsData?.data.ratings.data || [];
  const paginationInfo = ratingsData?.data.ratings;

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<Star className="h-5 w-5 text-primary" />}
          description={t("description")}
          title={t("title")}
          headers={TABLE_HEADERS}
          data={ratings}
          isPending={isPending}
          // caption={t("tableCaption")}
          actionButton={null}
          paginationProps={
            ratings.length > 0 && paginationInfo
              ? {
                  name: "ratings",
                  totalItems: paginationInfo.total || 0,
                  totalPages: paginationInfo.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          className=""
          renderRow={(rating) => (
            <RatingRowTable key={rating.id} data={rating} />
          )}
        />
      </div>
    </div>
  );
}

export default RatingChatTable;
