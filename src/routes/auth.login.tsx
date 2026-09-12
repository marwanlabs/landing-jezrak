import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "../auth/AuthPage";
export const Route = createFileRoute("/auth/login")({
  component: () => <AuthPage mode="login" />,
});
