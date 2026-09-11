import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Store,
  Package,
  ShoppingBag,
  Boxes,
  Moon,
  Sun,
  LockKeyhole,
  ArrowUpRight,
} from "lucide-react";
import { usePreferences } from "../app/preferences";
import { config } from "../app/config";
import "./auth.css";

type Mode = "login" | "signup";
type Field = "name" | "store" | "email" | "password";

export function AuthPage({ mode }: { mode: Mode }) {
  const signup = mode === "signup";
  const { locale, setLocale, theme, setTheme } = usePreferences();
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [values, setValues] = useState({
    name: "",
    store: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const specimen = useRef<HTMLDivElement>(null);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    const element = specimen.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.arrived = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (submitted) result.current?.focus();
  }, [submitted]);

  const labels = {
    name: t("Full name", "الاسم الكامل"),
    store: t("Store name", "اسم المتجر"),
    email: t("Email address", "البريد الإلكتروني"),
    password: t("Password", "كلمة المرور"),
  };
  const messages = {
    name: t("Enter your name.", "أدخل اسمك."),
    store: t("Give your store a name.", "أدخل اسم متجرك."),
    email: t("Enter a valid email address.", "أدخل بريدًا إلكترونيًا صحيحًا."),
    password: signup
      ? t("Use at least 12 characters.", "استخدم 12 حرفًا على الأقل.")
      : t("Enter your password.", "أدخل كلمة المرور."),
  };
  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: false }));
    setSubmitted(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<Field, boolean>> = {};
    if (signup && !values.name.trim()) next.name = true;
    if (signup && !values.store.trim()) next.store = true;
    const email = form.current?.elements.namedItem(
      "email",
    ) as HTMLInputElement | null;
    if (!values.email.trim() || !email?.validity.valid) next.email = true;
    if (!recovery && (signup ? values.password.length < 12 : !values.password))
      next.password = true;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      setSubmitted(false);
      (
        form.current?.elements.namedItem(first) as HTMLInputElement | null
      )?.focus();
      return;
    }
    // Design preview only. Never send or persist credentials without an auth integration.
    setValues((current) => ({ ...current, password: "" }));
    setShowPassword(false);
    setSubmitted(true);
  }
  function field(id: Field) {
    const password = id === "password";
    return (
      <div className="auth-field" key={id}>
        <label htmlFor={id}>{labels[id]}</label>
        <div className={password ? "auth-password" : undefined}>
          <input
            id={id}
            name={id}
            type={
              password
                ? showPassword
                  ? "text"
                  : "password"
                : id === "email"
                  ? "email"
                  : "text"
            }
            dir={id === "email" || password ? "ltr" : "auto"}
            autoComplete={
              password
                ? signup
                  ? "new-password"
                  : "current-password"
                : id === "store"
                  ? "organization"
                  : id === "email"
                    ? "username"
                    : "name"
            }
            autoCapitalize={id === "email" ? "none" : undefined}
            spellCheck={id === "email" || password ? false : undefined}
            required
            maxLength={password ? 128 : id === "email" ? 254 : 80}
            minLength={password && signup ? 12 : undefined}
            value={values[id]}
            onChange={(event) => update(id, event.target.value)}
            aria-invalid={errors[id] || undefined}
            aria-describedby={
              errors[id]
                ? `${id}-error`
                : password && signup
                  ? "password-hint"
                  : undefined
            }
            placeholder={
              id === "email"
                ? "you@example.com"
                : id === "store"
                  ? t("Your store, your name", "الاسم الذي اخترته لمتجرك")
                  : undefined
            }
          />
          {password && (
            <button
              type="button"
              className="auth-reveal"
              aria-label={
                showPassword
                  ? t("Hide password", "إخفاء كلمة المرور")
                  : t("Show password", "إظهار كلمة المرور")
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={19} aria-hidden="true" />
              ) : (
                <Eye size={19} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {errors[id] ? (
          <p className="auth-error" id={`${id}-error`}>
            {messages[id]}
          </p>
        ) : password && signup ? (
          <p className="auth-hint" id="password-hint">
            {t(
              "At least 12 characters. A few memorable words work well.",
              "12 حرفًا على الأقل. يمكنك استخدام عبارة يسهل تذكّرها.",
            )}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="auth-page" lang={locale} dir={ar ? "rtl" : "ltr"}>
      <a href="#auth-form" className="skip-link">
        {t("Skip to form", "انتقل إلى النموذج")}
      </a>
      <header className="auth-header">
        <a
          href="/"
          className="auth-brand"
          aria-label={t("Jizrak home", "الرئيسية، جِذرك")}
        >
          <img src="/icons/favicon.svg" alt="" width="34" height="34" />
          {t("jizrak", "جِذرك")}
        </a>
        <div className="auth-utilities">
          <a href="/features" className="auth-explore">
            {t("Explore Jizrak", "تعرّف على جِذرك")}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setLocale(ar ? "en" : "ar")}
            lang={ar ? "en" : "ar"}
          >
            {ar ? "English" : "العربية"}
          </button>
          <button
            type="button"
            aria-label={t("Change color theme", "تغيير ألوان الصفحة")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <main className="auth-layout">
        <aside
          className="auth-story"
          aria-label={t("Your business with Jizrak", "متجرك مع جِذرك")}
        >
          <div className="auth-story-copy">
            <p className="auth-eyebrow">
              {t("A place to grow your business", "مساحة ينمو فيها متجرك")}
            </p>
            <h2>
              {signup
                ? t("Make it yours.", "ابدأ باسمك.")
                : t("Back to your business.", "عُد إلى متجرك.")}
            </h2>
            <p>
              {t(
                "Your storefront, stock and sales. Rooted in one place.",
                "واجهة متجرك ومخزونه ومبيعاته، في مكان واحد.",
              )}
            </p>
          </div>
          <div
            className="auth-specimen"
            ref={specimen}
            aria-label={t(
              "Illustration of connected store operations",
              "رسم توضيحي لعمليات المتجر المترابطة",
            )}
          >
            <div className="auth-grid" aria-hidden="true" />
            <div className="auth-orbit" aria-hidden="true" />
            <div className="auth-shop">
              <div className="auth-shop-top">
                <span>{t("YOUR STORE", "متجرك")}</span>
                <span className="auth-shop-mark" aria-hidden="true">
                  ✳
                </span>
              </div>
              <Store size={70} strokeWidth={1} aria-hidden="true" />
              <p className="auth-store-name" dir="auto">
                {signup && values.store.trim()
                  ? values.store.trim()
                  : t("Your next chapter", "بداية جديدة")}
              </p>
              <span className="auth-specimen-label">
                {t("Store identity preview", "معاينة هوية المتجر")}
              </span>
            </div>
            <div className="auth-connections" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="auth-operations">
              <div>
                <Package size={21} strokeWidth={1.4} aria-hidden="true" />
                <span>{t("Products", "المنتجات")}</span>
              </div>
              <div>
                <ShoppingBag size={21} strokeWidth={1.4} aria-hidden="true" />
                <span>{t("Orders", "الطلبات")}</span>
              </div>
              <div>
                <Boxes size={21} strokeWidth={1.4} aria-hidden="true" />
                <span>{t("Inventory", "المخزون")}</span>
              </div>
            </div>
          </div>
          <div className="auth-story-end">
            <span className="auth-root-line" aria-hidden="true" />
            <p>
              {t(
                "Built around the person behind the store.",
                "لمن يقف وراء كل تفاصيل المتجر.",
              )}
            </p>
            <a href="/features">
              {t("See how it connects", "اكتشف كيف تترابط التفاصيل")}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </aside>

        <section className="auth-entry" aria-labelledby="auth-title">
          <div className="auth-form-wrap" id="auth-form">
            <p className="auth-mobile-note">
              {t("Your business starts with you.", "متجرك يبدأ بك.")}
            </p>
            <div className="auth-heading">
              <span className="auth-entry-icon">
                <LockKeyhole size={21} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h1 id="auth-title">
                {recovery
                  ? t("Forgot your password?", "نسيت كلمة المرور؟")
                  : signup
                    ? t("Your store starts here.", "متجرك يبدأ هنا.")
                    : t("Welcome back.", "أهلًا بعودتك.")}
              </h1>
              <p>
                {recovery
                  ? t(
                      "Use the email associated with your account.",
                      "استخدم البريد الإلكتروني المرتبط بحسابك.",
                    )
                  : signup
                    ? t(
                        "Create an account for the business you're building.",
                        "أنشئ حسابًا لإدارة المتجر الذي تبنيه.",
                      )
                    : t(
                        "Log in to your Jizrak workspace.",
                        "سجّل الدخول إلى مساحة متجرك في جِذرك.",
                      )}
              </p>
            </div>
            <p className="auth-preview-note">
              {t(
                "Design preview. Use sample details; account access is not connected yet.",
                "معاينة للتصميم. استخدم بيانات تجريبية؛ خدمة الحسابات غير متصلة بعد.",
              )}
            </p>
            <form
              ref={form}
              method="post"
              onSubmit={submit}
              noValidate
              aria-labelledby="auth-title"
            >
              <fieldset disabled={!ready}>
                <legend className="sr-only">
                  {signup
                    ? t("Account details", "بيانات الحساب")
                    : t("Login details", "بيانات الدخول")}
                </legend>
                {signup && field("name")}
                {signup && field("store")}
                {field("email")}
                {!recovery && field("password")}
                {!signup && !recovery && (
                  <button
                    type="button"
                    className="auth-forgot"
                    onClick={() => {
                      setRecovery(true);
                      setSubmitted(false);
                      setErrors({});
                      setValues((current) => ({ ...current, password: "" }));
                    }}
                  >
                    {t("Forgot password?", "نسيت كلمة المرور؟")}
                  </button>
                )}
                <button type="submit" className="auth-submit">
                  {recovery
                    ? t("Continue", "متابعة")
                    : signup
                      ? t("Create account", "إنشاء حساب")
                      : t("Log in", "تسجيل الدخول")}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </fieldset>
            </form>
            <noscript>
              <p className="auth-preview-note">
                JavaScript is required for this form preview. No details will be
                submitted.
              </p>
            </noscript>
            {submitted && (
              <div
                className="auth-result"
                role="status"
                tabIndex={-1}
                ref={result}
              >
                <strong>
                  {t("This is a design preview.", "هذه معاينة للتصميم.")}
                </strong>
                <p>
                  {recovery
                    ? t(
                        "Password recovery is not connected. No reset email was sent.",
                        "استعادة كلمة المرور غير متصلة. لم نرسل رسالة لإعادة تعيينها.",
                      )
                    : t(
                        "Authentication is not connected. Your details were not sent and no account was created or signed in.",
                        "خدمة الحسابات غير متصلة. لم نرسل بياناتك، ولم ننشئ حسابًا أو نسجّل الدخول.",
                      )}
                </p>
              </div>
            )}
            {recovery ? (
              <button
                className="auth-switch auth-back"
                type="button"
                onClick={() => {
                  setRecovery(false);
                  setSubmitted(false);
                  setErrors({});
                }}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {t("Back to log in", "العودة لتسجيل الدخول")}
              </button>
            ) : (
              <p className="auth-switch">
                {signup
                  ? t("Already have an account?", "لديك حساب بالفعل؟")
                  : t("New to Jizrak?", "جديد في جِذرك؟")}{" "}
                <a href={signup ? "/login" : "/signup"}>
                  {signup
                    ? t("Log in", "تسجيل الدخول")
                    : t("Create an account", "إنشاء حساب")}
                </a>
              </p>
            )}
            {(config.privacy || config.terms) && (
              <nav
                className="auth-legal"
                aria-label={t("Legal information", "المعلومات القانونية")}
              >
                {config.privacy && (
                  <a href={config.privacy}>{t("Privacy", "الخصوصية")}</a>
                )}
                {config.terms && (
                  <a href={config.terms}>{t("Terms", "الشروط")}</a>
                )}
              </nav>
            )}
          </div>
          <footer className="auth-footer">
            <span>
              {t("Jizrak. Rooted in your business.", "جِذرك. من أساس متجرك.")}
            </span>
            <a href="/">
              {t("Back to website", "العودة إلى الموقع")}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
}
