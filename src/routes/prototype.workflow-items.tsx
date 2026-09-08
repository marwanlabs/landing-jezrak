import { createFileRoute } from "@tanstack/react-router";
import { WorkflowItemsPrototype } from "../prototypes/WorkflowItemsPrototype";

export const Route = createFileRoute("/prototype/workflow-items")({
  validateSearch: (search: Record<string, unknown>) => ({
    variant: ["A", "B"].includes(String(search.variant))
      ? (String(search.variant) as "A" | "B")
      : "A",
  }),
  component: WorkflowItemsPrototype,
});
