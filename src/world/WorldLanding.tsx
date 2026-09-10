import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  X,
  Plus,
  Minus,
  Sun,
  Moon,
  Store,
  Package,
  ShoppingBag,
  Users,
  ChartNoAxesCombined,
  Warehouse,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { usePreferences } from "../app/preferences";
import { config } from "../app/config";
import { copy, sections } from "../content";
import { publicDetails } from "../apple/publicContent";
import { candidateCopy } from "../apple/candidateContent";
import "./world.css";

const weights = [1.2, 1.2, 2, 1.2, 1.2];
const starts = [0, 1.2, 2.4, 4.4, 5.6];
const total = 6.8;
const windows = [
  "0 0.1765 0 0.045",
  "0.1765 0.353 0.045 0.045",
  "0.353 0.647 0.03 0.03",
  "0.647 0.8235 0.045 0.045",
  "0.8235 1 0.045 0",
];
const names = [
  ["Your business", "نشاطك"],
  ["Your brand", "علامتك"],
  ["Your operations", "عملياتك"],
  ["Your decisions", "قراراتك"],
  ["Your next store", "توسّعك"],
];
type Engine = { mount: (root: HTMLElement) => { layout: () => void } };
declare global {
  interface Window {
    ScrollCraft?: Engine;
  }
}
let enginePromise: Promise<void> | undefined;
const mounted = new WeakSet<HTMLElement>();
function loadEngine() {
  if (window.ScrollCraft) return Promise.resolve();
  return (enginePromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/scrollcraft/scrollcraft.js";
    script.onload = () => resolve();
    script.onerror = () => {
      enginePromise = undefined;
      reject(new Error("Scroll engine unavailable"));
    };
    document.head.append(script);
  }));
}

