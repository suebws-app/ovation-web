"use client";

import { useTranslations } from "next-intl";
import { Card } from "@ovation/ui/components/Card";
import { ClipboardCheckIcon } from "@ovation/icons/ClipboardCheckIcon";
import { WalletIcon } from "@ovation/icons/WalletIcon";
import { RouteIcon } from "@ovation/icons/RouteIcon";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import {
  useWeddingPlannerBudget,
  useWeddingPlannerTasks,
  useWeddingPlannerTimeline,
} from "@/lib/query/weddingPlannerQueries";
import type { PlannerPhase, PlannerTodo } from "@/lib/api/types";
import { chartColorVar, formatShortDate, money } from "../utils";
import { ProgressRing } from "../components/ProgressRing";
import { CountdownHero } from "./CountdownHero";
import { StageRow, type StageState } from "./StageRow";
import { DashTaskItem } from "./DashTaskItem";
import { DashPaymentItem } from "./DashPaymentItem";
import { DashBudgetSegment } from "./DashBudgetSegment";
import { DashBudgetLegendItem } from "./DashBudgetLegendItem";

const wp = appRoutes.app.weddingPlanner;

const stageLabelKey: Record<StageState, string> = {
  done: "wp__dash__stage_done",
  current: "wp__dash__stage_now",
  next: "wp__dash__stage_next",
};

