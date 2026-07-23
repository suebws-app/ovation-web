import { AudienceLandingPage } from "@/features/marketing/AudienceLandingPage";

export { generateForPhotographersMetadata as generateMetadata } from "@/lib/seo/marketingMetadata";

interface Props {
  params: Promise<{ locale: string }>;
}

const Page = (props: Props) => (
  <AudienceLandingPage audienceKey="photographers" params={props.params} />
);

export default Page;
