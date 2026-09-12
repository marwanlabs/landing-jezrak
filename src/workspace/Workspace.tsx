import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Store,
  ShieldCheck,
  Layers3,
  LifeBuoy,
  UserRound,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Plus,
  Check,
  Leaf,
  Compass,
} from "lucide-react";
import { usePreferences } from "../app/preferences";
import { useSampleData, type Translate } from "./model";
import { BusinessPages } from "./BusinessPages";
import { Governance } from "./Governance";
import { Identity } from "./Identity";
import { Demo } from "./Demo";
import "./workspace.css";

export function Button({
  children,
  href,
  onClick,
  secondary = false,
  disabled = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const className = `ws-button${secondary ? " secondary" : ""}`;
  return href ? (
    <a className={className} href={href}>
      {children}
      <ArrowUpRight size={16} />
    </a>
  ) : (
    <button
      className={className}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <ArrowRight size={16} />
    </button>
  );
}
export function Status({
  children,
  warning = false,
}: {
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <span className={`ws-status${warning ? " warning" : ""}`}>
      <span />
      {children}
    </span>
  );
}
export function SearchBox({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (s: string) => void;
  label: string;
}) {
  return (
    <label className="ws-search">
      <Search size={18} />
      <input
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
export function Heading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="ws-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="ws-notice" role="status">
      <ShieldCheck size={18} />
      <div>{children}</div>
    </div>
  );
}
export function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="ws-empty">
      <Compass size={32} />
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  );
}
export function ContextScene({
  title,
  caption,
  t,
}: {
  title: string;
  caption: string;
  t: Translate;
}) {
  return (
    <div
      className="ws-scene"
      role="group"
      aria-label={t(
        "Business and Store relationship",
        "العلاقة بين النشاط والمتجر",
      )}
    >
      <div className="ws-scene-grid" />
      <div className="ws-scene-back">
        <Building2 size={20} />
        <span>JIZRAK / {t("BUSINESS", "النشاط")}</span>
        <strong>{title}</strong>
        <small>{caption}</small>
      </div>
      <div className="ws-scene-front">
        <Store size={22} />
        <div>
          <strong>{t("Your next chapter", "خطوتك القادمة")}</strong>
          <small>{t("A store of your own.", "متجر يحمل اسمك.")}</small>
        </div>
        <span className="ws-check">
          <Check size={14} />
        </span>
      </div>
      <span className="ws-scene-caption">
        {t("ONE BUSINESS. ROOM TO GROW.", "نشاط واحد، ومساحة للتوسع.")}
      </span>
    </div>
  );
}
export function Workspace() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const prefs = usePreferences();
  const ar = prefs.locale === "ar";
  const t: Translate = (en, arabic) => (ar ? arabic : en);
  const data = useSampleData();
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const governance = path.startsWith("/platform");
  const links = [
    { href: "/businesses", label: t("Businesses", "الأنشطة"), icon: Building2 },
    { href: "/stores", label: t("Stores", "المتاجر"), icon: Store },
    {
      href: "/demo",
      label: t("Explore the demo", "استكشف التجربة"),
      icon: Compass,
    },
    { href: "/platform", label: t("Overview", "نظرة عامة"), icon: ShieldCheck },
    {
      href: "/platform/lifecycle",
      label: t("Lifecycle", "دورة التشغيل"),
      icon: Layers3,
    },
    {
      href: "/platform/support",
      label: t("Support access", "صلاحيات الدعم"),
      icon: LifeBuoy,
    },
  ];
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      element.style.setProperty(
        "--ws-scroll",
        `${media.matches ? 0 : Math.min(scrollY, 700) * 0.045}px`,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ws-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    element
      .querySelectorAll(".ws-panel, .ws-card, .ws-demo-chapter")
      .forEach((node) => observer.observe(node));
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", update);
    };
  }, [path]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <div
      ref={root}
      className="workspace"
      lang={prefs.locale}
      dir={ar ? "rtl" : "ltr"}
    >
      <a className="ws-skip" href="#workspace-main">
        {t("Skip to content", "انتقل إلى المحتوى")}
      </a>
      <aside
        className={`ws-sidebar${menu ? " open" : ""}`}
        id="workspace-navigation"
      >
        <a className="ws-brand" href="/">
          <img src="/icons/favicon.svg" width="34" height="34" alt="" />
          <span>
            jizrak<span className="ws-brand-dot">.</span>
          </span>
        </a>
        <div className="ws-space-label">
          {t("YOUR WORKSPACE", "مساحة عملك")}
        </div>
        <nav aria-label={t("Workspace navigation", "التنقل في مساحة العمل")}>
          {links.map((link, index) => (
            <div key={link.href}>
              {index === 3 && (
                <div className="ws-space-label governance-label">
                  {t("PLATFORM GOVERNANCE", "إدارة المنصة")}
                </div>
              )}
              <a
                href={link.href}
                aria-current={
                  (
                    link.href === "/platform"
                      ? path === link.href ||
                        path.startsWith("/platform/business/")
                      : path.startsWith(link.href)
                  )
                    ? "page"
                    : undefined
                }
              >
                <link.icon size={19} />
                <span>{link.label}</span>
              </a>
            </div>
          ))}
        </nav>
        <div className="ws-sidebar-bottom">
          <div className="ws-sidebar-note">
            <Leaf size={22} />
            <p>
              {t(
                "A strong foundation. Space for what comes next.",
                "أساس ثابت لكل خطوة قادمة.",
              )}
            </p>
          </div>
          <a className="ws-profile" href="/account">
            <span className="ws-avatar">S</span>
            <span>
              <strong>{t("Sample account", "حساب تجريبي")}</strong>
              <small>{t("Manage your identity", "إدارة حسابك")}</small>
            </span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </aside>
      <div className="ws-body">
        <header className="ws-topbar">
          <div className="ws-topbar-leading">
            <button
              className="ws-icon ws-menu"
              aria-label={t("Toggle navigation", "فتح وإغلاق القائمة")}
              aria-expanded={menu}
              aria-controls="workspace-navigation"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
            <span>
              {t("Workspace", "مساحة العمل")}
              <span className="ws-breadcrumb-separator">/</span>
              <strong>
                {governance
                  ? t("Platform", "المنصة")
                  : path.startsWith("/auth") || path === "/account"
                    ? t("Identity", "الحساب")
                    : t("Your business", "نشاطك")}
              </strong>
            </span>
          </div>
          <div className="ws-utilities">
            <span className="ws-preview-label">
              {t("UI preview", "معاينة الواجهة")}
            </span>
            <button
              className="ws-icon"
              onClick={() => prefs.setLocale(ar ? "en" : "ar")}
              aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}
            >
              {ar ? "EN" : "ع"}
            </button>
            <button
              className="ws-icon"
              onClick={() =>
                prefs.setTheme(prefs.theme === "dark" ? "light" : "dark")
              }
              aria-label={t("Toggle color theme", "تغيير المظهر")}
            >
              {prefs.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              className="ws-icon"
              href="/account"
              aria-label={t("Account", "الحساب")}
            >
              <UserRound size={18} />
            </a>
          </div>
        </header>
        <main id="workspace-main" className="ws-main" key={path}>
          {path === "/demo" ? (
            <Demo t={t} />
          ) : path.startsWith("/platform") ? (
            <Governance path={path} data={data} t={t} ar={ar} />
          ) : path === "/account" || path.startsWith("/auth/") ? (
            <Identity path={path} t={t} />
          ) : (
            <BusinessPages path={path} data={data} t={t} ar={ar} />
          )}
          <footer className="ws-footer">
            <span>JIZRAK</span>
            <span>
              {t(
                "Sample data. Your real business stays untouched.",
                "بيانات تجريبية لا تؤثر على نشاطك الفعلي.",
              )}
            </span>
            <a href="/features">
              {t("Explore the platform", "استكشف المنصة")}{" "}
              <ArrowUpRight size={14} />
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
export { Plus };
