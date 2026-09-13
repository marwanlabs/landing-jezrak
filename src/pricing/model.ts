import { useEffect, useState } from "react";

export type PlanCode = "seed" | "grow" | "canopy";
export const planCatalog = {
  seed: { name: { en: "Seed", ar: "البذرة" }, descriptor: { en: "Start selling", ar: "ابدأ البيع" } },
  grow: { name: { en: "Grow", ar: "النمو" }, descriptor: { en: "Run your business", ar: "أدر نشاطك" } },
  canopy: { name: { en: "Canopy", ar: "المظلة" }, descriptor: { en: "Run your organization", ar: "أدر مؤسستك" } },
} as const satisfies Record<PlanCode, { name: { en: string; ar: string }; descriptor: { en: string; ar: string } }>;
export type AddOnCode =
  | "pos"
  | "purchasing"
  | "advanced_inventory"
  | "finance"
  | "growth_tools"
  | "advanced_analytics";
export type ExtraPrice = { enabled: boolean; monthlyPrice: number };
export type PlanPricing = {
  code: PlanCode;
  monthlyPrice: number;
  completedOrderFee: number;
  includedStores: number;
  includedLocations: number;
  includedStaff: number;
  includedDomains: number;
  extraStore: ExtraPrice;
  extraLocation: ExtraPrice;
  extraStaff: ExtraPrice;
};
export type AddOnPricing = { code: AddOnCode; monthlyPrice: number };
export type PricingConfig = {
  schemaVersion: 1;
  currency: "EGP";
  plans: PlanPricing[];
  seedAddOns: AddOnPricing[];
  updatedAt: string | null;
};

const extra = (enabled: boolean, monthlyPrice: number): ExtraPrice => ({
  enabled,
  monthlyPrice,
});
export const defaultPricingConfig: PricingConfig = {
  schemaVersion: 1,
  currency: "EGP",
  updatedAt: null,
  plans: [
    {
      code: "seed",
      monthlyPrice: 0,
      completedOrderFee: 5,
      includedStores: 1,
      includedLocations: 1,
      includedStaff: 1,
      includedDomains: 1,
      extraStore: extra(false, 0),
      extraLocation: extra(false, 0),
      extraStaff: extra(false, 0),
    },
    {
      code: "grow",
      monthlyPrice: 1499,
      completedOrderFee: 0,
      includedStores: 1,
      includedLocations: 3,
      includedStaff: 5,
      includedDomains: 3,
      extraStore: extra(false, 0),
      extraLocation: extra(true, 149),
      extraStaff: extra(true, 99),
    },
    {
      code: "canopy",
      monthlyPrice: 3499,
      completedOrderFee: 0,
      includedStores: 3,
      includedLocations: 10,
      includedStaff: 20,
      includedDomains: 10,
      extraStore: extra(true, 499),
      extraLocation: extra(true, 149),
      extraStaff: extra(true, 99),
    },
  ],
  seedAddOns: [
    "pos",
    "purchasing",
    "advanced_inventory",
    "finance",
    "growth_tools",
    "advanced_analytics",
  ].map((code) => ({
    code: code as AddOnCode,
    monthlyPrice: {
      pos: 299,
      purchasing: 249,
      advanced_inventory: 249,
      finance: 299,
      growth_tools: 199,
      advanced_analytics: 199,
    }[code as AddOnCode],
  })),
};
export const PRICING_STORAGE_KEY = "jizrak.pricing.v1";
export const PRICING_CHANGE_EVENT = "jizrak:pricing-change";
const planCodes: PlanCode[] = ["seed", "grow", "canopy"];
const addOnCodes: AddOnCode[] = [
  "pos",
  "purchasing",
  "advanced_inventory",
  "finance",
  "growth_tools",
  "advanced_analytics",
];
const whole = (v: unknown, positive = false) =>
  typeof v === "number" &&
  Number.isFinite(v) &&
  Number.isInteger(v) &&
  v >= (positive ? 1 : 0);
export function parsePricingConfig(value: unknown): PricingConfig | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PricingConfig>;
  if (
    candidate.schemaVersion !== 1 ||
    candidate.currency !== "EGP" ||
    !Array.isArray(candidate.plans) ||
    !Array.isArray(candidate.seedAddOns)
  )
    return null;
  const plans = candidate.plans;
  const seedAddOns = candidate.seedAddOns;
  if (
    plans.length !== 3 ||
    seedAddOns.length !== 6 ||
    new Set(plans.map((p) => p.code)).size !== 3 ||
    !planCodes.every((c) => plans.some((p) => p.code === c)) ||
    new Set(seedAddOns.map((a) => a.code)).size !== 6 ||
    !addOnCodes.every((c) => seedAddOns.some((a) => a.code === c))
  )
    return null;
  for (const plan of plans) {
    if (
      !plan ||
      !whole(plan.monthlyPrice) ||
      !whole(plan.completedOrderFee) ||
      !whole(plan.includedStores, true) ||
      !whole(plan.includedLocations, true) ||
      !whole(plan.includedStaff, true) ||
      !whole(plan.includedDomains) ||
      (plan.code !== "seed" && plan.monthlyPrice <= 0) ||
      (plan.code === "seed" && plan.completedOrderFee <= 0)
    )
      return null;
    for (const extraPrice of [
      plan.extraStore,
      plan.extraLocation,
      plan.extraStaff,
    ])
      if (
        !extraPrice ||
        typeof extraPrice.enabled !== "boolean" ||
        !whole(extraPrice.monthlyPrice) ||
        (extraPrice.enabled && extraPrice.monthlyPrice <= 0)
      )
        return null;
  }
  if (!seedAddOns.every((a) => a && whole(a.monthlyPrice))) return null;
  return {
    schemaVersion: 1,
    currency: "EGP",
    plans: plans as PlanPricing[],
    seedAddOns: seedAddOns as AddOnPricing[],
    updatedAt:
      typeof candidate.updatedAt === "string" || candidate.updatedAt === null
        ? candidate.updatedAt
        : null,
  };
}
export function readPricingConfig(): PricingConfig {
  if (typeof window === "undefined") return defaultPricingConfig;
  try {
    const raw = localStorage.getItem(PRICING_STORAGE_KEY);
    if (!raw) return defaultPricingConfig;
    const parsed = parsePricingConfig(JSON.parse(raw));
    if (parsed) return parsed;
    if (import.meta.env.DEV)
      console.warn("Invalid pricing configuration; using defaults.");
  } catch {
    if (import.meta.env.DEV)
      console.warn("Unreadable pricing configuration; using defaults.");
  }
  return defaultPricingConfig;
}
export function writePricingConfig(config: PricingConfig) {
  const parsed = parsePricingConfig(config);
  if (!parsed) throw new Error("Cannot save invalid pricing configuration");
  const saved = { ...parsed, updatedAt: new Date().toISOString() };
  localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(saved));
  window.dispatchEvent(new CustomEvent(PRICING_CHANGE_EVENT));
}
export function resetPricingConfig() {
  localStorage.removeItem(PRICING_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PRICING_CHANGE_EVENT));
}
export function usePricingConfig() {
  const [config, setConfig] = useState(defaultPricingConfig);
  useEffect(() => {
    const update = () => setConfig(readPricingConfig());
    update();
    window.addEventListener(PRICING_CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(PRICING_CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return config;
}
export function formatMoney(value: number, locale: "en" | "ar") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}
