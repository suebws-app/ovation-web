interface BlogReferenceLinkProps {
  title: string;
  url: string;
}

export const BlogReferenceLink = ({ title, url }: BlogReferenceLinkProps) => (
  <li>
    <a href={url} target="_blank" rel="noopener nofollow" className="underline">
      {title}
    </a>
  </li>
);
