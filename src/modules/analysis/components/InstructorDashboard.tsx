"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Award,
  BookOpen,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import fetcherClient from "@/lib/api/fetcher/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SectionHeading, StatCard } from "./shared";

// ─── Types ───────────────────────────────────────────────────────────────────

interface IInstructorDashboard {
  success: boolean;
  data: {
    total_students: number;
    total_earnings: number;
    average_rating: number;
    total_enrollments: number;
    avg_completion: number;
    earnings: {
      total_earned: number;
      pending_balance: number;
      paid_out: number;
    };
    courses: {
      total: number;
      published: number;
      draft: number;
      pending: number;
      rejected: number;
    };
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function CompletionRing({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color =
    pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="-rotate-90" width={68} height={68} viewBox="0 0 68 68">
        <circle cx={34} cy={34} r={r} fill="none" stroke="currentColor"
          strokeWidth={6} className="text-muted/30" />
        <circle cx={34} cy={34} r={r} fill="none" stroke={color}
          strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Course status config ─────────────────────────────────────────────────────

type StatusKey = "published" | "draft" | "pending" | "rejected";

const STATUS_STYLE: Record<StatusKey, string> = {
  published: "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  draft:     "border-slate-300/40 bg-slate-50 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400",
  pending:   "border-amber-400/30 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  rejected:  "border-rose-400/30 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function InstructorDashboard() {
  const t = useTranslations("Dashboard.InstructorDashboard");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["instructor_dashboard"],
    queryFn: () => fetcherClient.get<IInstructorDashboard>("/instructor/dashboard"),
    staleTime: 1000 * 60 * 5,
  });

  const stats = (data as IInstructorDashboard | null)?.data;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6 md:px-6 md:py-8">
      <SectionHeading
        id="instructor-dashboard"
        icon={LayoutDashboard}
        title={t("title")}
        description={t("description")}
      />

      {/* ── Loading ── */}
      {isLoading && <StatsSkeleton />}

      {/* ── Error ── */}
      {isError && (
        <div className="w-full rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
          <p className="mb-3">{t("loadError")}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}

      {/* ── Content ── */}
      {!isLoading && !isError && stats && (
        <div className="space-y-6">

          {/* ── Top 4 stat cards ── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Users}
              label={t("stats.totalStudents")}
              value={stats.total_students.toLocaleString()}
              isPending={false}
              accent
            />
            <StatCard
              icon={GraduationCap}
              label={t("stats.totalEnrollments")}
              value={stats.total_enrollments.toLocaleString()}
              isPending={false}
            />
            <StatCard
              icon={Award}
              label={t("stats.averageRating")}
              value={
                <span className="flex items-center gap-1.5">
                  {stats.average_rating.toFixed(1)}
                  <span className="text-amber-400 text-2xl leading-none">★</span>
                </span>
              }
              isPending={false}
            />
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("stats.avgCompletion")}
                </span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <TrendingUp className="size-4" />
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <CompletionRing value={stats.avg_completion} />
                <p className="text-xs text-muted-foreground">
                  {t("stats.completionHint")}
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom 2 cards ── */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* Earnings */}
            <Card className="overflow-hidden border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40">
                    <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{t("earnings.title")}</CardTitle>
                    <p className="text-xs text-muted-foreground">{t("earnings.description")}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    { key: "totalEarned",    val: stats.earnings.total_earned,    icon: DollarSign, accent: "text-emerald-600 dark:text-emerald-400" },
                    { key: "pendingBalance", val: stats.earnings.pending_balance, icon: Wallet,      accent: "text-amber-600 dark:text-amber-400" },
                    { key: "paidOut",        val: stats.earnings.paid_out,        icon: TrendingUp,  accent: "text-sky-600 dark:text-sky-400" },
                  ] as const
                ).map(({ key, val, icon: Icon, accent }) => (
                  <div key={key}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("size-4 shrink-0", accent)} />
                      <p className="text-sm text-muted-foreground">{t(`earnings.${key}`)}</p>
                    </div>
                    <p className={cn("text-sm font-semibold tabular-nums", accent)}>
                      ${formatMoney(val)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course pipeline */}
            <Card className="overflow-hidden border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="size-5 text-primary" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{t("courses.title")}</CardTitle>
                    <p className="text-xs text-muted-foreground">{t("courses.description")}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                  <p className="text-sm text-muted-foreground">{t("courses.total")}</p>
                  <Badge variant="secondary" className="text-sm font-bold px-3">
                    {stats.courses.total}
                  </Badge>
                </div>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  {(["published", "draft", "pending", "rejected"] as StatusKey[]).map((s) => (
                    <div key={s}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2.5",
                        STATUS_STYLE[s],
                      )}>
                      <p className="text-xs font-medium">{t(`courses.${s}`)}</p>
                      <span className="text-sm font-bold tabular-nums">
                        {stats.courses[s]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}