const byDueDate = (
  a: { dueDate: string | null },
  b: { dueDate: string | null },
) => {
  if (a.dueDate === b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate < b.dueDate ? -1 : 1;
};

const buildStages = (
  phases: PlannerPhase[],
  todos: PlannerTodo[],
): { title: string; state: StageState }[] => {
  let currentAssigned = false;
  return phases.map((phase) => {
    const phaseTodos = todos.filter((todo) => todo.phaseId === phase.id);
    const complete =
      phaseTodos.length > 0 &&
      phaseTodos.every((todo) => todo.status === "done");
    if (complete) return { title: phase.title, state: "done" as const };
    if (!currentAssigned) {
      currentAssigned = true;
      return { title: phase.title, state: "current" as const };
    }
    return { title: phase.title, state: "next" as const };
  });
};

type WeddingPlannerDashboardClientProps = {
  eventId: string;
  partners: string;
  weddingDate: string | null;
  venue: string | null;
  city: string | null;
  showCountdown?: boolean;
  assistantLocked: boolean;
};

export const WeddingPlannerDashboardClient = ({
  eventId,
  partners,
  weddingDate,
  venue,
  city,
  showCountdown = true,
  assistantLocked,
}: WeddingPlannerDashboardClientProps) => {
  const t = useTranslations();
  const todos = useWeddingPlannerTasks(eventId).data ?? [];
  const phases = useWeddingPlannerTimeline(eventId).data ?? [];
  const budget = useWeddingPlannerBudget(eventId).data;

  const totalTasks = todos.length;
  const doneTasks = todos.filter((task) => task.status === "done").length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const openTasks = todos
    .filter((task) => task.status !== "done")
    .sort(byDueDate)
    .slice(0, 3);

  const totalBudget = budget?.totalBudget ?? 0;
  const categories = budget?.categories ?? [];
  const spent = categories.reduce((sum, category) => sum + category.actual, 0);
  const remaining = totalBudget - spent;
  const upcomingPayments = [...(budget?.payments ?? [])]
    .sort(byDueDate)
    .slice(0, 3);
  const segments = categories.filter((category) => category.actual > 0);
  const legend = categories.slice(0, 5);
  const legendMore = categories.length - legend.length;

  const stages = buildStages(phases, todos).slice(0, 4);

  const budgetTotals = [
    {
      label: t("wp__dash__budget"),
      value: totalBudget,
      className: "text-foreground",
    },
    { label: t("wp__dash__spent"), value: spent, className: "text-primary" },
    {
      label: t("wp__dash__remaining"),
      value: remaining,
      className: "text-secondary-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="desktop:grid-cols-3 grid gap-5">
        <div className="desktop:col-span-2">
          {showCountdown ? (
            <CountdownHero
              partners={partners}
              venue={venue}
              city={city}
              date={weddingDate}
              daysLabel={t("wp__days_to_go")}
              askAiLabel={t("wp__hero__ask_ai")}
              viewTimelineLabel={t("wp__hero__view_timeline")}
              askAiLocked={assistantLocked}
            />
          ) : (
            <Card className="flex h-full flex-col justify-center gap-2">
              <h2 className="type-h3 font-serif">{partners}</h2>
              {(venue || city) && (
                <p className="type-body-small text-muted-foreground">
                  {[venue, city].filter(Boolean).join(", ")}
                </p>
              )}
            </Card>
          )}
        </div>
        <Card className="flex items-center gap-5">
          <ProgressRing
            pct={progress}
            label={`${progress}%`}
            sub={t("wp__dash__complete")}
          />
          <div>
            <h3 className="type-h3 font-serif">
              {t("wp__dash__progress_title")}
            </h3>
            <p className="type-body-small text-muted-foreground mt-2">
              {t("wp__dash__progress_sub", {
                done: doneTasks,
                total: totalTasks,
              })}
            </p>
            <Link
              href={wp.tasks}
              className="text-primary type-body-small mt-3 inline-flex items-center gap-1.5 font-semibold"
            >
              {t("wp__dash__open_tasks")}
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
        </Card>
      </div>

      <div className="tablet:grid-cols-2 grid gap-5">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheckIcon
                width={20}
                height={20}
                className="text-primary"
              />
              <h3 className="type-h4">{t("wp__dash__todays_tasks")}</h3>
            </div>
            <Link href={wp.tasks} className="text-muted-foreground">
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
          {openTasks.length ? (
            <div className="flex flex-col gap-3">
              {openTasks.map((task) => (
                <DashTaskItem
                  key={task.id}
                  task={task}
                  priorityLabel={t("wp__dash__priority")}
                />
              ))}
            </div>
          ) : (
            <p className="type-body-small text-muted-foreground">
              {t("wp__dash__no_tasks")}
            </p>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletIcon width={20} height={20} className="text-primary" />
              <h3 className="type-h4">{t("wp__dash__upcoming_payments")}</h3>
            </div>
            <Link href={wp.budget} className="text-muted-foreground">
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
          {upcomingPayments.length ? (
            <div className="flex flex-col gap-3">
              {upcomingPayments.map((payment) => (
                <DashPaymentItem
                  key={payment.id}
                  payment={payment}
                  dueLabel={
                    payment.dueDate
                      ? t("wp__dash__due", {
                          date: formatShortDate(payment.dueDate),
                        })
                      : t("wp__dash__no_payment_date")
                  }
                />
              ))}
            </div>
          ) : (
            <p className="type-body-small text-muted-foreground">
              {t("wp__dash__no_payments")}
            </p>
          )}
        </Card>
      </div>

      <div className="desktop:grid-cols-3 grid gap-5">
        <Card className="desktop:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletIcon width={20} height={20} className="text-primary" />
              <h3 className="type-h4">{t("wp__dash__budget_snapshot")}</h3>
            </div>
            <Link
              href={wp.budget}
              className="text-primary type-body-small font-semibold"
            >
              {t("wp__dash__details")}
            </Link>
          </div>
          <div className="mb-4 flex gap-8">
            {budgetTotals.map((total) => (
              <div key={total.label}>
                <p className="type-caption text-muted-foreground">
                  {total.label}
                </p>
                <p className={`type-h3 font-serif ${total.className}`}>
                  {money(total.value)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-border flex h-4 overflow-hidden rounded-full border">
            {segments.map((line, index) => (
              <DashBudgetSegment
                key={line.id}
                title={line.name}
                color={chartColorVar(index)}
                pct={totalBudget > 0 ? (line.actual / totalBudget) * 100 : 0}
              />
            ))}
            <div className="bg-muted flex-1" />
          </div>
          {legend.length ? (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {legend.map((line, index) => (
                <DashBudgetLegendItem
                  key={line.id}
                  label={line.name}
                  color={chartColorVar(index)}
                />
              ))}
              {legendMore > 0 ? (
                <span className="type-caption text-muted-foreground">
                  {t("wp__dash__more", { count: legendMore })}
                </span>
              ) : null}
            </div>
          ) : null}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <RouteIcon width={20} height={20} className="text-primary" />
            <h3 className="type-h4">{t("wp__dash__where_you_are")}</h3>
          </div>
          {stages.length ? (
            <div className="flex flex-col">
              {stages.map((stage) => (
                <StageRow
                  key={stage.title}
                  state={stage.state}
                  label={stage.title}
                  stateLabel={t(stageLabelKey[stage.state])}
                />
              ))}
            </div>
          ) : (
            <p className="type-body-small text-muted-foreground">
              {t("wp__dash__no_phases")}
            </p>
          )}
          <Link
            href={wp.timeline}
            className="text-primary type-body-small mt-4 inline-flex items-center gap-1.5 font-semibold"
          >
            {t("wp__dash__full_timeline")}
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </Card>
      </div>
    </div>
  );
};
