import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon, Monitor, Globe2 } from "lucide-react";
import { usePreferences, type Theme } from "../app/preferences";
import { nav, copy } from "../content";
import { config } from "../app/config";
import { Brand, Cta, PairedLink } from "./Primitives";
export function ThemeControl() {
  const { theme, setTheme } = usePreferences();
  const { t } = useTranslation();
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  return (
    <label className="theme-control">
      <Icon size={17} aria-hidden="true" />
      <span className="sr-only">{t("theme")}</span>
      <select
        aria-label={t("theme")}
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
      >
        {(["system", "light", "dark"] as const).map((mode) => (
          <option key={mode} value={mode}>
            {t(mode)}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { locale, setLocale } = usePreferences();
  const { t } = useTranslation();
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(min-width: 1280px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", resize);
    const observe = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    nav.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observe.observe(element);
    });
    return () => {
      media.removeEventListener("change", resize);
      observe.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  const links = (
    <>
      {nav.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "location" : undefined}
          onClick={() => setOpen(false)}
        >
          {item[locale]}
        </a>
      ))}
    </>
  );
  return (
    <>
      <a href="#main" className="skip-link">
        {t("skip")}
      </a>
      <header className="site-header" ref={header}>
        <div className="header-row container">
          <Brand />
          <nav
            className="desktop-nav"
            aria-label={t("mainNav")}
          >
            {links}
          </nav>
          <div className="header-controls">
            <button
              className="locale-control"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              lang={locale === "en" ? "ar" : "en"}
              aria-label={t("locale")}
            >
              <Globe2 size={16} aria-hidden="true" />
              {t("locale")}
            </button>
            <div className="desktop-control">
              <ThemeControl />
            </div>
            <PairedLink
              text={copy.signin}
              href={config.signin}
              className="signin desktop-control"
            />
            <Cta compact />
            <button
              className="menu-trigger"
              ref={trigger}
              aria-label={t(open ? "close" : "open")}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav container"
            aria-label={t("mainNav")}
          >
            {links}
            <ThemeControl />
            <PairedLink
              text={copy.signin}
              href={config.signin}
              onClick={() => setOpen(false)}
            />
          </nav>
        )}
        <noscript>
          <nav className="noscript-nav container">
            {nav.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item[locale]}
              </a>
            ))}
          </nav>
        </noscript>
      </header>
    </>
  );
}
