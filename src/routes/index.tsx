import { createFileRoute } from "@tanstack/react-router";
import { WorldLanding } from "../world/WorldLanding";
import { config } from "../app/config";
export const Route = createFileRoute("/")({
  head: () => ({ links: [{ rel: "canonical", href: config.site }] }),
  component: WorldLanding,
});
