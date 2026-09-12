import { useEffect, useState } from "react";

export type Business = {
  id: string;
  name: string;
  nameAr: string;
  plan: string;
  state: string;
  limit: number;
};
export type Shop = {
  id: string;
  businessId: string;
  name: string;
  nameAr: string;
  handle: string;
  state: string;
};
export const initialBusinesses: Business[] = [
  {
    id: "olive",
    name: "Olive House",
    nameAr: "بيت الزيتون",
    plan: "Growth",
    state: "Active",
    limit: 5,
  },
  {
    id: "nook",
    name: "Nook Studio",
    nameAr: "استوديو نوك",
    plan: "Starter",
    state: "Trial",
    limit: 2,
  },
  {
    id: "terra",
    name: "Terra Collective",
    nameAr: "تيرا",
    plan: "Growth",
    state: "Past due",
    limit: 5,
  },
];
export const initialShops: Shop[] = [
  {
    id: "olive-home",
    businessId: "olive",
    name: "Olive Home",
    nameAr: "أوليف للمنزل",
    handle: "olive-home",
    state: "Ready",
  },
  {
    id: "olive-objects",
    businessId: "olive",
    name: "Olive Objects",
    nameAr: "قطع أوليف",
    handle: "olive-objects",
    state: "Ready",
  },
  {
    id: "nook-studio",
    businessId: "nook",
    name: "Nook Studio",
    nameAr: "استوديو نوك",
    handle: "nook-studio",
    state: "Paused",
  },
  {
    id: "terra-market",
    businessId: "terra",
    name: "Terra Market",
    nameAr: "متجر تيرا",
    handle: "terra-market",
    state: "Deactivated",
  },
];
export function useSampleData() {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [shops, setShops] = useState(initialShops);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("jizrak.workspace-preview.v1");
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.businesses) && Array.isArray(saved.shops)) {
          setBusinesses(saved.businesses);
          setShops(saved.shops);
        }
      }
    } catch {
      /* The preview remains usable without browser storage. */
    }
  }, []);
  function save(nextBusinesses: Business[], nextShops: Shop[]) {
    setBusinesses(nextBusinesses);
    setShops(nextShops);
    try {
      sessionStorage.setItem(
        "jizrak.workspace-preview.v1",
        JSON.stringify({ businesses: nextBusinesses, shops: nextShops }),
      );
    } catch {
      /* In-memory preview still works. */
    }
  }
  return { businesses, shops, save };
}
export type SampleData = ReturnType<typeof useSampleData>;
export type Translate = (en: string, ar: string) => string;
export function safeReturn(value: string | null, fallback = "/businesses") {
  return value &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\\\x00-\x20]/.test(value) &&
    !/%(?:2f|5c|0[0-9a-f]|1[0-9a-f])/i.test(value)
    ? value
    : fallback;
}