function ProductArt({ apparel = false }: { apparel?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 220"
      fill="none"
      aria-hidden="true"
      className="w-product-art"
    >
      <defs>
        <linearGradient
          id={apparel ? "fabric-shirt" : "fabric-bag"}
          x1="50"
          y1="55"
          x2="195"
          y2="185"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#becbbc" />
          <stop offset="0.52" stopColor="#819780" />
          <stop offset="1" stopColor="#506950" />
        </linearGradient>
      </defs>
      <ellipse cx="123" cy="197" rx="68" ry="10" fill="#263e2d" opacity=".14" />
      {apparel ? (
        <>
          <path
            d="m82 44 25-10c4 12 21 12 26 0l26 10 36 42-30 24-13-16 6 91H81l6-91-13 16-30-24 38-42Z"
            fill="url(#fabric-shirt)"
          />
          <path
            d="M107 34c4 12 21 12 26 0M86 93l-5 92h77l-6-92M98 61v105"
            stroke="#e5e9df"
            strokeOpacity=".4"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path d="m67 68 103-9 22 126-121 9-4-126Z" fill="url(#fabric-bag)" />
          <path d="m170 59 17 15 18 113-13-2-22-126Z" fill="#486149" />
          <path
            d="M94 81V52c0-39 49-40 49-4v29"
            stroke="#475d45"
            strokeWidth="9"
          />
          <path
            d="M98 80V52c0-30 41-35 41-3v29"
            stroke="#aebda6"
            strokeWidth="3"
          />
          <path
            d="m76 76 85-8 21 109-102 8-4-109Z"
            stroke="#dfe6d7"
            strokeOpacity=".32"
          />
          <path d="m112 123 12 14 22-31" stroke="#e4eadd" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function WorldLanding() {
  const { locale, theme, setLocale, setTheme } = usePreferences();
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [apparel, setApparel] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [panel, setPanel] = useState<"features" | "start" | "signin">(
    "features",
  );
  const brand = apparel ? "FORME" : "EVERYDAY";
  const product = apparel
    ? t("Everyday tee", "قميص يومي")
    : t("Everyday tote", "حقيبة يومية");
  const navigate = (index: number) => {
    const el = host.current?.querySelector<HTMLElement>("[data-sc-spacer]");
    const viewport = el ? el.offsetHeight / (total + 1) : innerHeight;
    window.scrollTo({
      top: (starts[index] + (index ? weights[index] * 0.35 : 0)) * viewport,
      behavior: "instant",
    });
    setActive(index);
  };
  const openPanel = (kind: typeof panel) => {
    setPanel(kind);
    dialog.current?.showModal();
  };

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    let disposed = false;
    let frame = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    let pointerX = 0,
      pointerY = 0;
    const update = () => {
      frame = 0;
      const spacer = root.querySelector<HTMLElement>("[data-sc-spacer]");
      const range =
        (spacer?.offsetHeight ?? (total + 1) * innerHeight) - innerHeight;
      const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, range)));
      const time = progress * total;
      const index = starts.reduce(
        (found, start, i) => (time >= start - 0.06 ? i : found),
        0,
      );
      setActive(index);
      // A continuous camera moves through one persistent diagram. No scene swaps.
      const keys = [
        [0, 0, 1, -9],
        [0.24, -65, 1.15, -4],
        [0.48, -10, 0.86, 2],
        [0.72, 55, 0.92, 5],
        [1, 0, 0.78, 0],
      ];
      const k = Math.min(
        3,
        keys.reduce((found, key, i) => (progress >= key[0] ? i : found), 0),
      );
      const a = keys[k],
        b = keys[k + 1];
      const mix = Math.min(1, (progress - a[0]) / (b[0] - a[0]));
      const eased = mix * mix * (3 - 2 * mix);
      const x = reduced.matches ? 0 : a[1] + (b[1] - a[1]) * eased;
      const scale = reduced.matches ? 0.88 : a[2] + (b[2] - a[2]) * eased;
      const rotation = reduced.matches ? 0 : a[3] + (b[3] - a[3]) * eased;
      const expansion = Math.min(1, Math.max(0, (progress - 0.23) / 0.23));
      root.style.setProperty("--journey", progress.toFixed(4));
      root.style.setProperty("--expand", expansion.toFixed(4));
      root.style.setProperty(
        "--next-store",
        Math.min(1, Math.max(0, (progress - 0.76) / 0.14)).toFixed(4),
      );
      root.style.setProperty("--camera-x", `${x.toFixed(2)}px`);
      root.style.setProperty("--camera-scale", scale.toFixed(4));
      root.style.setProperty("--camera-rotate", `${rotation.toFixed(2)}deg`);
      root.style.setProperty(
        "--pointer-x",
        `${reduced.matches ? 0 : pointerX}px`,
      );
      root.style.setProperty(
        "--pointer-y",
        `${reduced.matches ? 0 : pointerY}px`,
      );
      if (scene.current)
        scene.current.dataset.scVerifyState = `${x.toFixed(1)}:${scale.toFixed(3)}:${rotation.toFixed(1)}:${expansion.toFixed(3)}:${pointerX.toFixed(1)}`;
      root.querySelectorAll<HTMLElement>("[data-sc-copy]").forEach((copyEl) => {
        const opacity = Number(
          copyEl.style.opacity || (copyEl.dataset.index === "0" ? 1 : 0),
        );
        copyEl.inert = opacity < 0.5;
        copyEl.setAttribute("aria-hidden", String(opacity < 0.5));
      });
    };
    // The engine writes copy visibility in its own animation frame. Read after
    // that frame so the newly visible panel becomes keyboard-accessible too.
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(update);
        });
    };
    const move = (event: PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType !== "mouse")
        return;
      pointerX = (event.clientX / innerWidth - 0.5) * 12;
      pointerY = (event.clientY / innerHeight - 0.5) * 8;
      schedule();
    };
    loadEngine()
      .then(() => {
        if (disposed) return;
        if (!mounted.has(root)) {
          window.ScrollCraft?.mount(root);
          mounted.add(root);
        }
        root.classList.add("w-ready");
        schedule();
      })
      .catch(() => {
        /* Full semantic reading layout remains available. */
      });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", move, { passive: true });
    reduced.addEventListener("change", schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", move);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div
      className="jizrak-world"
      ref={host}
      lang={locale}
      dir={ar ? "rtl" : "ltr"}
    >
      <a href="#world-main" className="w-skip">
        {t("Skip to journey", "انتقل إلى المحتوى")}
      </a>
      <header className="w-header">
        <a
          href="#"
          className="w-brand"
          aria-label="Jizrak"
          onClick={(e) => {
            e.preventDefault();
            navigate(0);
          }}
        >
          <img src="/icons/favicon.svg" alt="" width="36" height="36" />
          <span>{t("jizrak", "جِذرك")}</span>
        </a>
        <div className="w-header-links">
          <button onClick={() => openPanel("features")}>
            {t("Explore the platform", "استكشف المنصة")} <Plus size={14} />
          </button>
          <span>{t("Built around your business", "حول احتياجات نشاطك")}</span>
        </div>
        <div className="w-tools">
          <button
            className="w-icon-button w-mobile-platform"
            aria-label={t("Explore the platform", "استكشف المنصة")}
            onClick={() => openPanel("features")}
          >
            <Plus size={18} />
          </button>
          <button
            className="w-language"
            onClick={() => setLocale(ar ? "en" : "ar")}
            lang={ar ? "en" : "ar"}
          >
            {ar ? "English" : "العربية"}
          </button>
          <button
            className="w-icon-button w-theme"
            aria-label={t("Change color theme", "تغيير ألوان الصفحة")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="w-signin"
            onClick={() =>
              config.signin.startsWith("#")
                ? openPanel("signin")
                : location.assign(config.signin)
            }
          >
            {copy.signin[locale]} <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      <main
        id="world-main"
        tabIndex={-1}
        data-sc-mode="worldflight"
        data-sc-seam="0.16"
        data-sc-lerp="0.12"
      >
        <div
          data-sc-world
          className="w-world"
          ref={scene}
          data-sc-verify-state="initial"
        >
          {weights.map((weight, index) => (
            <div
              key={index}
              data-sc-segment
              data-sc-w={weight}
              data-sc-waypoint={names[index][ar ? 1 : 0]}
              className="w-leg"
              aria-hidden="true"
            />
          ))}
          <div className="w-atmosphere" aria-hidden="true" />
          <div className="w-grid" aria-hidden="true" />
          <div className="w-scene-position" aria-hidden="true">
            <div className="w-camera">
              <div className="w-ground">
                <span>JIZRAK</span>
              </div>
              <svg className="w-connections" viewBox="0 0 760 640" fill="none">
                <path
                  className="w-connection-base"
                  d="M380 305V195Q380 165 350 165H138V112M380 305H580Q610 305 610 335V450M380 305V455Q380 480 350 480H190M380 305H140Q105 305 105 335V435M380 305V90"
                />
                <path
                  className="w-connection-active"
                  pathLength="1"
                  d="M380 305V195Q380 165 350 165H138V112M380 305H580Q610 305 610 335V450M380 305V455Q380 480 350 480H190M380 305H140Q105 305 105 335V435M380 305V90"
                />
                {[
                  [380, 305],
                  [138, 112],
                  [610, 450],
                  [190, 480],
                  [105, 435],
                  [380, 90],
                ].map(([x, y]) => (
                  <g key={`${x}-${y}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="var(--w-ground)"
                      stroke="var(--w-accent)"
                    />
                    <circle cx={x} cy={y} r="3" fill="var(--w-accent)" />
                  </g>
                ))}
              </svg>
              <div className="w-store-surface">
                <div className="w-store-top">
                  <span>
                    {brand}
                    <i>®</i>
                  </span>
                  <span>☰</span>
                </div>
                <div className="w-store-content">
                  <div>
                    <span className="w-store-category">
                      {t("MADE FOR THE EVERYDAY", "تفاصيل لحياتك اليومية")}
                    </span>
                    <strong>
                      {apparel
                        ? t("Wear it your way.", "على ذوقك.")
                        : t(
                            "Good things.\nEvery day.",
                            "تفاصيل جميلة.\nكل يوم.",
                          )}
                    </strong>
                    <span className="w-shop-label">
                      {t("Explore collection", "تصفّح المجموعة")} ↗
                    </span>
                  </div>
                  <ProductArt apparel={apparel} />
                </div>
                <div className="w-store-bottom">
                  <span>
                    {t("Your brand. Your storefront.", "علامتك. واجهة متجرك.")}
                  </span>
                  <span>AR / EN</span>
                </div>
              </div>
              <div className="w-mini w-stock">
                <Warehouse size={20} />
                <span>{t("Inventory", "المخزون")}</span>
                <strong>
                  {24 - quantity}
                  <small>{t("available", "متاح")}</small>
                </strong>
                <div className="w-stock-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="w-mini w-customer">
                <Users size={20} />
                <span>{t("Customers", "العملاء")}</span>
                <div className="w-person">
                  <span>م</span>
                  <div>
                    {t("Customer history", "سجل العميل")}
                    <small>{t("Connected to the order", "مرتبط بالطلب")}</small>
                  </div>
                </div>
              </div>
              <div className="w-mini w-finance">
                <ChartNoAxesCombined size={20} />
                <span>{t("Financial records", "السجلات المالية")}</span>
                <div className="w-ledger-row">
                  <span>{t("Sales", "المبيعات")}</span>
                  <Check size={14} />
                </div>
                <div className="w-ledger-row">
                  <span>
                    {t("Costs & refunds", "التكاليف والمبالغ المستردة")}
                  </span>
                  <Check size={14} />
                </div>
              </div>
              <div className="w-mini w-fulfil">
                <Package size={20} />
                <span>{t("Fulfilment", "تجهيز الطلبات")}</span>
                <div className="w-parcel">
                  <Package size={44} strokeWidth={1} />
                </div>
                <small>
                  {t("Ready for the next step", "جاهز للخطوة التالية")}
                </small>
              </div>
              <div className="w-mini w-next-store">
                <Store size={20} />
                <span>{t("Your next store", "متجرك التالي")}</span>
                <small>
                  {t(
                    "Its own brand. Its own ledger.",
                    "علامة مستقلة. دفتر مخزون مستقل.",
                  )}
                </small>
              </div>
              <div className="w-order-slip">
                <div>
                  <span className="w-status-dot" />
                  {t("Order received", "طلب جديد")}
                </div>
                <strong>{product}</strong>
                <span>
                  {t("Quantity", "الكمية")}: {quantity} <span>•</span>{" "}
                  {t("Online store", "المتجر الإلكتروني")}
                </span>
                <div className="w-slip-foot">
                  <Check size={14} />
                  {t("One connected store", "متجر مترابط")}
                </div>
              </div>
            </div>
          </div>
          <div className="w-world-caption">
            {t("Illustrative store and sample records", "متجر وسجلات توضيحية")}
          </div>
        </div>

        <div data-sc-world-copy className="w-copy-layer">
          <div
            className="w-copy"
            data-sc-copy
            data-sc-window={windows[0]}
            data-index="0"
          >
            <p className="w-eyebrow">
              <span />
              {t("THE ROOTS OF YOUR BUSINESS", "جذور نشاطك التجاري")}
            </p>
            <h1>
              {t("Your business.\nAll connected.", "نشاطك كله.\nفي مكان واحد.")}
            </h1>
            <p className="w-lede">
              {t(
                "Build your storefront. Run your operations. Grow your business. All rooted in Jizrak.",
                "أنشئ واجهة متجرك، وأدر عملياته، ووسّع نشاطك مع جِذرك.",
              )}
            </p>
            <div className="w-actions">
              <button
                className="w-primary"
                onClick={() =>
                  config.start.startsWith("#")
                    ? openPanel("start")
                    : location.assign(config.start)
                }
              >
                {copy.start[locale]} <ArrowUpRight size={17} />
              </button>
              <button className="w-text-button" onClick={() => navigate(1)}>
                {t("Step inside", "اكتشف متجرك")} <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div
            className="w-copy"
            data-sc-copy
            data-sc-window={windows[1]}
            data-index="1"
          >
            <h2>{t("Make it\nunmistakably yours.", "واجهة تحمل\nعلامتك.")}</h2>
            <p className="w-lede">
              {t(
                "A storefront with your identity, your catalog, and Arabic and English built in. Give every product a clear place to sell.",
                "واجهة بهويتك وكتالوجك، تدعم العربية والإنجليزية. اعرض منتجاتك وخياراتها بالطريقة التي تناسب متجرك.",
              )}
            </p>
            <fieldset className="w-brand-choice">
              <legend>{t("Imagine your store", "تصوّر متجرك")}</legend>
              <button aria-pressed={!apparel} onClick={() => setApparel(false)}>
                <ShoppingBag size={16} />
                {t("Everyday goods", "منتجات يومية")}
              </button>
              <button aria-pressed={apparel} onClick={() => setApparel(true)}>
                <Layers size={16} />
                {t("Clothing", "ملابس")}
              </button>
            </fieldset>
            <p className="w-small">
              {t(
                "Categories, variants, bundles, offers, and a checkout shaped by your store settings.",
                "تصنيفات وخيارات وحزم وعروض، وإتمام شراء وفق إعدادات متجرك.",
              )}
            </p>
            <button
              className="w-text-button"
              onClick={() => openPanel("features")}
            >
              {t(
                "See the store-building tools",
                "اطّلع على أدوات إنشاء المتجر",
              )}{" "}
              <Plus size={16} />
            </button>
          </div>

          <div
            className="w-copy"
            data-sc-copy
            data-sc-window={windows[2]}
            data-index="2"
          >
            <h2>
              {t(
                "Behind every order,\nyou’re in control.",
                "وراء كل طلب،\nأنت تدير التفاصيل.",
              )}
            </h2>
            <p className="w-lede">
              {t(
                "The storefront is just the beginning. Follow orders, reserve stock, manage fulfilment, and replenish what your store needs.",
                "واجهة المتجر هي البداية. تابع الطلبات، واحجز المخزون، وأدر التجهيز، واطلب ما يحتاج إليه متجرك.",
              )}
            </p>
            <div className="w-reservation">
              <div className="w-reservation-top">
                <span>{t("Try a stock reservation", "جرّب حجز المخزون")}</span>
                <span className="w-sample-label">{t("SAMPLE", "مثال")}</span>
              </div>
              <div className="w-reservation-control">
                <span>{product}</span>
                <div>
                  <button
                    aria-label={t("Reserve one fewer", "حجز وحدة أقل")}
                    disabled={quantity === 1}
                    onClick={() => setQuantity((q) => q - 1)}
                  >
                    <Minus size={15} />
                  </button>
                  <output aria-live="polite">{quantity}</output>
                  <button
                    aria-label={t("Reserve one more", "حجز وحدة إضافية")}
                    disabled={quantity === 5}
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <div className="w-reservation-result" aria-live="polite">
                <span>
                  <b>24</b>
                  {t("on hand", "موجود")}
                </span>
                <span>
                  <b>{quantity}</b>
                  {t("reserved", "محجوز")}
                </span>
                <span>
                  <b>{24 - quantity}</b>
                  {t("available", "متاح")}
                </span>
              </div>
            </div>
            <p className="w-small">
              {t(
                "A reservation holds availability. Stock is consumed through the supported sale workflow. Optional POS follows the same store inventory rules.",
                "الحجز يخصّص الكمية للطلب. ويُستهلك المخزون عبر مسار البيع المدعوم. وتتبع نقطة البيع الاختيارية قواعد مخزون المتجر نفسها.",
              )}
            </p>
          </div>

          <div
            className="w-copy"
            data-sc-copy
            data-sc-window={windows[3]}
            data-index="3"
          >
            <h2>
              {t(
                "Know your business.\nChoose your next move.",
                "افهم نشاطك.\nوحدّد خطوتك التالية.",
              )}
            </h2>
            <p className="w-lede">
              {t(
                "See the customer behind the order and the records behind your sales. Bring everyday decisions into focus.",
                "تعرّف على العميل وراء الطلب، وتابع السجلات المرتبطة بمبيعاتك. اتخذ قراراتك اليومية على أساس أوضح.",
              )}
            </p>
            <ul className="w-proof-list">
              <li>
                <Users size={18} />
                {t(
                  "Customer history and repeat orders",
                  "سجل العملاء وإعادة الطلب",
                )}
              </li>
              <li>
                <ChartNoAxesCombined size={18} />
                {t("Store performance by date range", "أداء المتجر حسب الفترة")}
              </li>
              <li>
                <Layers size={18} />
                {t(
                  "Sales, costs, refunds, and expenses",
                  "المبيعات والتكاليف والمبالغ المستردة والمصروفات",
                )}
              </li>
            </ul>
            <p className="w-small">
              {t(
                "Records follow supported workflows. Their updates are related, not necessarily simultaneous.",
                "تتبع السجلات مسارات العمل المدعومة. تحديثاتها مترابطة، وقد تتم في أوقات مختلفة.",
              )}
            </p>
          </div>

          <div
            className="w-copy"
            data-sc-copy
            data-sc-window={windows[4]}
            data-index="4"
          >
            <p className="w-eyebrow">
              <span />
              {t("START HERE. GROW FROM HERE.", "ابدأ من هنا. وتوسّع من هنا.")}
            </p>
            <h2>
              {t(
                "One store today.\nRoom for what’s next.",
                "متجر اليوم.\nومساحة لما بعده.",
              )}
            </h2>
            <p className="w-lede">
              {t(
                "Add another store when you’re ready. Keep its brand, team, customers, finances, and stock ledger independent within the same business.",
                "أضف متجرًا آخر عندما تحتاج إليه، مع بقاء علامته وفريقه وعملائه وماليته ودفتر مخزونه مستقلة تحت نشاطك التجاري نفسه.",
              )}
            </p>
            <div className="w-actions">
              <button
                className="w-primary"
                onClick={() =>
                  config.start.startsWith("#")
                    ? openPanel("start")
                    : location.assign(config.start)
                }
              >
                {copy.start[locale]} <ArrowUpRight size={17} />
              </button>
              <button
                className="w-text-button"
                onClick={() => openPanel("features")}
              >
                {t("Questions?", "لديك أسئلة؟")} <Plus size={16} />
              </button>
            </div>
            <p className="w-small">
              {t("Your preview", "معاينتك")}:{" "}
              {apparel
                ? t("Clothing", "ملابس")
                : t("Everyday goods", "منتجات يومية")}
              .{" "}
              {t(
                "Your brand, connected operations, room to grow.",
                "علامتك، وعملياتك المترابطة، ومساحة للتوسّع.",
              )}
            </p>
            <div className="w-legal">
              © {new Date().getFullYear()} Jizrak{" "}
              {config.privacy && (
                <a href={config.privacy}>{copy.privacy[locale]}</a>
              )}
              {config.terms && <a href={config.terms}>{copy.terms[locale]}</a>}
            </div>
          </div>
        </div>
        <div data-sc-spacer className="w-spacer" aria-hidden="true" />
      </main>

      <nav
        className="w-route"
        aria-label={t("Your business journey", "رحلة نشاطك التجاري")}
      >
        <div className="w-route-line" aria-hidden="true">
          <i />
        </div>
        {names.map((name, index) => (
          <button
            key={name[0]}
            aria-current={active === index ? "step" : undefined}
            onClick={() => navigate(index)}
          >
            <span className="w-route-dot" />
            <span>{name[ar ? 1 : 0]}</span>
          </button>
        ))}
      </nav>
      <footer className="w-bottom-note">
        <Store size={14} />
        {t(
          "Your brand. Your operations. Your growth.",
          "علامتك. عملياتك. نموّك.",
        )}
      </footer>

      <dialog
        ref={dialog}
        className="w-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="w-dialog-header">
          <span>{t("THE JIZRAK PLATFORM", "منصة جِذرك")}</span>
          <button
            className="w-icon-button"
            aria-label={t("Close", "إغلاق")}
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        {panel === "features" ? (
          <>
            <h2>
              {t("A closer look at your store.", "نظرة أقرب إلى أدوات متجرك.")}
            </h2>
            <p>
              {t(
                "From building your storefront to running the business behind it.",
                "من إنشاء واجهة متجرك إلى إدارة النشاط الذي تعمل من أجله.",
              )}
            </p>
            <div className="w-feature-details">
              {sections
                .filter(
                  (s) =>
                    ![
                      "hero",
                      "features",
                      "start",
                      "demo",
                      "sign-in",
                      "connected",
                    ].includes(s.id) && publicDetails(s.id).length > 0,
                )
                .map((s) => (
                  <details key={s.id}>
                    <summary>
                      {s.heading[locale]}
                      <Plus size={17} />
                    </summary>
                    <p>{s.body[locale]}</p>
                    <ul>
                      {publicDetails(s.id).map((d) => (
                        <li key={d.id}>{d[locale]}</li>
                      ))}
                    </ul>
                  </details>
                ))}
            </div>
            <h3>{t("Before you begin", "قبل أن تبدأ")}</h3>
            {candidateCopy.faqChapter.items.map((item) => (
              <details key={item.id}>
                <summary>
                  {item.question[locale]}
                  <Plus size={17} />
                </summary>
                <p>{item.answer[locale]}</p>
              </details>
            ))}
          </>
        ) : (
          <>
            <SlidersHorizontal size={30} />
            <h2>
              {panel === "start" ? copy.start[locale] : copy.signin[locale]}
            </h2>
            <p>
              {panel === "start"
                ? copy.startPending[locale]
                : copy.signPending[locale]}
            </p>
            <button className="w-primary" onClick={() => setPanel("features")}>
              {t("Explore the platform", "استكشف المنصة")}{" "}
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
