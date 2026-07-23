interface AuthorSocialLinksProps {
  urls: string[];
}

const hostFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const AuthorSocialLinks = ({ urls }: AuthorSocialLinksProps) => (
  <ul className="flex flex-wrap gap-3">
    {urls.map((url) => (
      <li key={url}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer me"
          className="text-primary type-body-small underline"
        >
          {hostFromUrl(url)}
        </a>
      </li>
    ))}
  </ul>
);
