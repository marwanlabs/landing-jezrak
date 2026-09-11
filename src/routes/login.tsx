import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "../auth/AuthPage";
import { authMetadata } from "../auth/content";
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: authMetadata.login.en.title },
      { name: "description", content: authMetadata.login.en.description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AuthPage mode="login" />,
});
