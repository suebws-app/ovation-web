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
        partnerAName={event?.partnerAName ?? null}
        partnerBName={event?.partnerBName ?? null}
        couplePhotoUrl={event?.couplePhotoUrl ?? null}
      />
    </div>
  );
};
