import { loadEnv } from "vite";
import { validateConfig } from "./config-rules";
validateConfig({ ...loadEnv("production", process.cwd(), ""), ...process.env });
console.log("Production destinations validated.");
