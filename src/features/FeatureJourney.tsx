import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Search,
  Sun,
  Moon,
  X,
  Package,
  Store,
  ShoppingBag,
  Warehouse,
  CheckCheck,
} from "lucide-react";
import { usePreferences } from "../app/preferences";
import { config } from "../app/config";
import { StageLine } from "../components/StageLine";
import { featureGroups, text, type FeatureGroup } from "./content";
import "./features.css";
import { mountFeatureMotion } from "./motion";

const topics = [
  { id: "brand", label: text("Make it yours", "هويتك") },
  { id: "prepare", label: text("Prepare to sell", "استعد للبيع") },
  { id: "sell", label: text("Follow a sale", "تابع عملية بيع") },
  { id: "understand", label: text("See the picture", "افهم نشاطك") },
  { id: "grow", label: text("Make room to grow", "توسّع") },
];
const receivedStages = [
  { id: "purchase", label: text("Order from supplier", "اطلب من المورد") },
  { id: "receive", label: text("Receive at a location", "استلم في الموقع") },
  {
    id: "available",
    label: text("Make stock available", "أتِح المخزون للبيع"),
  },
];
const mounted = new WeakSet<HTMLElement>();

export function FeatureJourney() {
  const { locale, theme, setLocale, setTheme } = usePreferences();
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const root = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [detail, setDetail] = useState<FeatureGroup>(featureGroups[0]);
  const [active, setActive] = useState("brand");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("NOUR");
  const [clay, setClay] = useState(false);
  const [components, setComponents] = useState(8);
  const [channel, setChannel] = useState<"online" | "counter">("online");
  const [step, setStep] = useState(0);
  const sold = channel === "online" ? step === 2 : step >= 1;
  const reserved = channel === "online" && step === 1 ? 1 : 0;
  const onHand = sold ? 23 : 24;
  const filtered = featureGroups.filter((group) =>
    [
      group.title[locale],
      group.intro[locale],
      ...group.items.map((item) => item[locale]),
      group.note?.[locale] ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const openDetail = (id: string, trigger: HTMLElement) => {
    const group = featureGroups.find((item) => item.id === id);
    if (!group) return;
    setDetail(group);
    opener.current = trigger;
    drawer.current?.showModal();
  };
  const detailButton = (id: string) => {
    const group = featureGroups.find((item) => item.id === id)!;
    return (
      <button
        className="f-detail-link"
        aria-haspopup="dialog"
        onClick={(event) => openDetail(id, event.currentTarget)}
      >
        {group.title[locale]}
        <Plus size={16} aria-hidden="true" />
      </button>
    );
  };

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const cleanMotion = mountFeatureMotion(element);
    let cancelled = false;
    let layout: (() => void) | undefined;
    const mount = () => {
      if (cancelled || !window.ScrollCraft || mounted.has(element)) return;
      mounted.add(element);
      layout = window.ScrollCraft.mount(element).layout;
      element.classList.add("f-ready");
    };
    let script: HTMLScriptElement | undefined;
    if (window.ScrollCraft) mount();
    else {
      script = document.createElement("script");
      script.src = "/scrollcraft/scrollcraft.js";
      script.addEventListener("load", mount);
      document.head.append(script);
    }
    const reflow = () => layout?.();
    document.fonts.ready.then(reflow);
    window.addEventListener("jizrak:reflow", reflow);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-22% 0px -55% 0px" },
    );
    element
      .querySelectorAll<HTMLElement>("[data-topic]")
      .forEach((section) => observer.observe(section));
    return () => {
      cleanMotion();
      cancelled = true;
      script?.removeEventListener("load", mount);
      observer.disconnect();
      window.removeEventListener("jizrak:reflow", reflow);
    };
  }, []);

  useEffect(() => {
    const dialog = drawer.current;
    if (!dialog) return;
    const restore = () => opener.current?.focus({ preventScroll: true });
    dialog.addEventListener("close", restore);
    return () => dialog.removeEventListener("close", restore);
  }, []);

  return (
    <div
      ref={root}
      className="feature-journey"
      lang={locale}
      dir={ar ? "rtl" : "ltr"}
    >
      <a className="f-skip" href="#feature-main">
        {t("Skip to features", "انتقل إلى الميزات")}
      </a>
      <header className="f-header">
        <a
          href="/"
          className="f-brand"
          aria-label={t("Jizrak home", "الرئيسية، جِذرك")}
        >
          <img src="/icons/favicon.svg" width="32" height="32" alt="" />
          {t("jizrak", "جِذرك")}
        </a>
        <a className="f-back" href="/">
          <ArrowLeft size={15} aria-hidden="true" />
          {t("The big picture", "النظرة العامة")}
        </a>
        <div className="f-tools">
          <button
            lang={ar ? "en" : "ar"}
            onClick={() => setLocale(ar ? "en" : "ar")}
          >
            {ar ? "English" : "العربية"}
          </button>
          <button
            aria-label={t("Change color theme", "تغيير ألوان الصفحة")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <nav
        className="f-topic-nav"
        aria-label={t("Feature chapters", "فصول الميزات")}
      >
        <div>
          {topics.map((topic) => (
            <a
              key={topic.id}
              href={`#${topic.id}`}
              aria-current={active === topic.id ? "location" : undefined}
            >
              {topic.label[locale]}
            </a>
          ))}
        </div>
        <a href="#feature-index" className="f-index-link">
          {t("All features", "كل الميزات")}
          <Plus size={14} aria-hidden="true" />
        </a>
      </nav>

      <main id="feature-main" tabIndex={-1}>
        <section id="brand" data-topic data-sc-act="flow" className="f-opening">
          <div className="f-wrap">
            <div className="f-title">
              <p className="f-kicker">
                {t("THE STORE OWNER'S GUIDE", "دليل صاحب المتجر")}
              </p>
              <h1>
                {t("Your store.\nThe whole story.", "متجرك.\nبكل تفاصيله.")}
              </h1>
              <p>
                {t(
                  "From the brand you build to the business you run. Meet the tools behind every working day.",
                  "من الهوية التي تصنعها إلى النشاط الذي تديره. تعرّف على أدوات كل يوم عمل.",
                )}
              </p>
              <a className="f-text-link" href="#feature-index">
                {t("Explore all features", "استكشف كل الميزات")}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="f-brand-scene" data-clay={clay}>
              <div
                className="f-scene-grid"
                aria-hidden="true"
                data-sc-parallax="-0.3"
              />
              <div className="f-brand-sheet" data-sc-parallax="-0.65">
                <span className="f-specimen-caption">
                  {t("YOUR BRAND, YOUR STOREFRONT", "هويتك، واجهة متجرك")}
                </span>
                <strong className="f-specimen-name" dir="auto">
                  {brand.trim() || "NOUR"}
                </strong>
                <div className="f-product-outline" aria-hidden="true">
                  <ShoppingBag strokeWidth={0.65} />
                </div>
                <span>
                  {t(
                    "Considered goods. Everyday rituals.",
                    "منتجات مختارة. تفاصيل يومية.",
                  )}
                </span>
              </div>
              <div className="f-brand-slip" data-sc-parallax="0.45">
                <Check size={20} aria-hidden="true" />
                <span>
                  {t("Arabic & English", "بالعربية والإنجليزية")}
                  <small>
                    {t(
                      "A storefront in both directions",
                      "واجهة تناسب اتجاه كل لغة",
                    )}
                  </small>
                </span>
              </div>
              <span className="f-sample-caption">
                {t("Interactive brand illustration", "مثال تفاعلي للهوية")}
              </span>
            </div>
            <div className="f-brand-editor">
              <label>
                {t("Try your store name", "جرّب اسم متجرك")}
                <input
                  value={brand}
                  maxLength={22}
                  onChange={(event) => setBrand(event.target.value)}
                />
              </label>
              <div
                className="f-swatches"
                role="group"
                aria-label={t("Illustration color", "لون المثال")}
              >
                <button
                  aria-label={t("Forest", "أخضر")}
                  aria-pressed={!clay}
                  className="f-swatch-forest"
                  onClick={() => setClay(false)}
                >
                  {!clay && <Check size={16} />}
                </button>
                <button
                  aria-label={t("Terracotta", "طوبي")}
                  aria-pressed={clay}
                  className="f-swatch-clay"
                  onClick={() => setClay(true)}
                >
                  {clay && <Check size={16} />}
                </button>
              </div>
              <p>
                {t(
                  "Your logo, colors, fonts and layouts. Your own voice in two languages.",
                  "شعارك وألوانك وخطوطك وتخطيطك. وصوت علامتك باللغتين.",
                )}
              </p>
              {detailButton("brand")}
            </div>
          </div>
        </section>

        <section
          id="prepare"
          data-topic
          data-sc-act="flow"
          className="f-prepare"
        >
          <div className="f-wrap">
            <div className="f-section-heading">
              <h2>
                {t(
                  "Give every product\na solid beginning.",
                  "ابدأ كل منتج\nبتفاصيل واضحة.",
                )}
              </h2>
              <p>
                {t(
                  "A product can have sizes, colors, prices and a stock item behind each variant. A finished piece can depend on several components. Jizrak keeps those relationships visible.",
                  "قد يكون للمنتج مقاسات وألوان وأسعار وصنف مخزون وراء كل متغير. وقد يتكوّن من عدة أجزاء. جِذرك يربط هذه التفاصيل ببعضها.",
                )}
              </p>
            </div>
            <div className="f-prepare-spread">
              <div className="f-component-demo">
                <div
                  className="f-component-art"
                  data-sc-reveal="up"
                  data-sc-reveal-at="0.05 0.35"
                  aria-hidden="true"
                >
                  <div className="f-outline-box">
                    <Package size={80} strokeWidth={0.7} />
                    <span>× 1</span>
                  </div>
                  <Plus size={20} />
                  <div className="f-outline-box">
                    <ShoppingBag size={80} strokeWidth={0.7} />
                    <span>× 2</span>
                  </div>
                  <span className="f-equals">=</span>
                  <div className="f-finished-box">
                    <ShoppingBag size={68} strokeWidth={0.8} />
                  </div>
                </div>
                <div className="f-component-controls">
                  <div>
                    <p className="f-small-label">
                      {t("SAMPLE GIFT SET", "مثال: مجموعة هدايا")}
                    </p>
                    <h3>{t("One box. Two pieces.", "صندوق واحد. قطعتان.")}</h3>
                    <p>
                      {t(
                        "6 boxes in stock. Change the pieces available.",
                        "6 صناديق في المخزون. غيّر عدد القطع المتاحة.",
                      )}
                    </p>
                  </div>
                  <div className="f-stepper">
                    <button
                      aria-label={t("Fewer pieces", "قطع أقل")}
                      disabled={components <= 0}
                      onClick={() => setComponents((value) => value - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <output aria-live="polite">{components}</output>
                    <button
                      aria-label={t("More pieces", "قطع أكثر")}
                      disabled={components >= 16}
                      onClick={() => setComponents((value) => value + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <p className="f-assembly-result" aria-live="polite">
                  <strong>{Math.min(6, Math.floor(components / 2))}</strong>
                  {t("complete sets available", "مجموعات كاملة متاحة")}
                </p>
                <small>
                  {t(
                    "Illustrative component calculation. No stock is changed.",
                    "حساب توضيحي للمكونات. لا يغيّر أي مخزون فعلي.",
                  )}
                </small>
              </div>
              <div className="f-prep-notes">
                <article>
                  <h3>
                    {t(
                      "A catalog with room for detail.",
                      "كتالوج يتسع للتفاصيل.",
                    )}
                  </h3>
                  <p>
                    {t(
                      "Create variants, organize categories, import product data and build bundles or offers around what you sell.",
                      "أنشئ المتغيرات ونظّم التصنيفات واستورد بيانات المنتجات، ثم أضف الباقات والعروض المناسبة.",
                    )}
                  </p>
                  <div className="f-detail-links">
                    {detailButton("catalog")}
                    {detailButton("offers")}
                  </div>
                </article>
                <article>
                  <h3>
                    {t(
                      "Stock you can account for.",
                      "مخزون تعرف حركة كل صنف فيه.",
                    )}
                  </h3>
                  <p>
                    {t(
                      "Track quantities, costs and movements by location. Receive purchases and assemble finished items with a history of what changed.",
                      "تابع الكميات والتكاليف والحركات حسب الموقع. استلم المشتريات وجمّع المنتجات النهائية مع سجل لكل تغيير.",
                    )}
                  </p>
                  <div className="f-detail-links">
                    {detailButton("inventory")}
                    {detailButton("assembly")}
                    {detailButton("purchasing")}
                  </div>
                </article>
              </div>
            </div>
            <StageLine
              stages={receivedStages.map((stage) => ({
                ...stage,
                label: { ...stage.label, id: stage.id },
              }))}
              label={t(
                "From purchase to available stock",
                "من الشراء إلى المخزون المتاح",
              )}
            />
          </div>
        </section>

        <section id="sell" data-topic data-sc-act="flow" className="f-sell">
          <div className="f-wrap">
            <div className="f-section-heading">
              <p className="f-kicker">
                {t("THE CONNECTION THAT MATTERS", "الرابط الذي تعتمد عليه")}
              </p>
              <h2>
                {t("One sale.\nA clear trail.", "عملية بيع واحدة.\nأثر واضح.")}
              </h2>
              <p>
                {t(
                  "The storefront is where an online order begins. The work continues through stock, fulfilment and records. Try the two ways a sale moves through your business.",
                  "تبدأ الطلبات الإلكترونية من الواجهة، ثم تمر بالمخزون والتجهيز والسجلات. جرّب مسار البيع الإلكتروني ومسار البيع المباشر.",
                )}
              </p>
            </div>
            <div className="f-sale-spread">
              <div className="f-sale-console">
                <p className="f-small-label">
                  {t(
                    "INTERACTIVE EXAMPLE · SAMPLE DATA",
                    "مثال تفاعلي · بيانات توضيحية",
                  )}
                </p>
                <div
                  className="f-channel"
                  role="group"
                  aria-label={t("Sales channel", "قناة البيع")}
                >
                  <button
                    aria-pressed={channel === "online"}
                    onClick={() => {
                      setChannel("online");
                      setStep(0);
                    }}
                  >
                    {t("Online order", "طلب إلكتروني")}
                  </button>
                  <button
                    aria-pressed={channel === "counter"}
                    onClick={() => {
                      setChannel("counter");
                      setStep(0);
                    }}
                  >
                    {t("At the counter", "عند نقطة البيع")}
                  </button>
                </div>
                <div className="f-order-head">
                  <ShoppingBag size={36} strokeWidth={1} aria-hidden="true" />
                  <div>
                    <strong dir="auto">{brand.trim() || "NOUR"}</strong>
                    <span>
                      {t("Everyday bag · 1 item", "حقيبة يومية · قطعة واحدة")}
                    </span>
                  </div>
                  <span>
                    <bdi>480</bdi> {t("EGP", "ج.م")}
                  </span>
                </div>
                <div
                  className="f-stock-ledger"
                  aria-live="polite"
                  key={`${channel}-${step}`}
                >
                  <div>
                    <span>{t("On hand", "الموجود")}</span>
                    <strong>{onHand}</strong>
                  </div>
                  <div>
                    <span>{t("Reserved", "المحجوز")}</span>
                    <strong>{reserved}</strong>
                  </div>
                  <div>
                    <span>{t("Available", "المتاح")}</span>
                    <strong>{onHand - reserved}</strong>
                  </div>
                </div>
                <div className="f-stock-dots" aria-hidden="true">
                  {Array.from({ length: 24 }, (_, i) => (
                    <i
                      key={i}
                      data-state={
                        i === 23
                          ? sold
                            ? "sold"
                            : reserved
                              ? "reserved"
                              : "stock"
                          : "stock"
                      }
                    />
                  ))}
                </div>
                <p className="f-sale-state" role="status">
                  {step === 0
                    ? t(
                        "Ready to sell. All 24 items are available.",
                        "جاهز للبيع. كل القطع الـ24 متاحة.",
                      )
                    : channel === "online"
                      ? step === 1
                        ? t(
                            "Order placed. One item is reserved, still physically on hand.",
                            "تم الطلب. حُجزت قطعة وما زالت موجودة فعليًا.",
                          )
                        : t(
                            "Fulfilled. The reserved item has now left stock.",
                            "تم التجهيز. خُصمت القطعة المحجوزة من المخزون.",
                          )
                      : step === 1
                        ? t(
                            "Sale recorded. One item consumed and cash tender recorded.",
                            "سُجّل البيع. خُصمت قطعة وسُجّل الدفع النقدي.",
                          )
                        : t(
                            "Shift closed. The sale remains in the searchable history.",
                            "أُغلقت الوردية. بقي البيع في السجل القابل للبحث.",
                          )}
                </p>
                <div className="f-sale-actions">
                  <button
                    className="f-primary"
                    disabled={step === 2}
                    onClick={() => setStep((value) => Math.min(2, value + 1))}
                  >
                    {step === 2
                      ? t("Example complete", "اكتمل المثال")
                      : channel === "online"
                        ? step === 0
                          ? t("Place sample order", "أنشئ طلبًا تجريبيًا")
                          : t("Fulfil sample order", "جهّز الطلب التجريبي")
                        : step === 0
                          ? t("Record sample sale", "سجّل بيعًا تجريبيًا")
                          : t("Close sample shift", "أغلق الوردية التجريبية")}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <button className="f-reset" onClick={() => setStep(0)}>
                    {t("Reset", "إعادة")}
                  </button>
                </div>
                <small>
                  {t(
                    "Simplified example, excluding tax and shipping. Nothing is ordered or charged.",
                    "مثال مبسّط دون ضريبة أو شحن. لا ينشئ طلبًا أو يخصم أموالًا.",
                  )}
                </small>
              </div>
              <div className="f-sale-story">
                <article>
                  <span className="f-story-mark">
                    <ShoppingBag size={21} />
                  </span>
                  <h3>{t("Make the order possible.", "هيّئ الطريق للطلب.")}</h3>
                  <p>
                    {t(
                      "Search, filters and product options help a customer choose. Cart quantities are checked against stock, and checkout uses your configured shipping and tax rules.",
                      "يساعد البحث والفلاتر وخيارات المنتج العميل على الاختيار. تُراجع كميات السلة وفق المخزون، ويستخدم إتمام الطلب قواعد الشحن والضريبة التي حددتها.",
                    )}
                  </p>
                  <div className="f-detail-links">
                    {detailButton("checkout")}
                    {detailButton("shipping")}
                  </div>
                </article>
                <article>
                  <span className="f-story-mark">
                    <Package size={21} />
                  </span>
                  <h3>
                    {t("Know what is promised.", "اعرف ما حُجز للطلبات.")}
                  </h3>
                  <p>
                    {t(
                      "An online order reserves its stock. Reservation reduces what is available to sell, while on-hand stock remains until consumption. Pick lists and fulfilment records guide the next step.",
                      "يحجز الطلب الإلكتروني مخزونه. يقل المتاح للبيع مع بقاء الكمية الموجودة حتى خصمها. قوائم جمع الأصناف وسجلات التجهيز توضح الخطوة التالية.",
                    )}
                  </p>
                  {detailButton("orders")}
                </article>
                <article>
                  <span className="f-story-mark">
                    <CheckCheck size={21} />
                  </span>
                  <h3>
                    {t(
                      "Keep the counter connected.",
                      "اربط البيع المباشر بالمخزون.",
                    )}
                  </h3>
                  <p>
                    {t(
                      "Select the store, location and register. Record a sale, its tender and receipt, then close the shift with counted cash and a visible variance.",
                      "اختر المتجر والموقع والصندوق. سجّل البيع ووسيلة الدفع والإيصال، ثم أغلق الوردية مع تسجيل النقد المعدود والفرق.",
                    )}
                  </p>
                  {detailButton("pos")}
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          id="understand"
          data-topic
          data-sc-act="flow"
          className="f-understand"
        >
          <div className="f-wrap">
            <div className="f-section-heading">
              <h2>
                {t(
                  "The order ends.\nThe relationship grows.",
                  "ينتهي الطلب.\nوتستمر العلاقة.",
                )}
              </h2>
              <p>
                {t(
                  "Know who returns, what sells and what the business earns. Customer history and financial records give your next decision somewhere to begin.",
                  "اعرف من يعود للشراء وما يُباع وما يحققه النشاط. سجل العملاء والسجلات المالية تمنح قرارك التالي أساسًا واضحًا.",
                )}
              </p>
            </div>
            <div className="f-records-spread" data-sc-in>
              <div className="f-customer-record">
                <span className="f-small-label">
                  {t("THE CUSTOMER SIDE", "جانب العميل")}
                </span>
                <h3>
                  {t("A history worth keeping.", "سجل يستحق الاحتفاظ به.")}
                </h3>
                <ul>
                  <li>
                    <Check size={17} />
                    {t(
                      "Profiles, addresses and order history",
                      "ملفات وعناوين وسجل طلبات",
                    )}
                  </li>
                  <li>
                    <Check size={17} />
                    {t(
                      "Favorites, reviews and loyalty balances",
                      "مفضلات ومراجعات وأرصدة ولاء",
                    )}
                  </li>
                  <li>
                    <Check size={17} />
                    {t(
                      "Consent for the way you communicate",
                      "موافقات على طرق التواصل",
                    )}
                  </li>
                </ul>
                <div className="f-detail-links">
                  {detailButton("customers")}
                  {detailButton("engagement")}
                </div>
              </div>
              <div className="f-finance-record">
                <span className="f-small-label">
                  {t(
                    "YOUR SAMPLE SALE, CARRIED FORWARD",
                    "عملية البيع التجريبية في سجلاتك",
                  )}
                </span>
                <h3>
                  {sold
                    ? t(
                        "A sale with a cost behind it.",
                        "إيراد وتكلفة وراء البيع.",
                      )
                    : t(
                        "A record starts with a sale.",
                        "يبدأ السجل بعملية بيع.",
                      )}
                </h3>
                <dl>
                  <div>
                    <dt>{t("Sample sale value", "قيمة البيع التجريبي")}</dt>
                    <dd>
                      {sold ? 480 : 0} {t("EGP", "ج.م")}
                    </dd>
                  </div>
                  <div>
                    <dt>
                      {t("Illustrative item cost", "تكلفة القطعة في المثال")}
                    </dt>
                    <dd>
                      {sold ? 180 : 0} {t("EGP", "ج.م")}
                    </dd>
                  </div>
                  <div className="f-gross">
                    <dt>
                      {t("Before other expenses", "قبل المصروفات الأخرى")}
                    </dt>
                    <dd>
                      {sold ? 300 : 0} {t("EGP", "ج.م")}
                    </dd>
                  </div>
                </dl>
                <p>
                  {t(
                    "Illustrative arithmetic, not a live report. Jizrak records supported sales and costs alongside expenses, assets and accounting reports.",
                    "حساب توضيحي وليس تقريرًا فعليًا. يسجّل جِذرك المبيعات والتكاليف المدعومة إلى جانب المصروفات والأصول والتقارير المحاسبية.",
                  )}
                </p>
                {!sold && (
                  <a href="#sell" className="f-text-link">
                    {t("Complete the sample sale", "أكمل البيع التجريبي")}
                    <ArrowUpRight size={16} />
                  </a>
                )}
                {detailButton("insights")}
              </div>
            </div>
          </div>
        </section>

        <section id="grow" data-topic data-sc-act="flow" className="f-grow">
          <div className="f-wrap">
            <div className="f-growth-copy">
              <h2>
                {t(
                  "More stores.\nStill your business.",
                  "متاجر أكثر.\nتحت نشاطك.",
                )}
              </h2>
              <p>
                {t(
                  "Open the next brand under the same business. Give it its own catalog, team permissions, customers and finances. Even when two stores share a location, their stock ledgers stay separate.",
                  "أطلق العلامة التالية تحت النشاط نفسه، بكتالوج وصلاحيات فريق وعملاء وماليات خاصة بها. وحتى حين يتشارك متجران موقعًا، تبقى سجلات مخزونهما منفصلة.",
                )}
              </p>
              <div className="f-detail-links">
                {detailButton("business")}
                {detailButton("team")}
                {detailButton("safety")}
              </div>
            </div>
            <figure className="f-store-map">
              <div className="f-location">
                <Warehouse size={28} strokeWidth={1} />
                <span>{t("One shared location", "موقع مشترك واحد")}</span>
              </div>
              <svg viewBox="0 0 440 100" fill="none" aria-hidden="true">
                <path d="M220 0V45H95V100" pathLength="1" />
                <path d="M220 0V45H345V100" pathLength="1" />
              </svg>
              <div className="f-store-pair">
                <div>
                  <Store size={25} strokeWidth={1} />
                  <strong dir="auto">{brand.trim() || "NOUR"}</strong>
                  <span>{t("Its own stock ledger", "سجل مخزون مستقل")}</span>
                </div>
                <div>
                  <Store size={25} strokeWidth={1} />
                  <strong>{t("Your next brand", "علامتك التالية")}</strong>
                  <span>{t("Its own stock ledger", "سجل مخزون مستقل")}</span>
                </div>
              </div>
              <figcaption>
                {t(
                  "Shared space. Separate store records. Illustrative structure.",
                  "مكان مشترك وسجلات متاجر مستقلة. هيكل توضيحي.",
                )}
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="feature-index" className="f-reference">
          <div className="f-wrap">
            <div className="f-index-heading">
              <div>
                <p className="f-kicker">{t("KEEP EXPLORING", "للتفاصيل")}</p>
                <h2>
                  {t(
                    "The details,\nwhen you need them.",
                    "التفاصيل،\nحين تحتاجها.",
                  )}
                </h2>
                <p>
                  {t(
                    "Open any topic for the capabilities and the boundaries that matter to your store.",
                    "افتح أي موضوع لمعرفة إمكاناته وحدوده التي تهم متجرك.",
                  )}
                </p>
              </div>
              <label className="f-search">
                <span>{t("Find a feature", "ابحث عن ميزة")}</span>
                <div>
                  <Search size={19} aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    placeholder={t(
                      "Try inventory, loyalty, shipping…",
                      "جرّب المخزون أو الولاء أو الشحن…",
                    )}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </label>
            </div>
            <p className="sr-only" role="status">
              {filtered.length} {t("topics found", "موضوعًا مطابقًا")}
            </p>
            <div className="f-reference-list">
              {filtered.map((group) => (
                <details key={group.id}>
                  <summary>
                    {group.title[locale]}
                    <Plus size={18} aria-hidden="true" />
                  </summary>
                  <p>{group.intro[locale]}</p>
                  <ul>
                    {group.items.map((item, i) => (
                      <li key={i}>{item[locale]}</li>
                    ))}
                  </ul>
                  {group.note && (
                    <p className="f-boundary">
                      <strong>
                        {t("Worth knowing", "قبل أن تعتمد عليها")}
                      </strong>
                      {group.note[locale]}
                    </p>
                  )}
                </details>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="f-no-results">
                {t(
                  "No matching topic. Try a broader term or",
                  "لا توجد نتائج. جرّب كلمة أعم أو",
                )}{" "}
                <button onClick={() => setQuery("")}>
                  {t("show all features", "اعرض كل الميزات")}
                </button>
                .
              </p>
            )}
            <div className="f-close">
              <div>
                <h3>{t("Picture your business here.", "تخيّل نشاطك هنا.")}</h3>
                <p>
                  {t(
                    "Your brand. Your products. Room for the next step.",
                    "علامتك ومنتجاتك، ومساحة للخطوة التالية.",
                  )}
                </p>
              </div>
              <a
                className="f-primary"
                href={config.start.startsWith("#") ? "/" : config.start}
              >
                {config.start.startsWith("#")
                  ? t("Return to overview", "العودة للنظرة العامة")
                  : t("Start your business", "ابدأ نشاطك")}
                <ArrowUpRight size={18} />
              </a>
            </div>
            <footer className="f-footer">
              <a href="/">
                {t(
                  "Jizrak · Back to the big picture",
                  "جِذرك · العودة للنظرة العامة",
                )}
              </a>
              <div>
                {config.privacy && (
                  <a href={config.privacy}>{t("Privacy", "الخصوصية")}</a>
                )}
                {config.terms && (
                  <a href={config.terms}>{t("Terms", "الشروط")}</a>
                )}
                <a href="#brand">{t("Back to top", "العودة للأعلى")}</a>
              </div>
            </footer>
          </div>
        </section>
      </main>
      <dialog
        ref={drawer}
        className="f-drawer"
        aria-labelledby="feature-detail-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) drawer.current?.close();
        }}
      >
        <div className="f-drawer-inner">
          <div className="f-drawer-top">
            <span>{t("A CLOSER LOOK", "نظرة أقرب")}</span>
            <button
              autoFocus
              aria-label={t("Close feature details", "إغلاق تفاصيل الميزة")}
              onClick={() => drawer.current?.close()}
            >
              <X size={23} />
            </button>
          </div>
          <h2 id="feature-detail-title">{detail.title[locale]}</h2>
          <p className="f-drawer-intro">{detail.intro[locale]}</p>
          <ul>
            {detail.items.map((item, i) => (
              <li key={i}>
                <Check size={18} aria-hidden="true" />
                <span>{item[locale]}</span>
              </li>
            ))}
          </ul>
          {detail.note && (
            <p className="f-boundary">
              <strong>{t("Worth knowing", "قبل أن تعتمد عليها")}</strong>
              {detail.note[locale]}
            </p>
          )}
          <button
            className="f-text-link"
            onClick={() => drawer.current?.close()}
          >
            {t("Back to the story", "العودة للقصة")}
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </div>
  );
}
