import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Boxes,
  Building2,
  ChartNoAxesCombined,
  CreditCard,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { usePreferences, type Theme } from "../app/preferences";
import { config } from "../app/config";
import {
  section,
  copy,
  nav,
  nodes,
  flow,
  narrativeCopy,
  diagramCopy,
  inventoryStageDetails,
  ui,
  type BilingualText,
} from "../content";
import "./apple.css";

import { publicDetails } from "./publicContent";
import { candidateCopy } from "./candidateContent";
import { StageFlow, type Stage } from "../components/StageFlow";
import { StageLine } from "../components/StageLine";
function Text({ text }: { text: BilingualText }) {
  const { locale } = usePreferences();
  return <span data-copy={text.id}>{text[locale]}</span>;
}
const toStages = (items: BilingualText[]): Stage[] =>
  items.map((label) => ({ id: label.id, label }));

const orderJourneyStages: Stage[] = candidateCopy.orderJourney.steps.map(
  (step) => ({
    id: step.id,
    label: step.heading,
    description: step.body,
  }),
);
const inventoryLabels = [...flow, narrativeCopy.understandFlow[2]];
const inventoryStages: Stage[] = inventoryLabels.map((label, index) => ({
  id: label.id,
  label,
  description: inventoryStageDetails[index],
}));
const destination = (href: string) =>
  href.startsWith("#") ? `/apple${href}` : href;
const wideNavigationQuery = "(min-width: 72rem)";
const signinDestination =
  config.signin === "#sign-in" ? "/apple#footer" : destination(config.signin);
