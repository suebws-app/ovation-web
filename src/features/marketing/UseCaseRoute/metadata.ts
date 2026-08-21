import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateEventTypeMetadata } from "@/features/marketing/EventTypePage/metadata";
import { findEventTypePage } from "@/features/marketing/EventTypePage/eventTypePages";
import { generateUseCaseMetadata } from "@/features/marketing/UseCasePage/metadata";
import { findUseCase } from "@/features/marketing/UseCasePage/useCases";

interface Args {
  params: Promise<{ locale: string; case: string }>;
}

export const generateUseCaseRouteMetadata = async (
  args: Args,
): Promise<Metadata> => {
  const { case: slug } = await args.params;

  if (findEventTypePage(slug)) return generateEventTypeMetadata(args);
  if (findUseCase(slug)) return generateUseCaseMetadata(args);

  notFound();
};
