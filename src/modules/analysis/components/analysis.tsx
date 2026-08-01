"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Award, BookOpen, DollarSign, Users } from "lucide-react"
import fetcherClient from "@/lib/api/fetcher/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionHeading, StatCard } from "./shared"
import { Skeleton } from "@/components/ui/skeleton"

interface IAdminStatsResponse {
  success: boolean
  message?: string
  data: {
    users: {
      total: number
      new_this_month: number
      total_instructors: number
      pending_instructors: number
    }
    courses: {
      total: number
      published: number
      pending: number
      draft: number
      rejected: number
    }
    enrollments: {
      total: number
      new_this_month: number
    }
    total_revenue: number
  }
}

export function Analysis() {
  const t = useTranslations("Dashboard.analysis.overview")

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => fetcherClient.get<IAdminStatsResponse>("/admin/stats"),
    staleTime: 1000 * 60 * 5,
  })

  const stats = data?.data
  const isEmpty = !isLoading && !isError && !stats

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6 md:px-6 md:py-8">
      <SectionHeading
        id="analysis-overview"
        icon={Users}
        title={t("title")}
        description={t("description")}
      />

      {isLoading ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <Skeleton className="h-6 w-32" />
              <div className="mt-5 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="w-full rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
          <div className="mb-3">{t("loadError")}</div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        </div>
      ) : isEmpty ? (
        <div className="w-full rounded-xl border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={Users}
              label={t("summary.totalStudents")}
              value={stats ? stats.users.total.toLocaleString() : "—"}
              hint={t("summary.newStudentsThisMonth", {
                count: stats?.users.new_this_month ?? 0,
              })}
              isPending={false}
              accent
            />

            <StatCard
              icon={Award}
              label={t("summary.totalInstructors")}
              value={stats ? stats.users.total_instructors.toLocaleString() : "—"}
              hint={t("summary.pendingInstructors", {
                count: stats?.users.pending_instructors ?? 0,
              })}
              isPending={false}
            />

            <StatCard
              icon={BookOpen}
              label={t("summary.totalCourses")}
              value={stats ? stats.courses.total.toLocaleString() : "—"}
              hint={t("summary.courseStatusHint")}
              isPending={false}
            />

            <StatCard
              icon={DollarSign}
              label={t("summary.totalRevenue")}
              value={stats ? stats.total_revenue.toLocaleString() : "—"}
              hint={t("summary.revenueHint")}
              isPending={false}
            />
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden border-border bg-card">
              <CardHeader>
                <CardTitle>{t("usersSection.title")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("usersSection.description")}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("usersSection.newThisMonth")}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tabular-nums">
                        {stats ? stats.users.new_this_month.toLocaleString() : "—"}
                      </p>
                    </div>
                    <Badge variant="secondary">{t("usersSection.label")}</Badge>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("usersSection.pendingInstructors")}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tabular-nums">
                        {stats ? stats.users.pending_instructors.toLocaleString() : "—"}
                      </p>
                    </div>
                    <Badge variant="outline">{t("usersSection.approvals")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border bg-card">
              <CardHeader>
                <CardTitle>{t("coursesSection.title")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("coursesSection.description")}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("coursesSection.published")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {stats ? stats.courses.published.toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("coursesSection.pending")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {stats ? stats.courses.pending.toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("coursesSection.draft")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {stats ? stats.courses.draft.toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("coursesSection.rejected")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {stats ? stats.courses.rejected.toLocaleString() : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border bg-card">
              <CardHeader>
                <CardTitle>{t("enrollmentsSection.title")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("enrollmentsSection.description")}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("enrollmentsSection.total")}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tabular-nums">
                        {stats ? stats.enrollments.total.toLocaleString() : "—"}
                      </p>
                    </div>
                    <Badge variant="secondary">{t("enrollmentsSection.active")}</Badge>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("enrollmentsSection.newThisMonth")}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tabular-nums">
                        {stats ? stats.enrollments.new_this_month.toLocaleString() : "—"}
                      </p>
                    </div>
                    <Badge variant="outline">{t("enrollmentsSection.monthly")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
