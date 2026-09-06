import data from "./landing.json";
export type Locale = "en" | "ar";
export type BilingualText = { id: string; en: string; ar: string };
export type FeatureGroup = {
  id: string;
  name: BilingualText;
  inventory: BilingualText;
};
export type SectionContent = {
  id: string;
  title: string;
  eyebrow: BilingualText;
  heading: BilingualText;
  body: BilingualText;
  premise: BilingualText;
  details: BilingualText[];
  groups?: FeatureGroup[];
};
export const sections: SectionContent[] = data;
export function section(id: string): SectionContent {
  const found = sections.find((s) => s.id === id);
  if (!found) throw new Error(`Missing section ${id}`);
  return found;
}
export const pair = (id: string, en: string, ar: string): BilingualText => ({
  id,
  en,
  ar,
});
export const copy = {
  rootSystem: pair("root-system", "ROOT SYSTEM", "منظومة الجذور"),
  start: pair("cta-start", "Start your Business", "ابدأ نشاطك التجاري"),
  demo: pair("cta-demo", "Explore the Demo", "استكشف التجربة"),
  signin: pair("cta-signin", "Sign in", "تسجيل الدخول"),
  lockup: pair("lockup", "Jizrak", "جِذرك"),
  detail: pair(
    "workflow-detail",
    "Explore the workflows",
    "استعرض تفاصيل سير العمل",
  ),
  close: pair("close-detail", "Workflow details", "تفاصيل سير العمل"),
  rootLabel: pair(
    "root-label",
    "Your commerce, connected.",
    "تجارة مترابطة بمنظومة واحدة.",
  ),
  ledgerNote: pair(
    "ledger-note",
    "One shared Location. Two separate stock ledgers.",
    "موقع مشترك واحد. دفتران منفصلان للمخزون.",
  ),
  ledgerA: pair("ledger-a", "Store A ledger", "دفتر المتجر أ"),
  ledgerB: pair("ledger-b", "Store B ledger", "دفتر المتجر ب"),
  storeA: pair("store-a", "Store A", "المتجر أ"),
  storeB: pair("store-b", "Store B", "المتجر ب"),
  business: pair("business-label", "Business", "النشاط التجاري"),
  location: pair("location-label", "Location", "الموقع"),
  native: pair(
    "native-label",
    "Arabic-first. Built for Arab businesses.",
    "بالعربية أولاً. للأنشطة التجارية العربية.",
  ),
  stock: pair(
    "stock-label",
    "Independent Stores. Connected operations.",
    "متاجر مستقلة. عمليات مترابطة.",
  ),
  egp: pair(
    "egp-label",
    "Rooted in Egyptian commerce.",
    "مصمم للتجارة المصرية.",
  ),
  currentStep: pair("current-step", "Current step", "الخطوة الحالية"),
  closing: pair(
    "closing",
    "Your idea. Your brand. Your roots.",
    "فكرتك. براندك. جذرك.",
  ),
  featureLink: pair("features-link", "Features", "المزايا"),
  demoLink: pair("demo-link", "Demo", "التجربة"),
  preview: pair(
    "preview-label",
    "Design preview · Product journeys await deployment verification.",
    "معاينة التصميم · مسارات المنتج بانتظار التحقق في النسخة المنشورة.",
  ),
  startPending: pair(
    "start-pending",
    "Business onboarding will be available here when the launch destination is confirmed.",
    "سيكون بدء النشاط التجاري متاحاً هنا عند تأكيد رابط الإطلاق.",
  ),
  demoPending: pair(
    "demo-pending",
    "The demonstration Store will be linked here when its destination is confirmed.",
    "سيتم ربط المتجر التجريبي هنا عند تأكيد وجهته.",
  ),
  signPending: pair(
    "sign-pending",
    "The sign-in destination has not been configured for this preview.",
    "لم يتم إعداد رابط تسجيل الدخول لهذه المعاينة.",
  ),
  error: pair(
    "error",
    "The page could not finish loading. Reload to try again.",
    "تعذر إكمال تحميل الصفحة. أعد التحميل للمحاولة مرة أخرى.",
  ),
  privacy: pair("privacy", "Privacy", "الخصوصية"),
  terms: pair("terms", "Terms", "الشروط"),
};
export const nav = [
  { id: "connected", en: "How it connects", ar: "آلية ترابط المنظومة" },
  { id: "sell", en: "Sell", ar: "البيع" },
  { id: "operate", en: "Operate", ar: "التشغيل" },
  { id: "understand", en: "Understand", ar: "فهم الأرقام" },
  { id: "features", en: "All features", ar: "كل المزايا" },
];
export const nodes = [
  pair("storefront", "Storefront", "واجهة المتجر"),
  pair("pos", "POS", "نقطة البيع"),
  pair("inventory", "Inventory", "المخزون"),
  pair("orders", "Orders", "الطلبات"),
  pair("purchasing", "Purchasing", "المشتريات"),
  pair("customers", "Customers", "العملاء"),
  pair("finance", "Finance", "المالية"),
];
export const flow = [
  pair("receive", "Receive", "استلام"),
  pair("reserve", "Reserve", "حجز"),
  pair("sell", "Sell", "بيع"),
  pair("assemble", "Assemble", "تجميع"),
];
export const workflowNames = [
  pair("publish", "Publish", "نشر"),
  pair("sell-step", "Sell", "بيع"),
  pair("reserve-step", "Reserve", "حجز"),
  pair("replenish", "Replenish", "تجديد"),
  pair("understand-step", "Understand", "فهم الأرقام"),
];
export const metadata = {
  en: {
    title: "Jizrak — connected commerce for every Store",
    description:
      "Run branded Stores, catalog, orders, inventory, purchasing, customers, finance, and POS in one Arabic-first commerce system built for Arab businesses.",
  },
  ar: {
    title: "جِذرك — تجارة مترابطة لكل متجر",
    description:
      "إدارة المتاجر بعلاماتها والكتالوج والطلبات والمخزون والمشتريات والعملاء والمالية ونقاط البيع ضمن نظام تجاري واحد صُمم بالعربية أولاً لاحتياجات الأنشطة العربية.",
  },
};
export const ui = {
  en: {
    translation: {
      skip: "Skip to main content",
      open: "Open navigation",
      close: "Close navigation",
      theme: "Change color theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      locale: "العربية",
      localeStatus: "Language preference changed to English.",
      themeStatus: "Color theme changed.",
      current: "Current section",
    },
  },
  ar: {
    translation: {
      skip: "انتقل إلى المحتوى الرئيسي",
      open: "افتح قائمة التنقل",
      close: "أغلق قائمة التنقل",
      theme: "غيّر سمة الألوان",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",
      locale: "English",
      localeStatus: "تم تغيير تفضيل اللغة إلى العربية.",
      themeStatus: "تم تغيير سمة الألوان.",
      current: "القسم الحالي",
    },
  },
};
