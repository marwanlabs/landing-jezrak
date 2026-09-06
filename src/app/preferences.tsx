import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { metadata, ui, type Locale } from "../content";
export type Theme = "light" | "dark" | "system";
export function readLocale(stored: string | null, browser: string): Locale {
  return stored === "ar" || stored === "en"
    ? stored
    : browser.toLowerCase().startsWith("ar")
      ? "ar"
      : "en";
}
export function readTheme(stored: string | null): Theme {
  return stored === "dark" || stored === "light" ? stored : "system";
}
export const preferenceScript = `(function(){var l=null,t=null;try{l=localStorage.getItem('jizrak.locale');t=localStorage.getItem('jizrak.theme')}catch(e){}l=l==='ar'||l==='en'?l:(navigator.language||'').toLowerCase().startsWith('ar')?'ar':'en';t=t==='dark'||t==='light'?t:'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light';})();`;
type Preferences = {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
};
const Context = createContext<Preferences>({
  locale: "en",
  theme: "system",
  setLocale: () => {},
  setTheme: () => {},
});
export const usePreferences = () => useContext(Context);
function stored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Session preference remains usable. */
  }
}
export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("en");
  const [theme, updateTheme] = useState<Theme>("system");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const scroll = useRef<{ element: Element; offset: number } | null>(null);
  const [i18n] = useState(() => {
    const instance = createInstance();
    void instance.init({
      resources: ui,
      lng: "en",
      fallbackLng: "en",
      initImmediate: false,
      interpolation: { escapeValue: false },
    });
    return instance;
  });
  useEffect(() => {
    updateLocale(readLocale(stored("jizrak.locale"), navigator.language));
    updateTheme(readTheme(stored("jizrak.theme")));
    setReady(true);
  }, []);
  useLayoutEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.hydrated = "true";
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    void i18n.changeLanguage(locale);
    document.title = metadata[locale].title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metadata[locale].description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", metadata[locale].title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", metadata[locale].description);
    if (scroll.current) {
      const position = scroll.current;
      const restore = () =>
        window.scrollBy({
          top: position.element.getBoundingClientRect().top - position.offset,
          behavior: "instant",
        });
      restore();
      // Font metrics, browser anchoring and ScrollTrigger can settle one frame later.
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });
      scroll.current = null;
    }
    window.dispatchEvent(new Event("jizrak:reflow"));
  }, [locale, ready, i18n]);
  useEffect(() => {
    if (!ready) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#15231B" : "#F4F1E8");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, ready]);
  const setLocale = (next: Locale) => {
    const element = [...document.querySelectorAll("main > section")].find(
      (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= innerHeight / 2 && rect.bottom > innerHeight / 2;
      },
    );
    if (element)
      scroll.current = { element, offset: element.getBoundingClientRect().top };
    persist("jizrak.locale", next);
    updateLocale(next);
    setStatus(ui[next].translation.localeStatus);
  };
  const setTheme = (next: Theme) => {
    persist("jizrak.theme", next);
    updateTheme(next);
    setStatus(ui[locale].translation.themeStatus);
  };
  return (
    <Context.Provider value={{ locale, theme, setLocale, setTheme }}>
      <I18nextProvider i18n={i18n}>
        {children}
        <span className="sr-only" role="status" aria-live="polite">
          {status}
        </span>
      </I18nextProvider>
    </Context.Provider>
  );
}
