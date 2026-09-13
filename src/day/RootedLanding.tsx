import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  Globe2,
  Menu,
  Moon,
  Sun,
  ShoppingBag,
  Store,
  X,
  Sprout,
  Package,
  ShieldCheck,
} from "lucide-react";
import { usePreferences } from "../app/preferences";
import { config } from "../app/config";
import { RootMark } from "../components/Primitives";
import { StageLine } from "../components/StageLine";
import { pair } from "../content";
import { roots, trust } from "./content";
import { PricingSection } from "../pricing/PricingSection";
import "./rooted.css";

const stages = [
  { id: "receive", label: pair("day-receive", "Receive", "استلام") },
  { id: "reserve", label: pair("day-reserve", "Reserve", "حجز") },
  { id: "fulfil", label: pair("day-fulfil", "Fulfil", "تجهيز") },
  { id: "review", label: pair("day-review", "Review", "مراجعة") },
];

/** Event-driven, bounded motion. The complete static page is the default. */
function useRootedMotion() {
  const page = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = page.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 800px)");
    const hero = el.querySelector<HTMLElement>(".rd-hero");
    const rootScene = el.querySelector<HTMLElement>(".rd-beneath");
    let frame = 0;
    const render = () => {
      frame = 0;
      const enabled = !media.matches;
      el.dataset.motion = enabled ? "true" : "false";
      if (hero) {
        const travel = enabled
          ? Math.max(
              0,
              Math.min(
                1,
                -hero.getBoundingClientRect().top / hero.offsetHeight,
              ),
            )
          : 0;
        hero.style.setProperty("--hero-travel", String(travel));
      }
      if (rootScene) {
        const rect = rootScene.getBoundingClientRect();
        const progress =
          enabled && !compact.matches
            ? Math.max(
                0,
                Math.min(
                  1,
                  (innerHeight * 0.5 - rect.top) /
                    (rect.height - innerHeight * 0.65),
                ),
              )
            : 1;
        rootScene.style.setProperty("--root-progress", String(progress));
        for (let i = 0; i < roots.length; i++) {
          const draw = Math.max(0, Math.min(1, (progress - i * 0.055) / 0.54));
          rootScene.style.setProperty(`--draw-${i}`, String(100 - draw * 100));
        }
        rootScene.dataset.scVerifyState = roots
          .map((_, i) => rootScene.style.getPropertyValue(`--draw-${i}`))
          .map(Number)
          .map(Math.round)
          .join(",");
        rootScene.dataset.scVerifyHold =
          progress >= 0.8 || !enabled || compact.matches ? "true" : "false";
      }
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rd-seen");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    el.querySelectorAll("[data-rd-reveal]").forEach((node) =>
      observer.observe(node),
    );
    const resize = new ResizeObserver(queue);
    resize.observe(el);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    media.addEventListener("change", queue);
    compact.addEventListener("change", queue);
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      media.removeEventListener("change", queue);
      compact.removeEventListener("change", queue);
    };
  }, []);
  return page;
}

