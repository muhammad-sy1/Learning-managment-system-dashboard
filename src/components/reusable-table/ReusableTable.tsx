"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TABLE_ROWS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AppPagination from "./AppPagination";
import TableSkeleton from "./table-skeleton";

type PaginationProps = {
  totalItems: number;
  name: string;
  totalPages: number;
};

type DensityMode = "sm" | "md";

interface ReusableTableProps<T> {
  headers: {
    Icon: React.ReactNode;
    label: string;
  }[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  isPending: boolean;
  caption?: string;
  paginationProps?: PaginationProps;
  height?: number;
  density?: DensityMode;
  titleIcon?: React.ReactNode;
  description?: string;
  title?: string;
  actionButton?: React.ReactNode;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
}

export default function ReusableTable<T>({
  headers,
  data,
  renderRow,
  isPending,
  caption,
  paginationProps,
  height = 60.89,
  title,
  titleIcon,
  description,
  actionButton,
  density = "md",
  className,
  onRowClick,
}: ReusableTableProps<T>) {
  const emptyRows = Math.max(0, TABLE_ROWS - data?.length - 9);
  const t = useTranslations("Table");

  // Density-based spacing
  const densityClasses = {
    sm: {
      headerPadding: "py-2 px-3",
      cellPadding: "py-4 px-3",
      headerText: "text-xs",
      cellText: "text-sm",
    },
    md: {
      headerPadding: "py-4 px-4",
      cellPadding: "py-4 px-4",
      headerText: "text-sm",
      cellText: "text-base",
    },
  };

  const currentDensity = densityClasses[density];

  return (
    <div
      className={cn(
        "relative overflow-hidden  mx-auto rounded-xl border bg-card shadow-sm transition-colors duration-300",
        "border-border/50 shadow-lg",
        className
      )}
    >
      {/* Table Container with Custom Scrollbar */}
      <Card className="pb-0">
        {(title || actionButton) && (
          <CardHeader className="">
            <div className="flex items-center sm:justify-between flex-wrap gap-4 justify-center">
              {title && (
                <div className="flex items-center gap-3">
                  {titleIcon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {titleIcon}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {/* {description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {description}
                      </p>
                    )} */}
                  </div>
                </div>
              )}
              {actionButton}
            </div>
          </CardHeader>
        )}

        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <Table className="">
              {caption && (
                <TableCaption className="sr-only">{caption}</TableCaption>
              )}

              {/* Enhanced Header */}
              <TableHeader>
                <TableRow className="border-b border-t border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  {headers.map((header, index) => (
                    <TableHead
                      key={`${header.label}-${index}`}
                      className={cn(
                        "text-center font-semibold text-muted-foreground  ",
                        currentDensity.headerPadding,
                        currentDensity.headerText
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-muted-foreground/80">
                          {header.Icon}
                        </span>
                        <span className="font-medium">{header.label}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {/* Enhanced Body */}
              <TableBody>
                {isPending ? (
                  <TableSkeleton
                    style={{ height }}
                    rows={10}
                    cells={headers.length}
                  />
                ) : data && data.length > 0 ? (
                  <>
                    {/* Data Rows */}
                    {data.map((item, index) => (
                      <TableRow
                        key={index}
                        onClick={() => onRowClick?.(item, index)}
                        className={cn(
                          "group text-center relative transition-all duration-200",
                          "border-b border-border/30 last:border-b-0",
                          "hover:bg-muted/50 hover:shadow-sm",
                          "focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ",
                          onRowClick && "cursor-pointer hover:scale-[1.001]"
                        )}
                        tabIndex={onRowClick ? 0 : undefined}
                        role={onRowClick ? "button" : undefined}
                      >
                        {renderRow(item, index)}
                      </TableRow>
                    ))}

                    {/* Empty Rows for Consistent Height */}
                    {Array.from({ length: emptyRows }).map((_, index) => (
                      <TableRow
                        key={`empty-${index}`}
                        className="border-b-0  border-border/20 hover:bg-transparent last:border-b-0"
                      >
                        {headers.map((_, cellIndex) => (
                          <TableCell
                            key={`empty-cell-${cellIndex}`}
                            className={cn(currentDensity.cellPadding)}
                            style={{ height }}
                          >
                            <div className="w-full h-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={headers.length}
                      className="py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                        <div className="rounded-full bg-muted p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="font-medium">{t("noDataTitle")}</p>
                          <p className="text-sm text-muted-foreground/80">
                            {t("noDataSubtitle")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {/* Enhanced Footer with Sticky Pagination */}
              {paginationProps && data && data.length > 0 && (
                <TableFooter className=" sticky    bottom-0  left-0  backdrop-blur-sm border-t">
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={headers.length} className=" px-6">
                      <div className="flex items-center justify-between">
                        <AppPagination {...paginationProps} />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10">
          <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 shadow-lg border">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("loadingData")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useTranslations } from "next-intl";
// import TableSkeleton from "./table-skeleton";
// import AppPagination from "./AppPagination";
// import { TABLE_ROWS } from "@/lib/constants";
// import { cn } from "@/lib/utils";

// type PaginationProps = {
//   totalItems: number;
//   name: string;
//   totalPages: number;
// };

// type DensityMode = "sm" | "md";

// interface ReusableTableProps<T> {
//   headers: {
//     Icon: React.ReactNode;
//     label: string;
//     className?: string;
//   }[];
//   data: T[];
//   renderRow: (item: T, index: number) => React.ReactNode;
//   isPending: boolean;
//   caption?: string;
//   paginationProps?: PaginationProps;
//   height?: number;
//   density?: DensityMode;
//   className?: string;
//   onRowClick?: (item: T, index: number) => void;
// }

// export default function ReusableTable<T>({
//   headers,
//   data,
//   renderRow,
//   isPending,
//   caption,
//   paginationProps,
//   height = 60.89,
//   density = "md",
//   className,
//   onRowClick,
// }: ReusableTableProps<T>) {
//   const emptyRows = Math.max(0, TABLE_ROWS - data?.length-8);
//   const t = useTranslations("Table");

//   // Density-based spacing
//   const densityClasses = {
//     sm: {
//       headerPadding: "py-2 px-3",
//       cellPadding: "py-2 px-3",
//       headerText: "text-xs",
//       cellText: "text-sm",
//     },
//     md: {
//       headerPadding: "py-4 px-4",
//       cellPadding: "py-3 px-4",
//       headerText: "text-sm",
//       cellText: "text-base",
//     },
//   };

//   const currentDensity = densityClasses[density];

//   return (
//     <div
//       className={cn(
//         "relative overflow-hidden rounded-xl border bg-card shadow-sm transition-colors duration-300",
//         "border-border/50 shadow-lg",
//         className
//       )}
//     >
//       {/* Table Container with Custom Scrollbar */}
//       <div className="relative overflow-x-auto">
//         <Table className="w-full">
//           {caption && (
//             <TableCaption className="sr-only">{caption}</TableCaption>
//           )}

//           {/* Enhanced Header */}
//           <TableHeader>
//             <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
//               {headers.map((header, index) => (
//                 <TableHead
//                   key={`${header.label}-${index}`}
//                   className={cn(
//                     "text-center font-semibold text-muted-foreground",
//                     currentDensity.headerPadding,
//                     currentDensity.headerText,
//                     header.className
//                   )}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <span className="text-muted-foreground/80">
//                       {header.Icon}
//                     </span>
//                     <span className="font-medium">{header.label}</span>
//                   </div>
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>

//           {/* Enhanced Body */}
//           <TableBody>
//             {isPending ? (
//               <TableSkeleton
//                 style={{ height }}
//                 rows={10}
//                 cells={headers.length}
//               />
//             ) : (
//               <>
//                 {/* Data Rows */}
//                 {data?.map((item, index) => (
//                   <TableRow
//                     key={index}
//                     onClick={() => onRowClick?.(item, index)}
//                     className={cn(
//                       "group text-center relative transition-all duration-200",
//                       "border-b border-border/30 last:border-b-0",
//                       "hover:bg-muted/50 hover:shadow-sm",
//                       "focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ",
//                       onRowClick && "cursor-pointer hover:scale-[1.001]"
//                     )}
//                     tabIndex={onRowClick ? 0 : undefined}
//                     role={onRowClick ? "button" : undefined}
//                   >
//                     {renderRow(item, index)}
//                   </TableRow>
//                 ))}

//                 {/* Empty Rows for Consistent Height */}
//                 {Array.from({ length: emptyRows }).map((_, index) => (
//                   <TableRow
//                     key={`empty-${index}`}
//                     className="border-b-0 border-border/20 hover:bg-transparent last:border-b-0"
//                   >
//                     {headers.map((_, cellIndex) => (
//                       <TableCell
//                         key={`empty-cell-${cellIndex}`}
//                         className={cn(currentDensity.cellPadding)}
//                         style={{ height }}
//                       >
//                         <div className="w-full h-full" />
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}

//               </>
//             )}
//           </TableBody>

//           {/* Enhanced Footer with Sticky Pagination */}
//           {paginationProps && (
//             <TableFooter className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border/50">
//               <TableRow className="hover:bg-transparent">
//                 <TableCell colSpan={headers.length} className="py-4 px-6">
//                   <div className="flex items-center justify-between">
//                     <AppPagination {...paginationProps} />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             </TableFooter>
//           )}
//         </Table>
//       </div>

//       {/* Loading Overlay */}
//       {isPending && (
//         <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10">
//           <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 shadow-lg border">
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
//             <span className="text-sm font-medium text-muted-foreground">
//               {t("loadingData")}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
