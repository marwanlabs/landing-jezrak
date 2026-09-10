import { createFileRoute } from "@tanstack/react-router";
import { WorldLanding } from "../world/WorldLanding";
export const Route = createFileRoute("/")({ component: WorldLanding });
