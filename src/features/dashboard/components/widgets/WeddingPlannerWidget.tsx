import { getTranslations } from "next-intl/server";
import { ClipboardCheckIcon } from "@ovation/icons/ClipboardCheckIcon";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";

import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { ProgressRing } from "@/features/wedding-planner/components/ProgressRing";
import {
  clampPct,
  formatShortDate,
  money,
} from "@/features/wedding-planner/utils";
import { formatDateRange } from "@/lib/event-types";
import { WeddingPlannerWidgetTaskRow } from "./WeddingPlannerWidgetTaskRow";

export type WeddingPlannerWidgetSummary = {
  weddingDate: string | null;
  endDate: string | null;
  daysToGo: number | null;
  progressPct: number;
  doneTasks: number;
  totalTasks: number;
  nextTasks: { title: string; dueDate: string | null }[];
  totalBudget: number;
  spent: number;
  remaining: number;
};

const wp = appRoutes.app.weddingPlanner;

type WeddingPlannerWidgetProps = {
  summary: WeddingPlannerWidgetSummary;
};

export const WeddingPlannerWidget = async ({
  summary,
}: WeddingPlannerWidgetProps) => {
  const t = await getTranslations();
  const spentPct =
    summary.totalBudget > 0
      ? clampPct((summary.spent / summary.totalBudget) * 100)
      : 0;

  return (
    <div className="rounded-20 border-border bg-card w-full border p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary rounded-10 inline-flex size-9 items-center justify-center">
            <ClipboardCheckIcon width={18} height={18} />
          </span>
          <h3 className="type-h4">{t("sidebar__nav__wedding_planner")}</h3>
        </div>
        <Link
          href={wp.dashboard}
          className="bg-primary text-primary-foreground rounded-12 type-body-small inline-flex items-center gap-2 px-4 py-2 font-semibold transition-opacity hover:opacity-90"
        >
          {t("wp__widget__open")}
          <ArrowRightIcon width={16} height={16} />
        </Link>
      </div>

      <div className="tablet:flex-row tablet:items-center tablet:divide-x tablet:divide-y-0 divide-border flex flex-col divide-y">
        {summary.daysToGo !== null ? (
          <div className="tablet:pr-6 tablet:pl-0 tablet:py-0 flex items-baseline gap-2 py-3">
            <span className="type-h1 text-primary leading-none">
              {summary.daysToGo}
            </span>
            <div className="flex flex-col">
              <span className="type-body-small text-muted-foreground">
                {t("wp__days_to_go")}
              </span>
              {summary.weddingDate ? (
                <span className="type-caption text-muted-foreground">
                  {formatDateRange(
                    {
                      eventDate: summary.weddingDate,
                      endDate: summary.endDate,
                      weddingDate: null,
                    },
                    formatShortDate,
                  )}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="tablet:px-6 tablet:py-0 flex items-center gap-3 py-3">
          <ProgressRing
            pct={summary.progressPct}
            label={`${summary.progressPct}%`}
            size={64}
          />
          <div className="min-w-0">
            <p className="type-caption text-muted-foreground">
              {t("wp__dash__progress_title")}
            </p>
            <p className="type-body-small mt-0.5 font-semibold">
              {t("wp__timeline__done_count", {
                done: summary.doneTasks,
                total: summary.totalTasks,
              })}
            </p>
          </div>
        </div>

        <div className="tablet:px-6 tablet:min-w-52 tablet:py-0 flex flex-col justify-center gap-1.5 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="type-caption text-muted-foreground">
              {t("wp__dash__spent")}
            </span>
            <span className="type-body-small font-semibold">
              {money(summary.spent)}
              <span className="text-muted-foreground font-normal">
                {" / "}
                {money(summary.totalBudget)}
              </span>
            </span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${spentPct}%` }}
            />
          </div>
          <span className="type-caption text-muted-foreground">
            {t("wp__dash__remaining")}: {money(summary.remaining)}
          </span>
        </div>

        <div className="tablet:pl-6 tablet:flex-1 tablet:py-0 flex min-w-0 flex-col justify-center py-3">
          <p className="type-caption text-muted-foreground mb-1">
            {t("wp__widget__next_up")}
          </p>
          {summary.nextTasks.length ? (
            <div className="flex flex-col gap-1.5">
              {summary.nextTasks.map((task, index) => (
                <WeddingPlannerWidgetTaskRow
                  key={`${task.title}-${index}`}
                  title={task.title}
                  dueDate={task.dueDate}
                />
              ))}
            </div>
          ) : (
            <p className="type-body-small text-muted-foreground">
              {t("wp__dash__no_tasks")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
