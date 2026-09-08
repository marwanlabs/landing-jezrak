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
    "View workflow details",
    "عرض تفاصيل سير العمل",
  ),
  close: pair("close-detail", "Workflow details", "تفاصيل سير العمل"),
  rootLabel: pair(
    "root-label",
    "Connected commerce for every Store.",
    "تجارة مترابطة لكل متجر.",
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
    "For Arab businesses.",
    "للأنشطة التجارية العربية.",
  ),
  stock: pair(
    "stock-label",
    "Independent Stores. Shared operations.",
    "متاجر مستقلة وعمليات مشتركة.",
  ),
  egp: pair("egp-label", "For Egyptian commerce.", "للتجارة في مصر."),
  currentStep: pair("current-step", "Current step", "الخطوة الحالية"),
  closing: pair(
    "closing",
    "Your idea. Your brand. Your roots.",
    "فكرتك. براندك. جذرك.",
  ),
  featureLink: pair("features-link", "Features", "المزايا"),
  demoLink: pair("demo-link", "Demo", "التجربة"),
  footerNav: pair("footer-nav", "Footer", "تذييل الصفحة"),
  preview: pair(
    "preview-label",
    "Design preview. Product links will be added when they are ready.",
    "معاينة للتصميم. تُضاف روابط المنتج عند جاهزيتها.",
  ),
  startPending: pair(
    "start-pending",
    "Business onboarding will be linked here when it is ready.",
    "يُضاف رابط بدء النشاط التجاري هنا عند جاهزيته.",
  ),
  demoPending: pair(
    "demo-pending",
    "The demonstration Store will be linked here when it is ready.",
    "يُضاف رابط المتجر التجريبي هنا عند جاهزيته.",
  ),
  signPending: pair(
    "sign-pending",
    "Sign-in will be linked here when it is ready.",
    "يُضاف رابط تسجيل الدخول هنا عند جاهزيته.",
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
  { id: "business", en: "Grow", ar: "التوسع" },
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
export const inventoryStageDetails = [
  pair("receive-detail", "Receive stock into the Store ledger.", "سجّل الاستلام في دفتر مخزون المتجر."),
  pair("reserve-detail", "Reserve stock for an order before fulfilment.", "احجز المخزون للطلب قبل تجهيزه."),
  pair("sell-detail", "Consume stock when the sale is recorded.", "استهلك المخزون عند تسجيل البيع."),
  pair("assemble-detail", "Assemble components into finished stock.", "اجمع المكونات في مخزون نهائي."),
  pair("reports-detail", "Follow stock movement in operational reports.", "تابع حركة المخزون في تقارير التشغيل."),
];
export const workflowNames = [
  pair("publish", "Publish", "نشر"),
  pair("sell-step", "Sell", "بيع"),
  pair("reserve-step", "Reserve", "حجز"),
  pair("replenish", "Replenish", "تجديد"),
  pair("understand-step", "Understand", "فهم الأرقام"),
];
export const diagramCopy = {
  inventoryEquivalent: pair(
    "inventory-equivalent",
    "Receive into a Store ledger, reserve for orders, consume on sale, and assemble components into finished stock.",
    "سجّل الاستلام في دفتر مخزون المتجر، واحجز للطلبات، واستهلك عند البيع، واجمع المكونات في مخزون نهائي.",
  ),
  catalogSurfaces: [
    pair("catalogue-visual", "Catalog", "الكتالوج"),
    pair("variants-visual", "Variants", "تركيبات المنتج"),
    pair("stock-visual", "Store ledger", "دفتر مخزون المتجر"),
  ],
};
export const narrativeCopy = {
  sellFlow: [
    pair("discover", "Discover", "الاكتشاف"),
    pair("choose", "Choose", "الاختيار"),
    pair("checkout", "Checkout", "إتمام الشراء"),
  ],
  purchasingFlow: [
    pair("supplier", "Supplier", "المورد"),
    pair("purchase-order", "Purchase order", "أمر الشراء"),
    pair("receive-order", "Receive", "استلام"),
  ],
  ordersFlow: [
    pair("reserve-order", "Reserve", "حجز"),
    pair("fulfil", "Fulfil", "تجهيز"),
    pair("history", "Order history", "سجل الطلبات"),
  ],
  posFlow: [
    pair("open-shift", "Open a shift", "فتح الوردية"),
    pair("record-sale", "Record a sale", "تسجيل البيع"),
    pair("receipt", "Issue a receipt", "إصدار الإيصال"),
  ],
  customersFlow: [
    copy.business,
    copy.storeA,
    pair("profile", "Store customer profile", "ملف العميل في المتجر"),
  ],
  understandFlow: [
    pair("sales", "Sales & stock", "المبيعات والمخزون"),
    pair("records", "Financial records", "السجلات المالية"),
    pair("reports", "Operational reports", "تقارير التشغيل"),
  ],
  operateBody: pair(
    "operate-body-public",
    "Business ownership, Store-specific grants, controlled stock movements, auditable events, and private media keep operating boundaries explicit.",
    "تحافظ ملكية النشاط وصلاحيات كل متجر وحركات المخزون المنضبطة والأحداث القابلة للمراجعة والوسائط الخاصة على حدود تشغيل واضحة.",
  ),
  platform: pair(
    "platform-public",
    "Installable PWA and cached assets; web push when configured; Store-aware hosts; managed handles; custom-domain registry; private media.",
    "تطبيق قابل للتثبيت وأصول مخزنة؛ إشعارات ويب عند الإعداد؛ عناوين واعية بالمتجر؛ عناوين مُدارة؛ سجل النطاقات؛ وسائط خاصة.",
  ),
};
export const metadata = {
  en: {
    title: "Jizrak — connected commerce for every Store",
    description:
      "Run branded Stores, catalog, orders, inventory, purchasing, customers, finance, and POS in one Arabic-first commerce system built for Arab businesses.",
  },
  ar: {
    title: "جِذرك — تجارة مترابطة لكل متجر",
    description:
      "نظام واحد لإدارة المتاجر بعلاماتها والكتالوج والطلبات والمخزون والمشتريات والعملاء والمالية ونقاط البيع، مصمم للأنشطة التجارية العربية.",
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
      mainNav: "Main navigation",
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
      mainNav: "التنقل الرئيسي",
    },
  },
};
