import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePreferences, type Theme } from "../app/preferences";
import { config } from "../app/config";
import {
  section,
  copy,
  nav,
  nodes,
  flow,
  workflowNames,
  narrativeCopy,
  diagramCopy,
  ui,
  type BilingualText,
} from "../content";
import "./apple.css";

import { publicDetails } from "./publicContent";
function Text({ text }: { text: BilingualText }) {
  const { locale } = usePreferences();
  return <span data-copy={text.id}>{text[locale]}</span>;
}
function Path({ items }: { items: BilingualText[] }) {
  return (
    <ol className="a-path">
      {items.map((item) => (
        <li key={item.id}>
          <Text text={item} />
        </li>
      ))}
    </ol>
  );
}
const destination = (href: string) =>
  href.startsWith("#") ? `/apple${href}` : href;
function Action({ kind = "start" }: { kind?: "start" | "demo" | "signin" }) {
  return (
    <a
      className={kind === "start" ? "a-button" : "a-link"}
      href={destination(config[kind])}
    >
      <Text text={copy[kind]} />
      <span aria-hidden="true"> ↗</span>
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
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  useEffect(() => {
    const main = header.current?.closest(".apple-page")?.querySelector("main");
    if (!main) return;
    const groups: Record<string, string> = {
      connected: "connected",
      business: "connected",
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
    const media = matchMedia("(min-width: 80rem)");
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
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            if (menu.current) menu.current.open = false;
            trigger.current?.focus();
          }
        }}
      >
        <summary ref={trigger} aria-label={labels.open}>
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
  const hero = section("top");
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
            <Text text={hero.eyebrow} />
          </p>
          <h1 id="top-heading" lang={locale}>
            <Text text={hero.heading} />
          </h1>
          <p className="a-body">
            <Text text={hero.body} />
          </p>
          <div className="a-actions">
            <Action />
            <Action kind="demo" />
          </div>
          <p className="a-premise">
            <Text text={hero.premise} />
          </p>
          <div className="a-overview">
            <div className="a-overview-title">
              <Text text={copy.rootLabel} />
            </div>
            <div className="a-applications">
              {nodes.map((node) => (
                <a
                  href={`/apple#${node.id === "storefront" ? "sell" : node.id === "finance" ? "understand" : node.id}`}
                  key={node.id}
                >
                  <span
                    className={`a-symbol a-symbol-${node.id}`}
                    aria-hidden="true"
                  />
                  <Text text={node} />
                </a>
              ))}
            </div>
          </div>
        </section>
        <section
          id="connected"
          className="a-connected"
          aria-labelledby="connected-heading"
        >
          <Intro id="connected" />
          <ol className="a-workflow">
            {section("connected").details.map((item, i) => (
              <li key={item.id}>
                <h3>
                  <Text text={workflowNames[i]} />
                </h3>
                <p>
                  <Text text={item} />
                </p>
              </li>
            ))}
          </ol>
          <div className="a-positioning">
            {[copy.native, copy.stock, copy.egp].map((item) => (
              <p key={item.id}>
                <Text text={item} />
              </p>
            ))}
          </div>
        </section>
        <Story id="business">
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
        </Story>
        <Story id="sell">
          <Path items={narrativeCopy.sellFlow} />
        </Story>
        <Story id="pos">
          <Path items={narrativeCopy.posFlow} />
        </Story>
        <Story id="catalog">
          <Path items={diagramCopy.catalogSurfaces} />
        </Story>
        <Story id="inventory">
          <Path items={flow} />
          <p className="a-caption">
            <Text text={diagramCopy.inventoryEquivalent} />
          </p>
        </Story>
        <Story id="purchasing">
          <Path items={narrativeCopy.purchasingFlow} />
        </Story>
        <Story id="orders">
          <Path items={narrativeCopy.ordersFlow} />
        </Story>
        <Story id="customers">
          <Path items={narrativeCopy.customersFlow} />
        </Story>
        <Story id="understand">
          <Path items={narrativeCopy.understandFlow} />
        </Story>
        <Story id="identity" />
        <Story id="operate" />
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
        {config.signin === "#sign-in" && (
          <section
            id="sign-in"
            className="a-signin"
            aria-labelledby="sign-in-heading"
          >
            <h2 id="sign-in-heading">
              <Text text={copy.signin} />
            </h2>
            <p>
              <Text text={copy.signPending} />
            </p>
          </section>
        )}
      </main>
      <footer className="a-footer">
        <a className="a-footer-brand" href="/apple#top" dir="ltr">
          Jizrak — <span lang="ar">جِذرك</span>
        </a>
        <nav aria-label={copy.footerNav[locale]}>
          <a href="/apple#features">
            <Text text={copy.featureLink} />
          </a>
          <a href={destination(config.demo)}>
            <Text text={copy.demoLink} />
          </a>
          <Action kind="signin" />
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
          <a href="/apple#top" aria-label="Jizrak — جِذرك">
            ↑
          </a>
        </nav>
        <p dir="ltr">
          © {new Date().getFullYear()} Jizrak — <span lang="ar">جِذرك</span>
        </p>
        {config.review && (
          <p className="a-notice">
            <Text text={copy.preview} />
          </p>
        )}
      </footer>
    </div>
  );
}
