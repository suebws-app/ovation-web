import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { appRoutes } from "@/lib/routes";

// The role step moved into the create wizard (now step 2, after event type).
// Keep this route as a redirect for existing links/bookmarks.
const Page = async () => {
  const locale = await getLocale();
  redirect({ href: appRoutes.create.root, locale });
};

export default Page;
