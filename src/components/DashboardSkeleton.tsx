import { FileText, Filter, Search } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />{" "}
            {/* Icon placeholder */}
            <div>
              <Skeleton className="h-8 w-48" /> {/* Title */}
              <Skeleton className="h-4 w-64 mt-1" /> {/* Description */}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" /> {/* Secondary button */}
          <Skeleton className="h-10 w-28" /> {/* Primary button */}
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Skeleton className="h-10 w-full pl-10" />
          </div>

          {/* Filter Controls */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-10 w-32" /> {/* Filter dropdown */}
            </div>
            <Skeleton className="h-10 w-28" /> {/* Date range */}
            <Skeleton className="h-10 w-24" /> {/* Clear filters */}
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" /> {/* Stat label */}
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
            </div>
            <Skeleton className="h-8 w-16 mt-2" /> {/* Stat value */}
            <Skeleton className="h-3 w-32 mt-1" /> {/* Stat description */}
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="rounded-lg border bg-card">
          {/* Table Header */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-5 gap-4 font-medium text-muted-foreground">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" /> {/* Column header */}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" /> {/* Actions header */}
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0"
              >
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4 w-32" />
                ))}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />{" "}
                  {/* Action button */}
                  <Skeleton className="h-8 w-8 rounded-md" />{" "}
                  {/* Action button */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Footer - Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-4 w-40" /> {/* Showing X of Y results */}
          <div className="flex items-center gap-2">
            {/* Pagination Controls */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Previous */}
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Next */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" /> {/* Rows per page label */}
            <Skeleton className="h-8 w-16 rounded-md" />{" "}
            {/* Rows per page select */}
          </div>
        </div>
      </div>
    </div>
  );
}
