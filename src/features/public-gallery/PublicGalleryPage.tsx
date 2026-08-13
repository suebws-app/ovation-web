import { publicApi } from "@/lib/api/public";
import { PublicGalleryClient } from "./PublicGalleryClient";

type PublicGalleryPageProps = {
  params: Promise<{ slug: string; code: string }>;
};

export const PublicGalleryPage = async ({ params }: PublicGalleryPageProps) => {
  const { slug, code } = await params;
  const event = await publicApi.getEvent(slug).catch(() => null);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <PublicGalleryClient
        slug={slug}
        code={code}
        eventName={event?.eventName ?? null}
        partnerAName={event?.hostAName ?? event?.partnerAName ?? null}
        partnerBName={event?.hostBName ?? event?.partnerBName ?? null}
        couplePhotoUrl={event?.coverPhotoUrl ?? event?.couplePhotoUrl ?? null}
      />
    </div>
  );
};
