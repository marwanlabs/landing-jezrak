export function validateConfig(
  env: Record<string, string | undefined>,
  production = true,
) {
  const errors: string[] = [];
  for (const key of [
    "VITE_SITE_URL",
    "VITE_START_BUSINESS_URL",
    "VITE_DEMO_URL",
    "VITE_SIGN_IN_URL",
    "VITE_PRIVACY_URL",
    "VITE_TERMS_URL",
  ]) {
    const value = env[key];
    if (!value) {
      if (production && !["VITE_PRIVACY_URL", "VITE_TERMS_URL"].includes(key))
        errors.push(`${key}: required for production`);
      continue;
    }
    try {
      if (
        key !== "VITE_SITE_URL" &&
        /^\/(?!\/)/.test(value) &&
        !/[\\\s]/.test(value)
      )
        continue;
      const url = new URL(value);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        /[\\\s]/.test(value)
      )
        throw new Error();
      if (
        key === "VITE_SITE_URL" &&
        (url.pathname !== "/" || url.search || url.hash)
      )
        throw new Error();
    } catch {
      errors.push(
        `${key}: must be ${key === "VITE_SITE_URL" ? "an HTTPS origin without a path, query, or fragment" : "an HTTPS URL or same-origin path"} without credentials`,
      );
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
}
