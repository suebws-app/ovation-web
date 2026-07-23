import { AudienceLandingPage } from "@/features/marketing/AudienceLandingPage";

export { generateForFamilyMetadata as generateMetadata } from "@/lib/seo/marketingMetadata";

interface Props {
  params: Promise<{ locale: string }>;
}

const Page = (props: Props) => (
  <AudienceLandingPage audienceKey="family" params={props.params} />
);

export default Page;
