import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "../workspace/Workspace";
export const Route = createFileRoute("/platform/support")({
  head: () => ({
    meta: [
      { title: "Jizrak | Workspace" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Workspace,
});
