import { BundleBanner } from "./components/BundleBanner";
import { KeepsakesCollection } from "./components/KeepsakesCollection";
import { KeepsakesFeaturedRow } from "./components/KeepsakesFeaturedRow";
import { KeepsakesFooter } from "./components/KeepsakesFooter";
import { KeepsakesHero } from "./components/KeepsakesHero";
import { TestimonialStrip } from "./components/TestimonialStrip";

export const KeepsakesPage = () => (
  <div className="min-w-0">
    <KeepsakesHero />
    <KeepsakesFeaturedRow />
    <div className="mt-5">
      <BundleBanner />
    </div>
    <KeepsakesCollection />
    <div className="mt-8">
      <TestimonialStrip />
    </div>
    <KeepsakesFooter />
  </div>
);
