import { AudienceLandingPage } from "@/features/marketing/AudienceLandingPage";

export { generateForVenuesMetadata as generateMetadata } from "@/lib/seo/marketingMetadata";

interface Props {
  params: Promise<{ locale: string }>;
}

const Page = (props: Props) => (
  <AudienceLandingPage audienceKey="venues" params={props.params} />
);

export default Page;
