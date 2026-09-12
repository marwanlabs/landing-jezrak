import { useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  Clock3,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { Button, Empty, Heading, Notice, SearchBox, Status } from "./Workspace";
import { SelectMenu } from "../components/SelectMenu";
import type { SampleData, Translate } from "./model";

export function Governance({
  path,
  data,
  t,
  ar,
}: {
  path: string;
  data: SampleData;
  t: Translate;
  ar: boolean;
}) {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("Attached");
  const [reason, setReason] = useState("");
  const [result, setResult] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (path === "/platform/lifecycle" || path === "/platform/support")
    return (
      <ControlDesk
        support={path.endsWith("support")}
        data={data}
        t={t}
        ar={ar}
      />
    );
  const id = path.startsWith("/platform/business/")
    ? decodeURIComponent(path.split("/")[3])
    : "";
  const business = data.businesses.find((b) => b.id === id);
  const bname = (b: (typeof data.businesses)[number]) =>
    ar ? b.nameAr || b.name : b.name;
  if (id && !business)
    return (
      <Empty
        title={t("Business unavailable", "النشاط غير متاح")}
        text={t(
          "Choose a sample Business from the platform overview.",
          "اختر نشاطًا تجريبيًا من صفحة المنصة.",
        )}
      >
        <Button href="/platform">
          {t("Platform overview", "نظرة عامة على المنصة")}
        </Button>
      </Empty>
    );
  return (
    <>
      <Heading
        title={
          business
            ? bname(business)
            : t("A clear view. A steady platform.", "رؤية واضحة لمنصتك.")
        }
        description={
          business
            ? t(
                "Business identity, Store health and domain records in one place.",
                "هوية النشاط وحالة المتاجر وسجلات النطاقات في مكان واحد.",
              )
            : t(
                "See what needs attention, understand the context, take a considered next step.",
                "تابع ما يحتاج إلى اهتمام، وراجع التفاصيل قبل اتخاذ أي إجراء.",
              )
        }
        action={<Status>{t("Sample environment", "بيئة تجريبية")}</Status>}
      />
      <div className="ws-stat-grid">
        {(business
          ? [
              [t("Subscription", "الاشتراك"), business.state],
              [
                t("Stores", "المتاجر"),
                String(data.shops.filter((s) => s.businessId === id).length),
              ],
              [t("Owners", "المالكون"), "1"],
              [t("Audit references", "مراجع التدقيق"), "3"],
            ]
          : [
              [t("Businesses", "الأنشطة"), String(data.businesses.length)],
              [t("Stores", "المتاجر"), String(data.shops.length)],
              [
                t("Ready Stores", "متاجر جاهزة"),
                String(data.shops.filter((s) => s.state === "Ready").length),
              ],
              [
                t("Needs attention", "تحتاج إلى متابعة"),
                String(
                  data.businesses.filter((b) => b.state === "Past due").length,
                ),
              ],
            ]
        ).map(([label, value], i) => (
          <div className="ws-stat ws-panel" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>
              {i === 3
                ? t("Review the context below", "راجع التفاصيل أدناه")
                : t("Sample projection", "بيانات تجريبية")}
            </small>
          </div>
        ))}
      </div>
      {business ? (
        <>
          <Notice>
            <strong>
              {t("Business reference", "مرجع النشاط")}: {business.id}
            </strong>
            <p>
              {t(
                "Owner count: 1. Sample subscription and audit data only.",
                "عدد المالكين: 1. بيانات الاشتراك والتدقيق تجريبية.",
              )}
            </p>
          </Notice>
          <section className="ws-panel">
            <div className="ws-section-heading">
              <h2>
                {t("Stores & operational state", "المتاجر وحالة التشغيل")}
              </h2>
              <Button secondary href="/platform/lifecycle">
                {t("Lifecycle controls", "إدارة دورة التشغيل")}
              </Button>
            </div>
            {data.shops
              .filter((s) => s.businessId === id)
              .map((s) => (
                <div className="ws-record-row" key={s.id}>
                  <div>
                    <strong>{ar ? s.nameAr || s.name : s.name}</strong>
                    <small>{s.id}</small>
                  </div>
                  <Status warning={s.state !== "Ready"}>{s.state}</Status>
                </div>
              ))}
          </section>
          <section className="ws-panel">
            <div className="ws-section-heading">
              <div>
                <h2>{t("Registered domains", "النطاقات المسجلة")}</h2>
                <p>
                  {t(
                    "A sample domain record, with its verification and certificate context.",
                    "سجل نطاق تجريبي مع حالة التحقق والشهادة.",
                  )}
                </p>
              </div>
              <Globe2 size={26} />
            </div>
            <div className="ws-domain">
              <div>
                <strong>{id}.example.com</strong>
                <small>
                  {t(
                    "Canonical domain · Sample record",
                    "النطاق الأساسي · سجل تجريبي",
                  )}
                </small>
              </div>
              <Status warning={domain !== "Attached"}>{domain}</Status>
              <span>
                {t("Verified", "تم التحقق")}
                <Check size={14} />
              </span>
              <span>
                TLS <Check size={14} />
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reason.trim()) return;
                setDomain("Detached");
                setResult(
                  t(
                    "Domain detached in this preview only. No registry or DNS record was changed.",
                    "فُصل النطاق في المعاينة فقط. لم يتغير سجل النطاق أو إعداد DNS.",
                  ),
                );
              }}
            >
              <fieldset disabled={!ready || domain === "Detached"}>
                <label className="ws-field">
                  {t("Reason for detaching", "سبب فصل النطاق")}
                  <input
                    required
                    minLength={5}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t(
                      "Explain the intended change",
                      "وضّح سبب التغيير",
                    )}
                  />
                </label>
                <button className="ws-button secondary" type="submit">
                  {t("Preview domain detach", "معاينة فصل النطاق")}
                </button>
              </fieldset>
            </form>
            {result && <Notice>{result}</Notice>}
          </section>
          <section className="ws-panel">
            <h2>{t("Recent audit references", "مراجع التدقيق الأخيرة")}</h2>
            {["Business created", "Store registered", "Domain attached"].map(
              (item, i) => (
                <div className="ws-record-row" key={item}>
                  <div>
                    <strong>
                      {t(
                        item,
                        ["إنشاء النشاط", "تسجيل المتجر", "ربط النطاق"][i],
                      )}
                    </strong>
                    <small>
                      ref_sample_00{i + 1} ·{" "}
                      {t("Sample timestamp", "توقيت تجريبي")}: 09:4{i}
                    </small>
                  </div>
                  <Status>{t("Recorded", "مسجل")}</Status>
                </div>
              ),
            )}
          </section>
        </>
      ) : (
        <>
          <div className="ws-governance-columns">
            <section className="ws-health ws-panel">
              <div className="ws-section-heading">
                <h2>{t("Platform pulse", "حالة المنصة")}</h2>
                <Activity size={23} />
              </div>
              <p>
                {t(
                  "The services behind each Store, at a glance.",
                  "حالة الخدمات التي تعتمد عليها المتاجر.",
                )}
              </p>
              {[
                t("Store readiness", "جاهزية المتاجر"),
                t("Domain registry", "سجل النطاقات"),
                t("Worker partitions", "مهام الخلفية"),
              ].map((s, i) => (
                <div className="ws-health-row" key={s}>
                  <span>{s}</span>
                  <span className="ws-pulse-bars" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, n) => (
                      <i
                        key={n}
                        style={{
                          transform: `scaleY(${0.3 + ((n * 7 + i) % 9) / 12})`,
                        }}
                      />
                    ))}
                  </span>
                  <Status>{t("Healthy", "سليم")}</Status>
                </div>
              ))}
            </section>
            <aside className="ws-attention ws-panel">
              <span className="ws-overline">
                {t("ATTENTION, WITH CONTEXT", "متابعة مبنية على التفاصيل")}
              </span>
              <h2>
                {t("One billing issue to review.", "دفعة تحتاج إلى مراجعة.")}
              </h2>
              <p>
                Terra Collective ·{" "}
                {t(
                  "Past-due subscription. Review the Business before changing its state.",
                  "دفعة اشتراك متأخرة. راجع النشاط قبل تغيير حالته.",
                )}
              </p>
              <Button secondary href="/platform/business/terra">
                {t("Review Business", "مراجعة النشاط")}
              </Button>
            </aside>
          </div>
          <section className="ws-panel">
            <div className="ws-section-heading">
              <h2>{t("Business registry", "سجل الأنشطة")}</h2>
              <span>{t("Sample records", "سجلات تجريبية")}</span>
            </div>
            <SearchBox
              value={search}
              onChange={setSearch}
              label={t(
                "Search name or subscription state",
                "ابحث بالاسم أو حالة الاشتراك",
              )}
            />
            <div className="ws-table-wrap">
              <table>
                <thead>
                  <tr>
                    {[
                      t("Business", "النشاط"),
                      t("Subscription", "الاشتراك"),
                      t("Stores", "المتاجر"),
                      t("Owners", "المالكون"),
                      t("Audit", "التدقيق"),
                      t("Details", "التفاصيل"),
                    ].map((v) => (
                      <th key={v}>{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.businesses
                    .filter((b) =>
                      `${bname(b)} ${b.state}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((b) => (
                      <tr key={b.id}>
                        <td>
                          <strong>{bname(b)}</strong>
                          <small>{b.id}</small>
                        </td>
                        <td>
                          <Status warning={b.state === "Past due"}>
                            {b.state}
                          </Status>
                        </td>
                        <td>
                          {
                            data.shops.filter((s) => s.businessId === b.id)
                              .length
                          }
                        </td>
                        <td>1</td>
                        <td>3</td>
                        <td>
                          <a
                            className="ws-icon"
                            href={`/platform/business/${b.id}`}
                            aria-label={`${t("Inspect", "عرض")} ${bname(b)}`}
                          >
                            <ArrowUpRight size={19} />
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {!data.businesses.some((b) =>
              `${bname(b)} ${b.state}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            ) && (
              <Empty
                title={t("No matching Businesses", "لا توجد أنشطة مطابقة")}
                text={t(
                  "Try another name or subscription state.",
                  "جرّب اسمًا أو حالة اشتراك أخرى.",
                )}
              />
            )}
          </section>
          <div className="ws-governance-links">
            <Button secondary href="/platform/lifecycle">
              {t("Manage lifecycle", "إدارة دورة التشغيل")}
            </Button>
            <Button secondary href="/platform/support">
              {t("Scoped support access", "صلاحيات دعم محددة")}
            </Button>
          </div>
        </>
      )}
    </>
  );
}

