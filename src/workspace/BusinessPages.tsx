import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  Store,
  ArrowUpRight,
  Plus,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  Button,
  ContextScene,
  Empty,
  Heading,
  Notice,
  SearchBox,
  Status,
} from "./Workspace";
import { SelectMenu } from "../components/SelectMenu";
import type { SampleData, Translate, Business, Shop } from "./model";

export function BusinessPages({
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
  const [sort, setSort] = useState("asc");
  const [selectedId, setSelectedId] = useState("");
  const [opened, setOpened] = useState<Shop | null>(null);
  useEffect(() => {
    setSelectedId(new URLSearchParams(location.search).get("businessId") || "");
  }, []);
  const name = (item: Business | Shop) =>
    ar ? item.nameAr || item.name : item.name;
  const label = (state: string) =>
    t(
      state,
      (
        {
          Active: "نشط",
          Trial: "فترة تجربة",
          "Past due": "دفعة متأخرة",
          Ready: "جاهز",
          Paused: "متوقف مؤقتًا",
          Deactivated: "معطّل",
        } as Record<string, string>
      )[state] || state,
    );
  const detailId = path.startsWith("/businesses/")
    ? decodeURIComponent(path.split("/")[2])
    : "";
  const business = data.businesses.find(
    (b) => b.id === (detailId || selectedId),
  );
  if (path.endsWith("/new"))
    return (
      <Creation
        store={path.startsWith("/stores")}
        data={data}
        t={t}
        ar={ar}
        businessId={selectedId}
      />
    );
  if (detailId && !business)
    return (
      <Empty
        title={t("Business unavailable", "النشاط غير متاح")}
        text={t(
          "This preview has no Business with that ID. Choose one from your workspace.",
          "لا يوجد نشاط بهذا المعرّف في المعاينة. اختر نشاطًا من مساحة عملك.",
        )}
      >
        <Button href="/businesses">
          {t("Back to Businesses", "العودة إلى الأنشطة")}
        </Button>
      </Empty>
    );
  const stores = path.startsWith("/stores");
  const filteredBusinesses = data.businesses
    .filter(
      (b) =>
        (!selectedId || b.id === selectedId || !stores) &&
        (name(b).toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          (stores &&
            data.shops.some(
              (s) =>
                s.businessId === b.id &&
                name(s)
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase()),
            ))),
    )
    .sort(
      (a, b) =>
        name(a).localeCompare(name(b), ar ? "ar" : "en") *
        (sort === "asc" ? 1 : -1),
    );
  const shopRows = (items: Shop[]) =>
    items
      .filter(
        (s) =>
          !search ||
          name(s).toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          name(data.businesses.find((b) => b.id === s.businessId)!)
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
      )
      .map((s) => (
        <div className="ws-store-row" key={s.id}>
          <span className="ws-store-icon">
            <Store size={22} />
          </span>
          <div className="ws-row-name">
            <strong>{name(s)}</strong>
            <small>{s.handle}.jizrak.com</small>
          </div>
          <Status warning={s.state !== "Ready"}>{label(s.state)}</Status>
          <button
            className="ws-icon"
            aria-label={`${t("Preview", "معاينة")} ${name(s)}`}
            disabled={s.state !== "Ready"}
            onClick={() => setOpened(s)}
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      ));
  return (
    <>
      <Heading
        title={
          business && !stores
            ? name(business)
            : stores
              ? t("A place for every store.", "لكل متجر مساحته.")
              : t("Your next chapter starts here.", "خطوتك القادمة تبدأ هنا.")
        }
        description={
          business && !stores
            ? t(
                "The foundation behind your stores. Your plan, your capacity, your next move.",
                "كل ما يخص نشاطك: الخطة، وسعة المتاجر، والخطوة التالية.",
              )
            : stores
              ? t(
                  "Choose a store. Pick up exactly where your business needs you.",
                  "اختر المتجر الذي تريد العمل عليه.",
                )
              : t(
                  "One clear view of the businesses you’re building.",
                  "أنشطتك في مكان واحد، لتعرف من أين تبدأ.",
                )
        }
        action={
          <Button
            href={
              stores
                ? selectedId
                  ? `/stores/new?businessId=${encodeURIComponent(selectedId)}`
                  : "/businesses"
                : "/businesses/new"
            }
          >
            <Plus size={16} />
            {stores
              ? selectedId
                ? t("New Store", "متجر جديد")
                : t("Choose a Business", "اختر نشاطًا")
              : t("New Business", "نشاط جديد")}
          </Button>
        }
      />
      {business && !stores ? (
        <>
          <section className="ws-business-overview ws-panel">
            <div>
              <Status warning={business.state === "Past due"}>
                {label(business.state)}
              </Status>
              <h2>{t("Room for your ambition.", "مساحة لطموحك.")}</h2>
              <p>
                {t(
                  "Each store has its own identity. Your Business keeps the foundations together.",
                  "لكل متجر هويته، ونشاطك يجمعها تحت إدارة واحدة.",
                )}
              </p>
              <div className="ws-plan-facts">
                <div>
                  <small>{t("Your plan", "خطتك")}</small>
                  <strong>{business.plan}</strong>
                </div>
                <div>
                  <small>{t("Store capacity", "سعة المتاجر")}</small>
                  <strong>
                    {
                      data.shops.filter((s) => s.businessId === business.id)
                        .length
                    }{" "}
                    <span>/ {business.limit}</span>
                  </strong>
                </div>
                <div>
                  <small>{t("Billing", "الفوترة")}</small>
                  <strong>{t("Sample provider", "مزود تجريبي")}</strong>
                </div>
              </div>
              <div
                className="ws-capacity"
                role="img"
                aria-label={t("Store capacity", "سعة المتاجر")}
              >
                {Array.from({ length: business.limit }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i <
                      data.shops.filter((s) => s.businessId === business.id)
                        .length
                        ? "filled"
                        : ""
                    }
                  />
                ))}
              </div>
            </div>
            <ContextScene
              title={name(business)}
              caption={t("Your Business workspace", "مساحة نشاطك")}
              t={t}
            />
          </section>
          {business.state === "Past due" && (
            <Notice>
              {t(
                "This sample subscription has an overdue payment. Store creation is paused until billing is resolved.",
                "لهذا الاشتراك التجريبي دفعة متأخرة. إنشاء المتاجر متوقف حتى تسويتها.",
              )}
            </Notice>
          )}
          <section className="ws-panel">
            <div className="ws-section-heading">
              <h2>{t("Your stores", "متاجرك")}</h2>
              <span>
                {data.shops.filter((s) => s.businessId === business.id).length}{" "}
                {t("connected", "متصلة")}
              </span>
            </div>
            <SearchBox
              value={search}
              onChange={setSearch}
              label={t("Find a store", "ابحث عن متجر")}
            />
            {shopRows(data.shops.filter((s) => s.businessId === business.id))
              .length ? (
              shopRows(data.shops.filter((s) => s.businessId === business.id))
            ) : (
              <Empty
                title={t("No stores to show", "لا توجد متاجر لعرضها")}
                text={t(
                  "Try another search, or create your first Store.",
                  "جرّب بحثًا آخر أو أنشئ متجرك الأول.",
                )}
              />
            )}
            <div className="ws-panel-bottom">
              <p>
                {t(
                  "Choose a Store to continue into its own workspace.",
                  "اختر متجرًا للانتقال إلى مساحة عمله.",
                )}
              </p>
              <Button href={`/stores?businessId=${business.id}`}>
                {t("Choose a Store", "اختر متجرًا")}
              </Button>
            </div>
          </section>
        </>
      ) : (
        <>
          {!stores && (
            <section className="ws-welcome ws-panel">
              <div>
                <span className="ws-overline">
                  {t("BUILT TO GROW WITH YOU", "مع كل خطوة توسع")}
                </span>
                <h2>
                  {t(
                    "Many possibilities.\nOne solid foundation.",
                    "فرص كثيرة.\nوأساس واحد ثابت.",
                  )}
                </h2>
                <p>
                  {t(
                    "Bring your stores together, without losing what makes each one yours.",
                    "اجمع متاجرك، واحتفظ بالهوية التي تميز كلًا منها.",
                  )}
                </p>
                <a href="/businesses/new">
                  {t("Build your next Business", "أنشئ نشاطك القادم")}
                  <ArrowRight size={17} />
                </a>
              </div>
              <ContextScene
                title={t("Your Business", "نشاطك")}
                caption={t(
                  "Identity · Stores · Growth",
                  "الهوية · المتاجر · التوسع",
                )}
                t={t}
              />
            </section>
          )}
          <section>
            <div className="ws-toolbar">
              <SearchBox
                value={search}
                onChange={setSearch}
                label={
                  stores
                    ? t("Search stores or businesses", "ابحث عن متجر أو نشاط")
                    : t("Find a Business", "ابحث عن نشاط")
                }
              />
              <div className="ws-sort">
                <span>{t("Sort", "الترتيب")}</span>
                <SelectMenu
                  ariaLabel={t("Sort", "الترتيب")}
                  value={sort}
                  onValueChange={setSort}
                  options={[
                    { value: "asc", label: t("Name: A to Z", "الاسم: تصاعديًا") },
                    { value: "desc", label: t("Name: Z to A", "الاسم: تنازليًا") },
                  ]}
                />
              </div>
              {stores && selectedId && (
                <button
                  className="ws-text-button"
                  onClick={() => setSelectedId("")}
                >
                  {t("Show all Businesses", "عرض كل الأنشطة")}
                </button>
              )}
            </div>
            <div className="ws-section-heading">
              <h2>
                {stores
                  ? t("Store directory", "دليل المتاجر")
                  : t("Your Businesses", "أنشطتك")}
              </h2>
              <span>
                {filteredBusinesses.length} {t("Businesses", "أنشطة")}
              </span>
            </div>
            {filteredBusinesses.length === 0 ? (
              <Empty
                title={t("Nothing here yet.", "لا توجد نتائج بعد.")}
                text={t(
                  "Try a different name, clear your search, or create a Business.",
                  "جرّب اسمًا آخر أو امسح البحث أو أنشئ نشاطًا.",
                )}
              >
                <Button secondary onClick={() => setSearch("")}>
                  {t("Clear search", "مسح البحث")}
                </Button>
              </Empty>
            ) : stores ? (
              filteredBusinesses.map((b) => (
                <section className="ws-panel ws-store-group" key={b.id}>
                  <div className="ws-section-heading">
                    <h3>{name(b)}</h3>
                    <a href={`/businesses/${b.id}`}>
                      {t("Business details", "تفاصيل النشاط")}{" "}
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                  {shopRows(data.shops.filter((s) => s.businessId === b.id))}
                  <a
                    className="ws-add-store"
                    href={`/stores/new?businessId=${b.id}`}
                  >
                    <Plus size={17} />
                    {t("Add a Store to", "أضف متجرًا إلى")} {name(b)}
                  </a>
                </section>
              ))
            ) : (
              <div className="ws-card-grid">
                {filteredBusinesses.map((b, i) => (
                  <a
                    className="ws-card"
                    href={`/businesses/${b.id}`}
                    key={b.id}
                    style={{ animationDelay: `${i * 65}ms` }}
                  >
                    <div className={`ws-monogram variant-${i % 3}`}>
                      <span>{name(b).slice(0, 1)}</span>
                      <Building2 size={20} />
                    </div>
                    <div className="ws-card-title">
                      <h3>{name(b)}</h3>
                      <ArrowUpRight size={20} />
                    </div>
                    <p>
                      {b.plan} · {t("Business workspace", "مساحة النشاط")}
                    </p>
                    <div className="ws-card-meta">
                      <Status warning={b.state === "Past due"}>
                        {label(b.state)}
                      </Status>
                      <span>
                        {data.shops.filter((s) => s.businessId === b.id).length}{" "}
                        {t("Stores", "متاجر")}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
          <section className="ws-demo-invitation">
            <CompassMark />
            <div>
              <h3>
                {t("Try a different kind of workday.", "جرّب يوم عمل مختلفًا.")}
              </h3>
              <p>
                {t(
                  "Explore a sample store, from the first order to the stockroom.",
                  "استكشف متجرًا تجريبيًا، من أول طلب إلى المخزون.",
                )}
              </p>
            </div>
            <Button secondary href="/demo">
              {t("Explore demo", "استكشف التجربة")}
            </Button>
          </section>
        </>
      )}
      {opened && (
        <Notice>
          <strong>
            {name(opened)} ·{" "}
            {t("Store preview selected", "تم اختيار معاينة المتجر")}
          </strong>
          <p>
            {t(
              "Store admin is outside this UI preview. No live Store access has been opened.",
              "إدارة المتجر خارج نطاق هذه المعاينة. لم يتم فتح متجر فعلي.",
            )}
          </p>
          <button className="ws-text-button" onClick={() => setOpened(null)}>
            {t("Dismiss", "إغلاق")}
          </button>
        </Notice>
      )}
    </>
  );
}
function CompassMark() {
  return (
    <span className="ws-demo-mark">
      <Store size={27} />
    </span>
  );
}
function Creation({
  store,
  data,
  t,
  ar,
  businessId,
}: {
  store: boolean;
  data: SampleData;
  t: Translate;
  ar: boolean;
  businessId: string;
}) {
  const [values, setValues] = useState({ name: "", nameAr: "", handle: "" });
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const business = data.businesses.find((b) => b.id === businessId);
  const remaining = business
    ? business.limit -
      data.shops.filter((s) => s.businessId === business.id).length
    : 0;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (values.name.trim().length < 2) {
      setError(
        t(
          "Use at least two characters for the name.",
          "استخدم حرفين على الأقل للاسم.",
        ),
      );
      return;
    }
    if (
      store &&
      (!/^[a-z0-9](?:[a-z0-9-]{1,61})[a-z0-9]$/.test(values.handle) ||
        [
          "admin",
          "www",
          "api",
          "jizrak",
          "platform",
          "auth",
          "support",
        ].includes(values.handle))
    ) {
      setError(
        t(
          "Choose a handle with 3–63 lowercase letters, numbers or hyphens. Reserved names cannot be used.",
          "اختر معرّفًا من 3 إلى 63 حرفًا لاتينيًا صغيرًا أو رقمًا أو شرطة. الأسماء المحجوزة غير متاحة.",
        ),
      );
      return;
    }
    if (store && data.shops.some((s) => s.handle === values.handle)) {
      setError(
        t(
          "That handle is already used in this preview. Choose another.",
          "هذا المعرّف مستخدم في المعاينة. اختر غيره.",
        ),
      );
      return;
    }
    if (store && (!business || remaining <= 0 || business.state === "Past due"))
      return;
    const id = `preview-${crypto.randomUUID().slice(0, 8)}`;
    if (store)
      data.save(data.businesses, [
        ...data.shops,
        {
          id,
          businessId,
          name: values.name.trim(),
          nameAr: values.nameAr.trim(),
          handle: values.handle,
          state: "Ready",
        },
      ]);
    else
      data.save(
        [
          ...data.businesses,
          {
            id,
            name: values.name.trim(),
            nameAr: "",
            state: "Trial",
            plan: "Starter",
            limit: 2,
          },
        ],
        data.shops,
      );
    setError("");
    setCreated(id);
  }
  if (store && !business)
    return (
      <>
        <Heading
          title={t("Every Store needs a home.", "كل متجر يحتاج إلى نشاط.")}
          description={t(
            "Choose the Business that will own your new Store.",
            "اختر النشاط الذي سيتبعه متجرك الجديد.",
          )}
        />
        <div className="ws-card-grid">
          {data.businesses.map((b) => (
            <a
              className="ws-card"
              key={b.id}
              href={`/stores/new?businessId=${b.id}`}
            >
              <Building2 />
              <h3>{ar ? b.nameAr || b.name : b.name}</h3>
              <p>{b.plan}</p>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </>
    );
  return (
    <>
      <a
        className="ws-back"
        href={store ? `/businesses/${businessId}` : "/businesses"}
      >
        {t("Back to your workspace", "العودة إلى مساحة العمل")}
      </a>
      <Heading
        title={
          store
            ? t("Give your Store an identity.", "امنح متجرك هويته.")
            : t("Make room for your next idea.", "ابدأ نشاطك القادم.")
        }
        description={
          store
            ? t(
                "A name your customers remember. A space your team can call its own.",
                "اسم يتذكره عملاؤك، ومساحة يعمل فيها فريقك.",
              )
            : t(
                "Start with a Business. Add your stores when you’re ready.",
                "ابدأ بالنشاط، وأضف متاجرك عندما تكون جاهزًا.",
              )
        }
      />
      <div className="ws-form-layout">
        <section className="ws-panel">
          <div className="ws-section-heading">
            <h2>
              {store
                ? t("Store details", "تفاصيل المتجر")
                : t("Business details", "تفاصيل النشاط")}
            </h2>
            <span>{t("01 / Foundation", "01 / البداية")}</span>
          </div>
          {store && business && (
            <Notice>
              {ar ? business.nameAr || business.name : business.name} ·{" "}
              {remaining} {t("Store spaces available", "أماكن متاحة للمتاجر")}
            </Notice>
          )}
          {created ? (
            <div className="ws-success">
              <span className="ws-check">
                <Check />
              </span>
              <h2>{t("Your preview is ready.", "معاينتك جاهزة.")}</h2>
              <p>
                {t(
                  "Saved in this browser session only. No live Business or Store was created.",
                  "حُفظت في جلسة المتصفح فقط. لم يُنشأ نشاط أو متجر فعلي.",
                )}
              </p>
              <Button
                href={
                  store
                    ? `/stores?businessId=${businessId}`
                    : `/businesses/${created}`
                }
              >
                {t("Continue to workspace", "انتقل إلى مساحة العمل")}
              </Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <fieldset
                disabled={
                  !ready ||
                  (store && (remaining <= 0 || business?.state === "Past due"))
                }
              >
                <label className="ws-field">
                  {store
                    ? t("Store name", "اسم المتجر")
                    : t("Business name", "اسم النشاط")}
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="organization"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    placeholder={store ? "Olive Home" : "Olive House"}
                  />
                </label>
                {store && (
                  <>
                    <label className="ws-field">
                      {t("Arabic name (optional)", "الاسم العربي (اختياري)")}
                      <input
                        dir="rtl"
                        maxLength={120}
                        value={values.nameAr}
                        onChange={(e) =>
                          setValues({ ...values, nameAr: e.target.value })
                        }
                      />
                    </label>
                    <label className="ws-field">
                      {t("Store handle", "معرّف المتجر")}
                      <div className="ws-handle">
                        <input
                          dir="ltr"
                          required
                          minLength={3}
                          maxLength={63}
                          value={values.handle}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              handle: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, ""),
                            })
                          }
                          placeholder="olive-home"
                        />
                        <span>.jizrak.com</span>
                      </div>
                      <small>
                        {t(
                          "Lowercase letters, numbers and hyphens. Availability is checked against sample stores.",
                          "حروف لاتينية صغيرة وأرقام وشرطات. يُفحص المعرّف ضمن المتاجر التجريبية.",
                        )}
                      </small>
                    </label>
                  </>
                )}
                {error && (
                  <p role="alert" className="ws-error">
                    {error}
                  </p>
                )}
                <button className="ws-button" type="submit">
                  {t("Create preview", "إنشاء معاينة")}
                  <ArrowRight size={17} />
                </button>
                <p className="ws-form-note">
                  {t(
                    "UI preview only. No account or subscription is created.",
                    "معاينة للواجهة فقط. لن يُنشأ حساب أو اشتراك.",
                  )}
                </p>
              </fieldset>
              {store && (remaining <= 0 || business?.state === "Past due") && (
                <Notice>
                  {t(
                    "Store creation is unavailable for this sample plan. Choose another Business.",
                    "إنشاء المتاجر غير متاح لهذه الخطة التجريبية. اختر نشاطًا آخر.",
                  )}
                </Notice>
              )}
            </form>
          )}
        </section>
        <aside className="ws-creation-story">
          <ContextScene
            title={values.name || t("Your next idea", "فكرتك القادمة")}
            caption={
              store
                ? values.handle
                  ? `${values.handle}.jizrak.com`
                  : t("Your Store identity", "هوية متجرك")
                : t("Your Business foundation", "أساس نشاطك")
            }
            t={t}
          />
          <h3>{t("A considered start.", "بداية واضحة.")}</h3>
          <p>
            {store
              ? t(
                  "Your Store gets its own name and address, while your Business holds the subscription and shared capacity.",
                  "لمتجرك اسم وعنوان مستقلان، ويتبع اشتراك النشاط وسعته.",
                )
              : t(
                  "Your Business brings ownership, subscription and stores together. Each Store keeps its own identity.",
                  "يجمع نشاطك الملكية والاشتراك والمتاجر، ويحتفظ كل متجر بهويته.",
                )}
          </p>
        </aside>
      </div>
    </>
  );
}
