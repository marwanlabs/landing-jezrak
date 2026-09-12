import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button, ContextScene, Heading, Notice } from "./Workspace";
import { safeReturn, type Translate } from "./model";
import { PasswordResetForm } from "./PasswordResetForm";

export function Identity({ path, t }: { path: string; t: Translate }) {
  const account = path === "/account";
  const reset = path.endsWith("reset-password");
  const recovery = path.endsWith("/recovery");
  const invite = path.endsWith("accept-invite");
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("Sample merchant");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [returnTo, setReturnTo] = useState("/businesses");
  useEffect(() => {
    setReady(true);
    setReturnTo(
      safeReturn(new URLSearchParams(location.search).get("returnTo")),
    );
  }, []);
  const title = account
    ? t("One identity. Every possibility.", "حساب واحد لكل أنشطتك.")
    : reset
      ? t("A fresh start, securely.", "بداية جديدة لحسابك.")
      : recovery
        ? t("Let’s get you back on track.", "لنساعدك على العودة.")
        : invite
          ? t("Good work starts together.", "العمل الجيد يبدأ بفريق.")
          : t("Find your way back.", "عُد إلى حسابك.");
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (reset && (password.length < 12 || password !== confirm)) {
      setError(
        t(
          "Use at least 12 characters and enter the same password in both fields.",
          "استخدم 12 حرفًا على الأقل وأدخل كلمة المرور نفسها في الحقلين.",
        ),
      );
      return;
    }
    if (account && name.trim().length < 2) {
      setError(
        t(
          "Enter a name with at least two characters.",
          "أدخل اسمًا من حرفين على الأقل.",
        ),
      );
      return;
    }
    setPassword("");
    setConfirm("");
    setDone(true);
  }
  return (
    <>
      <Heading
        title={title}
        description={
          account
            ? t(
                "Your Jizrak profile belongs to you, across every Business and Store.",
                "حساب جِذرك يرافقك في كل نشاط ومتجر.",
              )
            : t(
                "A clear next step back to your Jizrak workspace.",
                "خطوة واضحة للعودة إلى مساحة عملك في جِذرك.",
              )
        }
      />
      <div className="ws-form-layout">
        <section className="ws-panel ws-identity-panel">
          <span className="ws-identity-icon">
            {account ? (
              <ShieldCheck size={27} />
            ) : reset ? (
              <LockKeyhole size={27} />
            ) : (
              <Mail size={27} />
            )}
          </span>
          <h2>
            {account
              ? t("Personal details", "البيانات الشخصية")
              : reset
                ? t("Set a new password", "تعيين كلمة مرور جديدة")
                : recovery
                  ? t(
                      "Your sign-in could not continue",
                      "تعذّر إكمال تسجيل الدخول",
                    )
                  : invite
                    ? t("Your invitation", "دعوتك")
                    : t("Reset your password", "استعادة كلمة المرور")}
          </h2>
          {done ? (
            <div className="ws-success" tabIndex={-1} role="status">
              <Check size={30} />
              <h3>{t("Preview complete.", "اكتملت المعاينة.")}</h3>
              <p>
                {account
                  ? t(
                      "Your profile changes are shown for this preview only. No identity record was updated.",
                      "تغييرات الملف للمعاينة فقط. لم يُحدّث الحساب الفعلي.",
                    )
                  : reset
                    ? t(
                        "Password validation passed. No password was sent or saved. A live recovery session is required to update an account.",
                        "اجتازت كلمة المرور التحقق. لم تُرسل أو تُحفظ. يلزم رابط استعادة فعلي لتحديث الحساب.",
                      )
                    : invite
                      ? t(
                          "Invitation acceptance previewed. No team membership or Store access was granted.",
                          "تمت معاينة قبول الدعوة. لم تُمنح عضوية فريق أو صلاحية متجر.",
                        )
                      : t(
                          "The email format is valid. No reset email was sent from this UI preview.",
                          "صيغة البريد صحيحة. لم تُرسل رسالة استعادة من هذه المعاينة.",
                        )}
              </p>
              <Button secondary onClick={() => setDone(false)}>
                {t("Back to form", "العودة إلى النموذج")}
              </Button>
              <Button
                href={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
              >
                {t("Return to sign in", "العودة لتسجيل الدخول")}
              </Button>
            </div>
          ) : recovery ? (
            <>
              <p>
                {t(
                  "The Store sign-in handoff could not be completed. Return to Jizrak sign-in and try again.",
                  "تعذّر إكمال الانتقال من تسجيل دخول المتجر. عُد إلى تسجيل دخول جِذرك وحاول مرة أخرى.",
                )}
              </p>
              <Notice>
                {t(
                  "No live sign-in session is connected to this preview.",
                  "لا توجد جلسة تسجيل دخول فعلية متصلة بالمعاينة.",
                )}
              </Notice>
              <Button
                href={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
              >
                {t("Return to sign in", "العودة لتسجيل الدخول")}
              </Button>
            </>
          ) : (
            reset ? <PasswordResetForm t={t} /> : <form onSubmit={submit}>
              <fieldset disabled={!ready}>
                {invite && (
                  <Notice>
                    {t(
                      "Sample invitation to Olive Home. Live invitation validation and identity matching are not connected.",
                      "دعوة تجريبية إلى أوليف للمنزل. التحقق من الدعوة ومطابقة الهوية غير متصلين.",
                    )}
                  </Notice>
                )}
                {account && (
                  <label className="ws-field">
                    {t("Full name", "الاسم الكامل")}
                    <input
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                )}
                {!reset && (
                  <label className="ws-field">
                    {invite
                      ? t("Invited email address", "البريد الذي تلقى الدعوة")
                      : t("Email address", "البريد الإلكتروني")}
                    <input
                      required
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </label>
                )}
                {reset && (
                  <>
                    <p>
                      {t(
                        "Use at least 12 characters. Choose a password you haven’t used elsewhere.",
                        "استخدم 12 حرفًا على الأقل وكلمة مرور لم تستخدمها في مكان آخر.",
                      )}
                    </p>
                    <label className="ws-field">
                      {t("New password", "كلمة المرور الجديدة")}
                      <div className="ws-password">
                        <input
                          required
                          type={show ? "text" : "password"}
                          minLength={12}
                          maxLength={128}
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="ws-icon"
                          onClick={() => setShow(!show)}
                          aria-label={
                            show
                              ? t("Hide password", "إخفاء كلمة المرور")
                              : t("Show password", "إظهار كلمة المرور")
                          }
                        >
                          {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </label>
                    <label className="ws-field">
                      {t("Confirm new password", "تأكيد كلمة المرور الجديدة")}
                      <input
                        required
                        minLength={12}
                        maxLength={128}
                        type={show ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </label>
                  </>
                )}
                {error && (
                  <p className="ws-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="ws-button" type="submit">
                  {account
                    ? t("Preview profile update", "معاينة تحديث الملف")
                    : reset
                      ? t("Preview password reset", "معاينة إعادة التعيين")
                      : invite
                        ? t(
                            "Preview invitation acceptance",
                            "معاينة قبول الدعوة",
                          )
                        : t("Preview reset request", "معاينة طلب الاستعادة")}
                  <ArrowRight size={17} />
                </button>
                <p className="ws-form-note">
                  {t(
                    "Design preview. No credentials are sent or stored.",
                    "معاينة تصميم. لا تُرسل بيانات تسجيل الدخول أو تُحفظ.",
                  )}
                </p>
              </fieldset>
            </form>
          )}
        </section>
        {account && (
          <section className="ws-panel ws-account-reset-card">
            <span className="ws-identity-icon">
              <LockKeyhole size={27} />
            </span>
            <h2>{t("Reset your password", "استعادة كلمة المرور")}</h2>
            <p className="ws-account-reset-intro">
              {t(
                "Manage the password behind your Jizrak identity.",
                "إدارة كلمة مرور حسابك في جِذرك.",
              )}
            </p>
            <PasswordResetForm t={t} />
            <a className="ws-account-forgot" href="/auth/forgot-password">
              {t(
                "Forgot your password? Email me a recovery link.",
                "هل نسيت كلمة المرور؟ أرسل لي رابط استعادة عبر البريد.",
              )}
              <ArrowRight size={16} />
            </a>
          </section>
        )}
        <aside className="ws-creation-story">
          <ContextScene
            title={account ? name : t("Your Jizrak identity", "حسابك في جِذرك")}
            caption={t(
              "One account, across your Businesses",
              "حساب واحد لكل أنشطتك",
            )}
            t={t}
          />
          <h3>{t("Your work has a home.", "لعملك مساحة تجمعه.")}</h3>
          <p>
            {t(
              "Your identity connects you to the Businesses and Stores you can access. Each workspace keeps its own boundaries.",
              "حسابك يصلك بالأنشطة والمتاجر المتاحة لك، ولكل مساحة عمل حدودها وصلاحياتها.",
            )}
          </p>
        </aside>
      </div>
    </>
  );
}
