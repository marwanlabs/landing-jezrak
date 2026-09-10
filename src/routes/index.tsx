import { createFileRoute } from "@tanstack/react-router";
import { AppleLanding } from "../apple/AppleLanding";
export const Route = createFileRoute("/")({ component: AppleLanding });
