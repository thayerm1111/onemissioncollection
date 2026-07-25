/**
 * Renders a JSON-LD structured-data block. Google reads this to build rich
 * results (product prices, brand, sitelinks). Server-rendered so it's in the
 * initial HTML crawlers see.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, first-party content built from our own catalog.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