export function RootedLanding() {
  const { locale, setLocale, theme, setTheme } = usePreferences();
  const t = (en: string, ar: string) => (locale === "ar" ? ar : en);
  const [menu, setMenu] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [selected, setSelected] = useState(0);
  const [channel, setChannel] = useState<"online" | "counter">("online");
  const page = useRootedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const selectedRoot = roots[selected];
  const demoHref = config.demo === "#demo" ? "/demo" : config.demo;
  const startText = t("Start your business", "ابدأ نشاطك التجاري");

  useEffect(() => {
    setInteractive(true);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  return (
    <div className="rooted-page" ref={page}>
      <a className="rd-skip" href="#main">
        {t("Skip to content", "انتقل إلى المحتوى")}
      </a>
      <header className="rd-header">
        <a
          className="rd-brand"
          href="/"
          aria-label={t("Jizrak home", "جِذرك الرئيسية")}
        >
          <RootMark />
          <span>{t("Jizrak", "جِذرك")}</span>
        </a>
        <nav
          className="rd-nav"
          aria-label={t("Main navigation", "التنقل الرئيسي")}
        >
          <a href="#roots">{t("The root system", "منظومة الجذور")}</a>
          <a href="/features">{t("Features", "المزايا")}</a>
          <a href="#pricing">{t("Pricing", "الأسعار")}</a>
          <a href={demoHref}>{t("Explore the demo", "استكشف التجربة")}</a>
        </nav>
        <div className="rd-utilities">
          <button
            disabled={!interactive}
            className="rd-language"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            aria-label={t("Switch to Arabic", "Switch to English")}
          >
            <Globe2 size={15} />
            <span>{t("العربية", "English")}</span>
          </button>
          <button
            disabled={!interactive}
            className="rd-icon-button rd-theme"
            aria-label={t("Change color theme", "غيّر سمة الألوان")}
            onClick={() =>
              setTheme(
                theme === "dark" ||
                  (theme === "system" &&
                    document.documentElement.dataset.theme === "dark")
                  ? "light"
                  : "dark",
              )
            }
          >
            <Sun size={17} className="rd-sun" />
            <Moon size={17} className="rd-moon" />
          </button>
          <a className="rd-signin" href={config.signin}>
            {t("Sign in", "تسجيل الدخول")}
            <ArrowUpRight size={14} />
          </a>
          <button
            disabled={!interactive}
            ref={menuButton}
            className="rd-icon-button rd-menu-button"
            aria-label={
              menu
                ? t("Close navigation", "أغلق التنقل")
                : t("Open navigation", "افتح التنقل")
            }
            aria-expanded={menu}
            aria-controls="rd-mobile-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        <nav
          id="rd-mobile-nav"
          className="rd-mobile-nav"
          hidden={!menu}
          aria-label={t("Mobile navigation", "التنقل على الهاتف")}
        >
          <a href="#roots" onClick={() => setMenu(false)}>
            {t("The root system", "منظومة الجذور")}
          </a>
          <a href="/features">{t("All features", "كل المزايا")}</a>
          <a href="#pricing" onClick={() => setMenu(false)}>
            {t("Pricing", "الأسعار")}
          </a>
          <a href={demoHref}>{t("Explore the demo", "استكشف التجربة")}</a>
          <a href={config.signin}>{t("Sign in", "تسجيل الدخول")}</a>
          <a href={config.start}>{startText}</a>
        </nav>
      </header>

      <main id="main">
        <section
          className="rd-hero rd-wrap"
          aria-labelledby="rd-heading"
          data-sc-act="flow"
        >
          <div className="rd-hero-copy">
            <p className="rd-eyebrow">
              <span />
              {t("COMMERCE, CONNECTED AT THE ROOT", "تجارة مترابطة من الجذور")}
            </p>
            <h1 id="rd-heading">
              {t("Your business.", "نشاطك التجاري.")}
              <br />
              <span>{t("Stronger roots.", "جذور أقوى.")}</span>
            </h1>
            <p className="rd-lead">
              {t(
                "Connect your storefront, sales and operations in one system, built for the way Arab businesses work.",
                "اربط واجهة متجرك ومبيعاتك وعملياتك في نظام واحد، مصمّم للأنشطة التجارية العربية.",
              )}
            </p>
            <div className="rd-actions">
              <a className="rd-button" href={config.start}>
                {startText}
                <ArrowUpRight size={19} />
              </a>
              <a className="rd-text-link" href={demoHref}>
                {t("Explore the demo", "استكشف التجربة")}
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="rd-hero-art">
            <div className="rd-art-frame" aria-hidden="true" />
            <figure className="rd-merchant-image">
              <img
                src="/images/jizrak-day/merchant.jpg"
                alt={t(
                  "Handmade ceramics, an olive branch and a packed box on a sunlit shop table",
                  "خزف يدوي وغصن زيتون وعلبة جاهزة على طاولة متجر مضاءة بالشمس",
                )}
                width="1200"
                height="1600"
                fetchPriority="high"
              />
            </figure>
            <div className="rd-photo-note">
              <span>{t("THE PART THE WORLD SEES", "ما يراه العالم")}</span>
              <p>{t("Entirely yours.", "يحمل بصمتك.")}</p>
            </div>
            <div className="rd-root-seal" aria-hidden="true">
              <RootMark />
              <span>جِذرك</span>
            </div>
            <div className="rd-hero-caption">
              <span>
                {t("YOUR BRAND, ABOVE THE SURFACE.", "علامتك فوق السطح.")}
              </span>
              <span>{t("JIZRAK, AT THE ROOT.", "وجِذرك في الأساس.")}</span>
            </div>
          </div>
          <div className="rd-hero-foot">
            <span>
              {t(
                "From the first product to the next chapter.",
                "من أول منتج إلى مرحلة جديدة.",
              )}
            </span>
            <span>
              <Sprout size={16} />
              {t("Built for Arab businesses", "للأنشطة التجارية العربية")}
            </span>
          </div>
        </section>

        <section
          className="rd-selling rd-wrap"
          aria-labelledby="rd-selling-title"
          data-sc-act="flow"
        >
          <div className="rd-selling-intro" data-rd-reveal>
            <div className="rd-section-symbol" aria-hidden="true">
              <ShoppingBag size={27} />
            </div>
            <h2 id="rd-selling-title">
              {t("Let your brand", "دع علامتك")}
              <br />
              {t("take the spotlight.", "تأخذ مكانها.")}
            </h2>
            <p>
              {t(
                "Your customers meet your brand. Give them a thoughtful way to browse, choose and buy, wherever they find you.",
                "عملاؤك يتعاملون مع علامتك. امنحهم تجربة واضحة لتصفح منتجاتك واختيارها وشرائها، أينما وصلوا إليك.",
              )}
            </p>
          </div>
          <div className="rd-channel" data-rd-reveal>
            <div
              className="rd-channel-toggle"
              role="group"
              aria-label={t("Explore sales channels", "استكشف قنوات البيع")}
            >
              <button
                disabled={!interactive}
                aria-pressed={channel === "online"}
                onClick={() => setChannel("online")}
              >
                <Globe2 size={17} />
                {t("Online", "عبر الإنترنت")}
              </button>
              <button
                disabled={!interactive}
                aria-pressed={channel === "counter"}
                onClick={() => setChannel("counter")}
              >
                <Store size={17} />
                {t("At the counter", "داخل المتجر")}
              </button>
            </div>
            <div
              className="rd-channel-content"
              aria-live="polite"
              key={channel}
            >
              <span className="rd-channel-name">
                {channel === "online"
                  ? t("Your storefront", "واجهة متجرك")
                  : t("Your point of sale", "نقطة البيع")}
              </span>
              <h3>
                {channel === "online"
                  ? t(
                      "Your look. Your collection. Your shop.",
                      "تصميمك. منتجاتك. متجرك.",
                    )
                  : t(
                      "A familiar face. A connected sale.",
                      "عميل أمامك. وبيع مرتبط بمتجرك.",
                    )}
              </h3>
              <p>
                {channel === "online"
                  ? t(
                      "Bring your catalog to life with product options, bundles and a branded shopping experience, all the way through checkout.",
                      "اعرض كتالوجك بخيارات المنتجات والباقات وتجربة تسوق تحمل علامتك، حتى إتمام الشراء.",
                    )
                  : t(
                      "Open a shift, record a sale and issue a receipt. Your counter sales use the right Store stock ledger, just like your online orders.",
                      "افتح الوردية وسجّل البيع وأصدر الإيصال. تستخدم مبيعات نقطة البيع دفتر مخزون المتجر الصحيح، مثل الطلبات عبر الإنترنت.",
                    )}
              </p>
              <a className="rd-text-link" href="/features#sell">
                {t("Explore the features", "استكشف المزايا")}
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="rd-channel-base">
              <span className="rd-tiny-root">
                <RootMark />
              </span>
              <p>
                {t(
                  "Different ways to sell. The same connected foundation.",
                  "طرق بيع متعددة. وأساس مترابط واحد.",
                )}
              </p>
            </div>
          </div>
        </section>

        <section
          className="rd-beneath"
          id="roots"
          aria-labelledby="rd-roots-title"
          data-sc-act="flow"
        >
          <div className="rd-root-stage" data-sc-verify-state="complete">
            <div className="rd-wrap">
              <div className="rd-root-heading">
                <p className="rd-eyebrow">
                  {t("WHAT MAKES IT ALL POSSIBLE", "ما يدعم كل هذا")}
                </p>
                <h2 id="rd-roots-title">
                  {t("Good things grow", "ما ينمو فوق السطح،")}
                  <br />
                  <span>
                    {t("from connected roots.", "تدعمه جذور مترابطة.")}
                  </span>
                </h2>
                <p>
                  {t(
                    "Behind every sale, a whole business is at work. Jizrak connects the parts that keep it growing.",
                    "وراء كل عملية بيع، يعمل نشاط كامل. يربط جِذرك الأجزاء التي تدعم نموّه.",
                  )}
                </p>
              </div>
              <div className="rd-root-layout">
                <div
                  className="rd-root-diagram"
                  role="group"
                  aria-label={t(
                    "Explore the connected root system",
                    "استكشف منظومة الجذور المترابطة",
                  )}
                >
                  <div className="rd-ground">
                    <span />
                    <div>
                      <Store size={22} />
                      <span>{t("Your Store", "متجرك")}</span>
                    </div>
                    <span />
                  </div>
                  <svg
                    className="rd-root-drawing"
                    viewBox="0 0 800 510"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      className="rd-root-silhouette"
                      d="M400 0V62 M397 59C395 160 287 200 119 231M402 61C432 178 523 201 684 230 M399 62C362 245 267 328 181 414 M402 60C431 256 530 332 638 415M400 59C381 229 422 376 400 510"
                    />
                    {roots.map((root, i) => (
                      <path
                        key={root.id}
                        className={`rd-root-path ${selected === i ? "is-selected" : ""}`}
                        d={root.path}
                        pathLength="100"
                        style={
                          { "--draw": `var(--draw-${i}, 0)` } as CSSProperties
                        }
                      />
                    ))}
                  </svg>
                  {roots.map((root, i) => (
                    <button
                      disabled={!interactive}
                      key={root.id}
                      className={`rd-root-node rd-root-node-${i}`}
                      aria-pressed={selected === i}
                      aria-controls="rd-root-detail"
                      onClick={() => setSelected(i)}
                    >
                      <span className="rd-node-dot" />
                      {root.label[locale]}
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                  <span className="rd-root-hint">
                    {t(
                      "Choose a root. See what it supports.",
                      "اختر جذرًا لتعرف ما يدعمه.",
                    )}
                  </span>
                </div>
                <div
                  className="rd-root-detail"
                  id="rd-root-detail"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="rd-detail-icon" aria-hidden="true">
                    <RootMark />
                  </span>
                  <p className="rd-detail-label">
                    {selectedRoot.label[locale]}
                  </p>
                  <h3>{selectedRoot.title[locale]}</h3>
                  <p>{selectedRoot.body[locale]}</p>
                  <div className="rd-root-detail-foot">
                    <span>{selectedRoot.detail[locale]}</span>
                    <a href={selectedRoot.href}>
                      {t("Explore", "استكشف")}
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </div>
              <noscript>
                <div className="rd-static-roots">
                  {roots.slice(1).map((root) => (
                    <article key={root.id}>
                      <h3>{root.label[locale]}</h3>
                      <p>{root.body[locale]}</p>
                      <a href={root.href}>
                        {t("Explore the features", "استكشف المزايا")}
                      </a>
                    </article>
                  ))}
                </div>
              </noscript>
            </div>
          </div>
        </section>

        <section
          className="rd-operate rd-wrap"
          aria-labelledby="rd-operate-title"
          data-sc-act="flow"
        >
          <div className="rd-operate-title" data-rd-reveal>
            <h2 id="rd-operate-title">
              {t("Less piecing it together.", "عملياتك مترابطة.")}
              <br />
              <span>
                {t("More moving it forward.", "وخطوتك التالية أوضح.")}
              </span>
            </h2>
            <p>
              {t(
                "An order is part of a bigger story. Keep the work connected from the moment stock arrives to the moment you review the day.",
                "الطلب جزء من قصة أكبر. أبقِ العمل مترابطًا من وصول المخزون إلى مراجعة نتائج اليوم.",
              )}
            </p>
          </div>
          <div className="rd-dayline" data-rd-reveal>
            <div className="rd-dayline-head">
              <Package size={20} />
              <span>
                {t("THE WORK BEHIND A SALE", "العمل وراء عملية البيع")}
              </span>
            </div>
            <StageLine
              stages={stages}
              label={t(
                "From stock receiving to daily review",
                "من استلام المخزون إلى مراجعة اليوم",
              )}
            />
            <div className="rd-dayline-foot">
              <Check size={17} />
              <p>
                {t(
                  "Stock movements, order history and reports stay part of the same system.",
                  "حركات المخزون وسجل الطلبات والتقارير ضمن نظام واحد.",
                )}
              </p>
            </div>
          </div>
        </section>

        <section
          className="rd-confidence rd-wrap"
          aria-labelledby="rd-confidence-title"
          data-sc-act="flow"
        >
          <div className="rd-confidence-intro" data-rd-reveal>
            <ShieldCheck size={28} />
            <h2 id="rd-confidence-title">
              {t("Room to grow.", "مساحة للنمو.")}
              <br />
              {t("Ground to trust.", "وأساس تثق به.")}
            </h2>
            <p>
              {t(
                "Growth brings more people, more Stores and more decisions. Keep the boundaries clear as the business takes shape.",
                "مع النمو يأتي موظفون ومتاجر وقرارات أكثر. حافظ على وضوح المسؤوليات مع توسّع نشاطك.",
              )}
            </p>
            <a className="rd-text-link" href="/features">
              {t("See the full platform", "استكشف المنصة كاملة")}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="rd-principles">
            {trust.map((item, i) => (
              <details key={item.title.id} open={i === 0} data-rd-reveal>
                <summary>
                  <span>{item.title[locale]}</span>
                  <ChevronDown size={20} />
                </summary>
                <p>{item.body[locale]}</p>
              </details>
            ))}
          </div>
        </section>

        <PricingSection />

        <section
          className="rd-close"
          aria-labelledby="rd-close-title"
          data-sc-act="flow"
        >
          <div className="rd-wrap rd-close-content">
            <div className="rd-close-mark" aria-hidden="true">
              <RootMark />
            </div>
            <h2 id="rd-close-title">
              {t("Your next chapter", "مرحلتك القادمة")}
              <br />
              {t("starts at the root.", "تبدأ من الجذور.")}
            </h2>
            <p>
              {t(
                "Your idea. Your name on the door. One connected foundation underneath.",
                "فكرتك. اسمك على الباب. وأساس مترابط يدعمك.",
              )}
            </p>
            <a href={config.start} className="rd-button rd-button-light">
              {startText}
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="rd-wordmark" aria-hidden="true">
            {t("Jizrak", "جِذرك")}
          </div>
          <footer className="rd-footer rd-wrap">
            <span>
              © {new Date().getFullYear()} {t("Jizrak", "جِذرك")}
            </span>
            <nav aria-label={t("Footer navigation", "روابط التذييل")}>
              <a href="/features">{t("Features", "المزايا")}</a>
              <a href="#pricing">{t("Pricing", "الأسعار")}</a>
              <a href={demoHref}>{t("Demo", "التجربة")}</a>
              {config.privacy && (
                <a href={config.privacy}>{t("Privacy", "الخصوصية")}</a>
              )}
              {config.terms && (
                <a href={config.terms}>{t("Terms", "الشروط")}</a>
              )}
              <a href={config.signin}>{t("Sign in", "تسجيل الدخول")}</a>
            </nav>
            <span>{t("Rooted in your ambition.", "جذور لطموحك.")}</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
