import { Link } from "@/i18n/navigation";

interface BlogInternalLinkProps {
  anchor: string;
  slug: string;
}

export const BlogInternalLink = ({ anchor, slug }: BlogInternalLinkProps) => (
  <li>
    <Link href={`/blog/${slug}`} className="underline">
      {anchor}
    </Link>
  </li>
);
