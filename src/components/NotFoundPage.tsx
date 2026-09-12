import { ArrowRight, Home } from "lucide-react";
import { PreferenceProvider, usePreferences } from "../app/preferences";
import { RootMark } from "./Primitives";
import "../styles/not-found.css";

const messages = {
  en: {
    label: "404 · Page not found",
    title: "A little off the beaten path.",
    description: "This page may have moved, or the link may be incorrect. Let's get you back to familiar ground.",
    home: "Back to home",
    demo: "Explore the demo",
    footer: "Good things start with strong roots.",
  },
  ar: {
    label: "404 · الصفحة غير موجودة",
    title: "خرجنا قليلًا عن المسار.",
    description: "ربما نُقلت هذه الصفحة، أو أن الرابط غير صحيح. لنعد إلى الطريق الصحيح.",
    home: "العودة للرئيسية",
    demo: "استكشف العرض التجريبي",
    footer: "كل بداية قوية لها جذور.",
  },
};

function NotFoundContent() {
  const { locale } = usePreferences();
  const text = messages[locale];
  return (
    <div className="not-found" dir={locale === "ar" ? "rtl" : "ltr"}>
      <header className="nf-header">
        <a className="nf-brand" href="/" aria-label={locale === "ar" ? "جِذرك، الرئيسية" : "Jizrak home"}>
          <RootMark /><span>Jizrak</span><span lang="ar">جِذرك</span>
        </a>
        <span className="nf-header-label">{text.label}</span>
      </header>
      <main className="nf-main" aria-labelledby="nf-title">
        <div className="nf-art" aria-hidden="true" dir="ltr">
          <div className="nf-grid" />
          <div className="nf-numerals"><span>4</span><span className="nf-zero">0</span><span>4</span></div>
          <svg className="nf-branch" viewBox="0 0 600 420" fill="none">
            <path d="M35 350H142L218 274H300V168M300 232L365 167H445M300 200L258 158" />
            <circle cx="35" cy="350" r="5" /><circle cx="445" cy="167" r="5" />
            <path className="nf-leaf" d="M258 158C228 157 214 138 215 117C242 116 260 130 258 158Z" />
          </svg>
          <div className="nf-root"><RootMark /></div>
          <span className="nf-baseline" />
        </div>
        <section className="nf-copy">
          <p className="nf-status"><span />{text.label}</p>
          <h1 id="nf-title">{text.title}</h1>
          <p className="nf-description">{text.description}</p>
          <div className="nf-actions">
            <a href="/" className="nf-home"><Home size={17} aria-hidden="true" />{text.home}</a>
            <a href="/demo" className="nf-demo">{text.demo}<ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </section>
      </main>
      <footer className="nf-footer"><RootMark /><p>{text.footer}</p><span>Jizrak</span></footer>
    </div>
  );
}

export function NotFoundPage() {
  return <PreferenceProvider><NotFoundContent /></PreferenceProvider>;
}
