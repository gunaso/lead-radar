import Firecrawl from "@mendable/firecrawl-js"

const firecrawl = new Firecrawl({apiKey: process.env.FIRECRAWL_API_KEY});

export function scrape({url}: {url: string}) {
  return firecrawl.scrape(url, {
    formats: ["markdown"],
    excludeTags: ["script", "style"]
  });
}