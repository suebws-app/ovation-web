import { RootHeader } from "@/features/layout/RootHeader";
import { RootFooter } from "@/features/layout/RootFooter";
import { AudioPlayerProvider } from "@ovation/ui/providers/AudioPlayerProvider";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schemas";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AudioPlayerProvider>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <RootHeader />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </AudioPlayerProvider>
  );
};

export default MarketingLayout;
