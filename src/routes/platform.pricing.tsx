import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "../workspace/Workspace";
export const Route = createFileRoute("/platform/pricing")({
  head: () => ({
    meta: [
      { title: "Jizrak | Pricing" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Workspace,
});