const overviewDestinations: Record<string, string> = {
  storefront: "sell",
  pos: "pos",
  inventory: "inventory",
  orders: "orders",
  purchasing: "purchasing",
  customers: "customers",
  finance: "understand",
  "multi-store": "business",
};
const overviewIcons: Record<string, LucideIcon> = {
  storefront: ShoppingBag,
  pos: CreditCard,
  inventory: Boxes,
  orders: PackageCheck,
  purchasing: Truck,
  customers: Search,
  finance: ChartNoAxesCombined,
  "multi-store": Building2,
};
const overviewCapabilities = [
  ...nodes,
  candidateCopy.overviewMultiStore,
];
function Action({ kind = "start" }: { kind?: "start" | "demo" | "signin" }) {
  const isLocal = config[kind].startsWith("#");
  return (
    <a
      className={kind === "start" ? "a-button" : "a-link"}
      href={kind === "signin" ? signinDestination : destination(config[kind])}
    >
      <Text text={copy[kind]} />
      {!isLocal && <span aria-hidden="true"> ↗</span>}
    </a>
  );
}
function Intro({ id }: { id: string }) {
  const content = section(id);
  const { locale } = usePreferences();
  return (
    <div className="a-intro">
      <p className="a-kicker">
        <Text text={content.eyebrow} />
      </p>
      <h2 id={`${id}-heading`} lang={locale}>
        <Text text={content.heading} />
      </h2>
      <p className="a-body">
        <Text
          text={id === "operate" ? narrativeCopy.operateBody : content.body}
        />
      </p>
    </div>
  );
}
function CandidateIntro({
  content,
  id,
}: {
  content: (typeof candidateCopy)["operationsChapter"];
  id: string;
}) {
  return (
    <div className="a-intro">
      <p className="a-kicker">
        <Text text={content.eyebrow} />
      </p>
      <h2 id={`${id}-heading`}>
        <Text text={content.heading} />
      </h2>
      <p className="a-body">
        <Text text={content.body} />
      </p>
    </div>
  );
}
function Details({ id }: { id: string }) {
  return (
    <details className="a-details" id={`${id}-details`}>
      <summary>
        <Text text={copy.detail} />
      </summary>
      <ul>
        {publicDetails(id).map((item) => (
          <li key={item.id}>
            <Text text={item} />
          </li>
        ))}
      </ul>
    </details>
  );
}
function Story({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <section
      id={id}
      className={`a-story a-${id}`}
      aria-labelledby={`${id}-heading`}
    >
      <Intro id={id} />
      {children}
      <Details id={id} />
    </section>
  );
}
function Navigation() {
  const { locale, theme, setLocale, setTheme } = usePreferences();
  const labels = ui[locale].translation;
  const header = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) {
        menu.current.open = false;
      }
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        event.preventDefault();
        menu.current.open = false;
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, []);
  useEffect(() => {
    const main = header.current?.closest(".apple-page")?.querySelector("main");
    if (!main) return;
    const groups: Record<string, string> = {
      connected: "connected",
      business: "business",
      sell: "sell",
      pos: "sell",
      catalog: "sell",
      inventory: "operate",
      purchasing: "operate",
      orders: "operate",
      customers: "understand",
      understand: "understand",
      identity: "operate",
      operate: "operate",
      faq: "faq",
      features: "features",
    };
    const sections = [
      ...main.querySelectorAll<HTMLElement>(":scope > section"),
    ];
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold =
        (header.current?.getBoundingClientRect().bottom ?? 0) + 120;
      const current = sections
        .filter((section) => section.getBoundingClientRect().top <= threshold)
        .at(-1);
      setActiveSection(current ? (groups[current.id] ?? "") : "");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  useEffect(() => {
    const media = matchMedia(wideNavigationQuery);
    const reset = () => {
      if (menu.current) menu.current.open = false;
    };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);
  return (
    <header className="a-nav" ref={header}>
      <a className="a-brand" href="/apple#top" aria-label="Jizrak — جِذرك">
        Jizrak
      </a>
      <nav className="a-desktop" aria-label={labels.mainNav}>
        {nav.map((item) => (
          <a
            key={item.id}
            href={`/apple#${item.id}`}
            aria-current={activeSection === item.id ? "location" : undefined}
          >
            {item[locale]}
          </a>
        ))}
      </nav>
      <div className="a-tools">
        <button
          type="button"
          onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          lang={locale === "en" ? "ar" : "en"}
        >
          {labels.locale}
        </button>
        <span className="a-theme-control" title={labels.theme}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="8" />
            <path
              d="M12 4v16a8 8 0 0 0 0-16Z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
          <select
            aria-label={labels.theme}
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
          >
            {(["light", "dark", "system"] as const).map((value) => (
              <option key={value} value={value}>
                {labels[value]}
              </option>
            ))}
          </select>
        </span>
        <span className="a-nav-signin">
          <Action kind="signin" />
        </span>
        <span className="a-nav-start">
          <Action />
        </span>
      </div>
      <details
        className="a-menu"
        ref={menu}
        onToggle={(event) => setMenuOpen(event.currentTarget.open)}
      >
        <summary
          ref={trigger}
          aria-label={menuOpen ? labels.close : labels.open}
        >
          <svg
            className="a-menu-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 8h16" />
            <path d="M4 16h16" />
          </svg>
        </summary>
        <nav
          aria-label={labels.mainNav}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              if (menu.current) menu.current.open = false;
              trigger.current?.focus();
            }
          }}
        >
          {nav.map((item) => (
            <a key={item.id} href={`/apple#${item.id}`}>
              {item[locale]}
            </a>
          ))}
          <Action />
          <Action kind="signin" />
        </nav>
      </details>
    </header>
  );
}
export function AppleLanding() {
  const { locale } = usePreferences();
  const [selectedCapability, setSelectedCapability] = useState(nodes[0].id);
  const capability = overviewCapabilities.find(
    (node) => node.id === selectedCapability,
  )!;
  const capabilitySection = overviewDestinations[capability.id];
  const CapabilityIcon = overviewIcons[capability.id];
  return (
    <div
      className="apple-page"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <a className="a-skip" href="/apple#main">
        {ui[locale].translation.skip}
      </a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <section id="top" className="a-hero" aria-labelledby="top-heading">
          <p className="a-kicker">
            <Text text={candidateCopy.eyebrow} />
          </p>
          <h1 id="top-heading" lang={locale}>
            <Text text={candidateCopy.heading} />
          </h1>
          <p className="a-body">
            <Text text={candidateCopy.body} />
          </p>
          <div className="a-actions">
            <Action />
            <Action kind="demo" />
          </div>
          <p className="a-premise">
            <Text text={candidateCopy.reassurance} />
          </p>
          <div className="a-overview">
            <div className="a-overview-title">
              <Text text={candidateCopy.overviewLabel} />
            </div>
            <div
              className="a-applications"
              aria-label={candidateCopy.overviewLabel[locale]}
            >
              {overviewCapabilities.map((node) => (
                <button
                  type="button"
                  aria-pressed={selectedCapability === node.id}
                  onClick={() => setSelectedCapability(node.id)}
                  key={node.id}
                >
                  {(() => {
                    const Icon = overviewIcons[node.id];
                    return <Icon aria-hidden="true" focusable="false" />;
                  })()}
                  <Text text={node} />
                </button>
              ))}
            </div>
            <div className="a-capability-detail" aria-live="polite">
              <div className="a-capability-detail-heading">
                <CapabilityIcon aria-hidden="true" focusable="false" />
                <strong>
                  <Text text={capability} />
                </strong>
              </div>
              <p>
                <Text
                  text={
                    capability.id === "multi-store"
                      ? candidateCopy.overviewMultiStoreBody
                      : section(capabilitySection).body
                  }
                />
              </p>
              <a
                href={`/apple#${capabilitySection}`}
                aria-label={`${copy.detail[locale]}: ${
                  section(capabilitySection).heading[locale]
                }`}
              >
                <Text text={copy.detail} />
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <section
          id="connected"
          className="a-connected a-order-journey"
          aria-labelledby="connected-heading"
        >
          <div className="a-intro">
            <p className="a-kicker">
              <Text text={candidateCopy.orderJourney.eyebrow} />
            </p>
            <h2 id="connected-heading" lang={locale}>
              <Text text={candidateCopy.orderJourney.heading} />
            </h2>
            <p className="a-body">
              <Text text={candidateCopy.orderJourney.body} />
            </p>
          </div>
          <StageFlow
            mode="active-rail"
            stages={orderJourneyStages}
            label={candidateCopy.orderJourney.heading.en}
            className="apple-stage-flow"
          />
          <p className="a-caption">
            <Text text={candidateCopy.orderJourney.illustrative} />
          </p>
        </section>
        <section
          id="sell"
          className="a-story a-sell a-sell-chapter"
          aria-labelledby="sell-heading"
        >
          <div className="a-intro">
            <p className="a-kicker">
              <Text text={candidateCopy.sellChapter.eyebrow} />
            </p>
            <h2 id="sell-heading" lang={locale}>
              <Text text={candidateCopy.sellChapter.heading} />
            </h2>
            <p className="a-body">
              <Text text={candidateCopy.sellChapter.body} />
            </p>
          </div>
          <div className="a-sell-chapter-grid">
            <section
              className="a-sell-part"
              aria-labelledby="sell-storefront-heading"
            >
              <h3 id="sell-storefront-heading" lang={locale}>
                <Text text={candidateCopy.sellChapter.storefront} />
              </h3>
              <p>
                <Text text={candidateCopy.sellChapter.storefrontBody} />
              </p>
            </section>
            <section
              id="catalog"
              className="a-sell-part"
              aria-labelledby="catalog-heading"
            >
              <h3 id="catalog-heading" lang={locale}>
                <Text text={candidateCopy.sellChapter.catalog} />
              </h3>
              <p>
                <Text text={candidateCopy.sellChapter.catalogBody} />
              </p>
              <Details id="catalog" />
            </section>
            <section
              className="a-sell-part"
              aria-labelledby="sell-checkout-heading"
            >
              <h3 id="sell-checkout-heading" lang={locale}>
                <Text text={candidateCopy.sellChapter.checkout} />
              </h3>
              <p>
                <Text text={candidateCopy.sellChapter.checkoutBody} />
              </p>
            </section>
            <section
              className="a-sell-part"
              aria-labelledby="sell-service-heading"
            >
              <h3 id="sell-service-heading" lang={locale}>
                <Text text={candidateCopy.sellChapter.service} />
              </h3>
              <p>
                <Text text={candidateCopy.sellChapter.serviceBody} />
              </p>
            </section>
            <section
              id="pos"
              className="a-sell-part a-sell-pos-part"
              aria-labelledby="pos-heading"
            >
              <h3 id="pos-heading" lang={locale}>
                <Text text={candidateCopy.sellChapter.pos} />
              </h3>
              <p>
                <Text text={candidateCopy.sellChapter.posBody} />
              </p>
              <Details id="pos" />
            </section>
          </div>
          <Details id="sell" />
        </section>
        <section
          id="operate"
          className="a-story a-operations-chapter"
          aria-labelledby="operate-heading"
        >
          <CandidateIntro
            id="operate"
            content={candidateCopy.operationsChapter}
          />
          <p className="a-caption a-chapter-qualification">
            <Text text={narrativeCopy.operateBody} />
          </p>
          <div className="a-operations-grid">
            <Story id="inventory">
              <div className="a-workflow-header">
                <h3>
                  <Text text={copy.inventoryWorkflow} />
                </h3>
              </div>
              <StageLine
                stages={inventoryStages}
                label={section("inventory").heading.en}
              />
              <p className="a-caption">
                <Text text={diagramCopy.inventoryEquivalent} />
              </p>
            </Story>
            <Story id="purchasing">
              <StageLine
                stages={toStages(narrativeCopy.purchasingFlow)}
                label={section("purchasing").heading.en}
              />
            </Story>
            <Story id="orders">
              <StageLine
                stages={toStages(narrativeCopy.ordersFlow)}
                label={section("orders").heading.en}
              />
            </Story>
            <Story id="identity" />
          </div>
          <Details id="operate" />
        </section>
        <section
          id="understand"
          className="a-story a-insight-chapter"
          aria-labelledby="understand-heading"
        >
          <CandidateIntro
            id="understand"
            content={candidateCopy.insightChapter}
          />
          <div className="a-insight-grid">
            <Story id="customers">
              <StageLine
                stages={toStages(narrativeCopy.customersFlow)}
                label={section("customers").heading.en}
              />
            </Story>
            <div className="a-insight-performance">
              <StageLine
                stages={toStages(narrativeCopy.understandFlow)}
                label={section("understand").heading.en}
              />
              <Details id="understand" />
            </div>
          </div>
        </section>
        <section
          id="business"
          className="a-story a-growth"
          aria-labelledby="business-heading"
        >
          <CandidateIntro id="business" content={candidateCopy.growthChapter} />
          <div className="a-business-model">
            <h3>
              <Text text={copy.business} />
            </h3>
            <div className="a-store-pair">
              {[copy.storeA, copy.storeB].map((store, i) => (
                <div key={store.id}>
                  <h3>
                    <Text text={store} />
                  </h3>
                  <p>
                    <Text text={i === 0 ? copy.ledgerA : copy.ledgerB} />
                  </p>
                </div>
              ))}
            </div>
            <p className="a-location">
              <Text text={copy.location} />
            </p>
            <p>
              <Text text={copy.ledgerNote} />
            </p>
          </div>
          <Details id="business" />
        </section>
        <section id="faq" className="a-faq" aria-labelledby="faq-heading">
          <div className="a-intro">
            <p className="a-kicker">
              <Text text={candidateCopy.faqChapter.eyebrow} />
            </p>
            <h2 id="faq-heading" lang={locale}>
              <Text text={candidateCopy.faqChapter.heading} />
            </h2>
            <p className="a-body">
              <Text text={candidateCopy.faqChapter.body} />
            </p>
          </div>
          <div className="a-faq-list">
            {candidateCopy.faqChapter.items.map((item) => (
              <details key={item.id} id={item.id}>
                <summary>
                  <Text text={item.question} />
                </summary>
                <p>
                  <Text text={item.answer} />
                </p>
              </details>
            ))}
          </div>
        </section>
        <section
          id="features"
          className="a-features"
          aria-labelledby="features-heading"
        >
          <Intro id="features" />
          <div className="a-index">
            {section("features").groups?.map((group) => (
              <details key={group.id} id={group.id}>
                <summary>
                  <Text text={group.name} />
                </summary>
                <p>
                  <Text
                    text={
                      group.id === "group-17"
                        ? narrativeCopy.platform
                        : group.inventory
                    }
                  />
                </p>
              </details>
            ))}
          </div>
        </section>
        <section id="demo" className="a-demo" aria-labelledby="demo-heading">
          <Intro id="demo" />
          {config.demo === "#demo" ? (
            <p className="a-notice">
              <Text text={copy.demoPending} />
            </p>
          ) : (
            <Action kind="demo" />
          )}
        </section>
        <section id="start" className="a-start" aria-labelledby="start-heading">
          <Intro id="start" />
          <div className="a-actions">
            {config.start !== "#start" && <Action />}
            <Action kind="demo" />
          </div>
          {config.start === "#start" && (
            <p className="a-notice">
              <Text text={copy.startPending} />
            </p>
          )}
          <p className="a-closing">
            <Text text={copy.closing} />
          </p>
        </section>
      </main>
      <footer id="footer" className="a-footer">
        <div className="a-footer-main">
          <div className="a-footer-identity">
            <a className="a-footer-brand" href="/apple#top" dir="ltr">
              Jizrak — <span lang="ar">جِذرك</span>
            </a>
            <p>
              <Text text={copy.rootLabel} />
            </p>
          </div>
          <nav
            className="a-footer-explore"
            aria-label={copy.featureLink[locale]}
          >
            <h2>
              <Text text={copy.featureLink} />
            </h2>
            {nav.map((item) => (
              <a key={item.id} href={`/apple#${item.id}`}>
                {item[locale]}
              </a>
            ))}
          </nav>
          <nav className="a-footer-actions" aria-label={copy.footerNav[locale]}>
            <Action />
            <a href={destination(config.demo)}>
              <Text text={copy.demo} />
              {!config.demo.startsWith("#") && (
                <span aria-hidden="true">↗</span>
              )}
            </a>
            <a href={signinDestination}>
              <Text text={copy.signin} />
              {!config.signin.startsWith("#") && (
                <span aria-hidden="true">↗</span>
              )}
            </a>
          </nav>
        </div>
        <div className="a-footer-bottom">
          <p dir="ltr">
            © {new Date().getFullYear()} Jizrak — <span lang="ar">جِذرك</span>
          </p>
          <div className="a-footer-legal">
            {config.privacy && (
              <a href={config.privacy}>
                <Text text={copy.privacy} />
              </a>
            )}
            {config.terms && (
              <a href={config.terms}>
                <Text text={copy.terms} />
              </a>
            )}
          </div>
          <a
            className="a-footer-top"
            href="/apple#top"
            aria-label={
              locale === "ar" ? "العودة إلى أعلى الصفحة" : "Back to top"
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
          </a>
        </div>
        {config.review && (
          <p className="a-footer-preview">
            <Text text={copy.preview} />
          </p>
        )}
      </footer>
    </div>
  );
}
