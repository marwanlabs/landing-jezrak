import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "../auth/AuthPage";
import { authMetadata } from "../auth/content";
export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: authMetadata.signup.en.title },
      { name: "description", content: authMetadata.signup.en.description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AuthPage mode="signup" />,
});
