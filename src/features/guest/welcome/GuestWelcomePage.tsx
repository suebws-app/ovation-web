import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { EventThemeScope } from "@/lib/theme/EventThemeScope";
import { LanguageSelect } from "@/components/LanguageSelect";
import { eventTitleLine } from "@/lib/event-types";
import { eventCoverUrl, hostCoverUrl } from "@/lib/event-cover";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import { InvitationOpenTracker } from "../InvitationOpenTracker";
import { guestInitials } from "./guestInitials";
import { GuestAvatar } from "./GuestAvatar";
import { WelcomeClient } from "./WelcomeClient";

type GuestWelcomePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestWelcomePage = async ({
  params,
  searchParams,
}: GuestWelcomePageProps) => {
  const { slug } = await params;
  const search = await searchParams;
  const sourceParam = typeof search.source === "string" ? search.source : null;
  const nextParam = typeof search.next === "string" ? search.next : null;
  const editName = search.edit === "name";

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (!event) notFound();

  const t = await getTranslations();
  const title = eventTitleLine(event);
  const coverUrl = eventCoverUrl(event);
  const safeCoverUrl = safeHttpUrl(coverUrl);
  const avatarUrl = event.hostAvatarUrl ?? hostCoverUrl(event);

  return (
    <EventThemeScope event={event}>
      <InvitationOpenTracker slug={slug} />
      <div className="bg-foreground relative flex min-h-dvh flex-col">
        {safeCoverUrl && (
          <img
            src={safeCoverUrl}
            alt={title}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <span
          aria-hidden
          className="from-foreground/95 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent"
        />

        <div className="relative flex justify-end p-4">
          <LanguageSelect />
        </div>

        <div className="relative mx-auto mt-auto flex w-full max-w-332 flex-col gap-4 p-5 pb-8">
          <GuestAvatar
            url={avatarUrl}
            initials={guestInitials(title)}
            alt={title}
          />
          <div className="flex flex-col gap-2">
            <h1 className="type-h1 text-primary-foreground font-semibold">
              {title}
            </h1>
            <p className="type-body text-primary-foreground/85">
              {event.welcomeMessage ?? t("guest__welcome__default_message")}
            </p>
          </div>
          <WelcomeClient
            slug={slug}
            sourceParam={sourceParam}
            nextParam={nextParam}
            editName={editName}
          />
        </div>
      </div>
    </EventThemeScope>
  );
};
