import { createFileRoute } from "@tanstack/react-router";
import { FeatureJourney } from "../features/FeatureJourney";
import { featureMetadata } from "../features/content";
import { config } from "../app/config";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: featureMetadata.en.title },
      { name: "description", content: featureMetadata.en.description },
      { property: "og:title", content: featureMetadata.en.title },
      { property: "og:description", content: featureMetadata.en.description },
      { property: "og:url", content: `${config.site}/features` },
    ],
    links: [{ rel: "canonical", href: `${config.site}/features` }],
  }),
  component: FeatureJourney,
});
