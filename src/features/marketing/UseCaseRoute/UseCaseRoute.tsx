import { notFound } from "next/navigation";
import { EventTypePage } from "@/features/marketing/EventTypePage";
import { findEventTypePage } from "@/features/marketing/EventTypePage/eventTypePages";
import { UseCasePage } from "@/features/marketing/UseCasePage";
import { findUseCase } from "@/features/marketing/UseCasePage/useCases";

interface UseCaseRouteProps {
  params: Promise<{ locale: string; case: string }>;
}

export const UseCaseRoute = async ({ params }: UseCaseRouteProps) => {
  const { case: slug } = await params;

  if (findEventTypePage(slug)) return <EventTypePage params={params} />;
  if (findUseCase(slug)) return <UseCasePage params={params} />;

  notFound();
};
