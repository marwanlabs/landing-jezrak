import { createFileRoute } from "@tanstack/react-router";
import { RootedLanding } from "../day/RootedLanding";
import { config } from "../app/config";
export const Route = createFileRoute("/")({
  head: () => ({ links: [{ rel: "canonical", href: config.site }] }),
  component: RootedLanding,
});
