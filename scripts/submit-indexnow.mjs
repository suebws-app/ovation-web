const INDEXNOW_KEY = "0797bd004c8c347085d2910800ac9778";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ovationday.com";

const fetchSitemapUrls = async () => {
  const response = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  return [...new Set(urls)];
};

const submitToIndexNow = async (urlList) => {
  const host = new URL(SITE_URL).host;
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  return response;
};

const main = async () => {
  const explicitUrls = process.argv.slice(2);
  const urls = explicitUrls.length > 0 ? explicitUrls : await fetchSitemapUrls();

  if (urls.length === 0) {
    console.error("No URLs to submit");
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  const response = await submitToIndexNow(urls);

  if (response.ok) {
    console.log(`Done (HTTP ${response.status})`);
    return;
  }

  const body = await response.text();
  console.error(`IndexNow submission failed: HTTP ${response.status} ${body}`);
  process.exit(1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