function ControlDesk({
  support,
  data,
  t,
  ar,
}: {
  support: boolean;
  data: SampleData;
  t: Translate;
  ar: boolean;
}) {
  const [businessId, setBusinessId] = useState(data.businesses[0]?.id || "");
  const [storeId, setStoreId] = useState("");
  const [mode, setMode] = useState("subscription");
  const [reason, setReason] = useState("");
  const [ticket, setTicket] = useState("");
  const [duration, setDuration] = useState("60");
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState("");
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [approved, setApproved] = useState(false);
  const [operation, setOperation] = useState("");
  const [storeScopeError, setStoreScopeError] = useState(false);
  useEffect(() => setReady(true), []);
  const business = data.businesses.find((b) => b.id === businessId);
  const shops = data.shops.filter((s) => s.businessId === businessId);
  const shop = shops.find((s) => s.id === storeId);
  const operations =
    mode === "subscription"
      ? business?.state === "Active"
        ? ["Pause subscription", "Cancel subscription"]
        : ["Activate subscription"]
      : mode === "restore"
        ? [approved ? "Restore sample archive" : "Request restore approval"]
        : mode === "publication"
          ? ["Publish", "Schedule publication", "Unpublish"]
          : shop?.state === "Ready"
            ? ["Pause Store", "Deactivate Store"]
            : ["Resume Store", "Deactivate Store"];
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!support && mode !== "subscription" && !storeId) {
      setStoreScopeError(true);
      return;
    }
    if (!reason.trim() || !verified || (support && !ticket.trim())) return;
    if (support) {
      setActive(true);
      setResult(
        t(
          "Support scope preview created. No elevated access was granted.",
          "أُنشئت معاينة نطاق الدعم. لم تُمنح أي صلاحيات فعلية.",
        ),
      );
    } else if (mode === "restore" && !approved) {
      setApproved(true);
      setResult(
        t(
          "Sample restore approval recorded: preview-approval-01. Review before simulating restoration.",
          "سُجلت موافقة تجريبية: preview-approval-01. راجعها قبل محاكاة الاستعادة.",
        ),
      );
    } else {
      setResult(
        `${operation || operations[0]}: ${t("simulated and recorded locally. No platform state was changed.", "تمت المحاكاة محليًا. لم تتغير حالة المنصة.")}`,
      );
    }
  }
  return (
    <>
      <Heading
        title={
          support
            ? t("Support, with clear boundaries.", "دعم بصلاحيات واضحة.")
            : t("Every change, considered.", "لكل تغيير مراجعته.")
        }
        description={
          support
            ? t(
                "The right scope. A recorded reason. Access that ends when the work does.",
                "نطاق محدد، وسبب مسجل، وصلاحية تنتهي بانتهاء العمل.",
              )
            : t(
                "Review the current state, choose the next one, keep the decision traceable.",
                "راجع الحالة الحالية، واختر التالية، وسجّل سبب القرار.",
              )
        }
      />
      <div className="ws-form-layout">
        <section className="ws-panel">
          <div className="ws-section-heading">
            <h2>
              {support
                ? t("Create a support scope", "إنشاء نطاق دعم")
                : t("Change workspace state", "تغيير حالة مساحة العمل")}
            </h2>
            <ShieldCheck size={23} />
          </div>
          <form onSubmit={submit}>
            <fieldset disabled={!ready || active}>
              <div className="ws-field">
                {t("Business", "النشاط")}
                <SelectMenu
                  ariaLabel={t("Business", "النشاط")}
                  disabled={!ready || active}
                  value={businessId}
                  onValueChange={(value) => {
                    setBusinessId(value);
                    setStoreId("");
                    setOperation("");
                    setResult("");
                    setApproved(false);
                  }}
                  options={data.businesses.map((b) => ({ value: b.id, label: ar ? b.nameAr || b.name : b.name }))}
                />
              </div>
              {!support && (
                <div className="ws-field">
                  {t("Operation type", "نوع العملية")}
                  <SelectMenu
                    ariaLabel={t("Operation type", "نوع العملية")}
                    disabled={!ready || active}
                    value={mode}
                    onValueChange={(value) => {
                      setMode(value);
                      setOperation("");
                      setApproved(false);
                      setResult("");
                    }}
                    options={[
                      { value: "subscription", label: t("Business subscription", "اشتراك النشاط") },
                      { value: "store", label: t("Store operations", "تشغيل المتجر") },
                      { value: "publication", label: t("Store publication", "نشر المتجر") },
                      { value: "restore", label: t("Archived Store restoration", "استعادة متجر مؤرشف") },
                    ]}
                  />
                </div>
              )}
              {(support || mode !== "subscription") && (
                <div className="ws-field">
                  {t("Store scope", "نطاق المتجر")}
                  <SelectMenu
                    ariaLabel={t("Store scope", "نطاق المتجر")}
                    disabled={!ready || active}
                    invalid={storeScopeError}
                    value={storeId}
                    onValueChange={(value) => {
                      setStoreId(value);
                      setStoreScopeError(false);
                      setOperation("");
                    }}
                    options={[
                      { value: "", label: support ? t("Business only", "النشاط فقط") : t("Select a Store", "اختر متجرًا") },
                      ...(mode === "restore" && !support
                        ? [{ value: "archived-sample", label: t("Sample archived Store", "متجر مؤرشف تجريبي") }]
                        : shops.map((s) => ({ value: s.id, label: ar ? s.nameAr || s.name : s.name }))),
                    ]}
                  />
                </div>
              )}
              {support ? (
                <>
                  <label className="ws-field">
                    {t("Support ticket", "تذكرة الدعم")}
                    <input
                      required
                      maxLength={100}
                      placeholder="SUP-1042"
                      value={ticket}
                      onChange={(e) => setTicket(e.target.value)}
                    />
                  </label>
                  <div className="ws-field">
                    {t("Access duration", "مدة الصلاحية")}
                    <SelectMenu
                      ariaLabel={t("Access duration", "مدة الصلاحية")}
                      disabled={!ready || active}
                      value={duration}
                      onValueChange={setDuration}
                      options={[60, 120, 180, 240].map((n) => ({ value: String(n), label: `${n} ${t("minutes", "دقيقة")}` }))}
                    />
                  </div>
                  <Notice>
                    {t(
                      "Read-only scope. No write operations are enabled in this preview.",
                      "صلاحية للقراءة فقط. عمليات الكتابة غير مفعّلة في المعاينة.",
                    )}
                  </Notice>
                </>
              ) : (
                <div className="ws-field">
                  {t("Next action", "الإجراء التالي")}
                  <SelectMenu
                    ariaLabel={t("Next action", "الإجراء التالي")}
                    disabled={!ready || active}
                    value={operation || operations[0]}
                    onValueChange={setOperation}
                    options={operations.map((o) => ({ value: o, label: o }))}
                  />
                </div>
              )}
              <label className="ws-field">
                {t("Reason", "السبب")}
                <textarea
                  required
                  minLength={5}
                  maxLength={500}
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t(
                    "Describe why this access or change is needed",
                    "وضّح الحاجة إلى هذه الصلاحية أو هذا التغيير",
                  )}
                />
              </label>
              <label className="ws-checkbox">
                <input
                  type="checkbox"
                  required
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                <span>
                  {t(
                    "Simulate recent identity verification for this preview.",
                    "محاكاة تحقق حديث من الهوية لهذه المعاينة.",
                  )}
                </span>
              </label>
              <button type="submit" className="ws-button">
                {support
                  ? t("Preview support session", "معاينة جلسة الدعم")
                  : t("Preview operation", "معاينة العملية")}
                <ArrowUpRight size={17} />
              </button>
            </fieldset>
          </form>
          {result && <Notice>{result}</Notice>}
          {active && (
            <div className="ws-session">
              <Status>{t("Active preview", "معاينة نشطة")}</Status>
              <h3>{ticket}</h3>
              <p>{reason}</p>
              <p>
                {business?.name} ·{" "}
                {shop?.name || t("Business scope", "نطاق النشاط")} · {duration}{" "}
                {t("minutes", "دقيقة")}
              </p>
              <Button
                secondary
                onClick={() => {
                  setActive(false);
                  setVerified(false);
                  setTicket("");
                  setReason("");
                  setResult(
                    t(
                      "Session preview revoked. The local support context has been cleared.",
                      "أُلغيت معاينة الجلسة ومُسح سياق الدعم المحلي.",
                    ),
                  );
                }}
              >
                {t("Revoke preview session", "إلغاء معاينة الجلسة")}
              </Button>
            </div>
          )}
        </section>
        <aside className="ws-scope-story">
          <div className="ws-scope-seal">
            <ShieldCheck size={68} strokeWidth={1} />
            <span>
              <Check size={18} />
            </span>
          </div>
          <h2>
            {support
              ? t(
                  "Only what’s needed.\nOnly for a while.",
                  "بقدر الحاجة.\nولوقت محدد.",
                )
              : t("Context before action.", "التفاصيل قبل الإجراء.")}
          </h2>
          <p>
            {t(
              "Privileged operations need real server authorization. Here, you can explore the decisions and their feedback with sample data.",
              "العمليات الحساسة تتطلب تحققًا فعليًا من الخادم. هنا يمكنك تجربة القرارات ونتائجها ببيانات تجريبية.",
            )}
          </p>
          <div className="ws-scope-item">
            <ShieldCheck size={20} />
            <div>
              <strong>{t("Explicit scope", "نطاق واضح")}</strong>
              <p>
                {business?.name}
                {shop ? ` / ${shop.name}` : ""}
              </p>
            </div>
          </div>
          <div className="ws-scope-item">
            <Clock3 size={20} />
            <div>
              <strong>
                {support
                  ? t("Time-bounded", "محدد المدة")
                  : t("Recorded decision", "قرار مسجل")}
              </strong>
              <p>
                {support
                  ? `${duration} ${t("minutes", "دقيقة")}`
                  : t(
                      "Reason and review travel with the change.",
                      "السبب والمراجعة مرتبطان بالتغيير.",
                    )}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
