export const config = {
  site: (import.meta.env.VITE_SITE_URL || "http://127.0.0.1:3000").replace(
    /\/$/,
    "",
  ),
  start: import.meta.env.VITE_START_BUSINESS_URL || "/signup",
  demo: import.meta.env.VITE_DEMO_URL || "#demo",
  signin: import.meta.env.VITE_SIGN_IN_URL || "/login",
  privacy: import.meta.env.VITE_PRIVACY_URL || null,
  terms: import.meta.env.VITE_TERMS_URL || null,
  review: import.meta.env.VITE_REVIEW === true || import.meta.env.DEV,
};
