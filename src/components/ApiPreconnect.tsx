import { clientEnv } from "@/lib/utils/env.client";

const mediaOrigin = () => {
  if (!clientEnv.MEDIA_DOMAIN) return null;
  return clientEnv.MEDIA_DOMAIN.startsWith("http")
    ? clientEnv.MEDIA_DOMAIN
    : `https://${clientEnv.MEDIA_DOMAIN}`;
};

export const ApiPreconnect = () => {
  const media = mediaOrigin();
  return (
    <>
      <link
        rel="preconnect"
        href={clientEnv.API_URL}
        crossOrigin="use-credentials"
      />
      {media && <link rel="preconnect" href={media} />}
    </>
  );
};
