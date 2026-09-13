import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Leaf,
  Sprout,
  TreeDeciduous,
} from "lucide-react";
import {
  usePricingConfig,
  formatMoney,
  planCatalog,
  type PricingConfig,
  type PlanPricing,
} from "./model";
import { config } from "../app/config";
import { usePreferences } from "../app/preferences";
import "./pricing.css";

const planCopy = {
  seed: {
    tagline: ["Start selling.", "ابدأ البيع."],
    summary: [
      "A simple foundation for your first Store.",
      "أساس بسيط لمتجرك الأول.",
    ],
  },
  grow: {
    tagline: ["Run your business.", "أدر نشاطك."],
    summary: [
      "Advanced business tools included.",
      "أدوات الأعمال المتقدمة مشمولة.",
    ],
  },
  canopy: {
    tagline: ["Run your organization.", "أدر مؤسستك."],
    summary: [
      "More Stores, more room to lead.",
      "متاجر أكثر ومساحة أكبر للقيادة.",
    ],
  },
} as const;
const addOnCopy = {
  pos: ["POS", "نقطة البيع"],
  purchasing: ["Purchasing", "المشتريات"],
  advanced_inventory: ["Advanced Inventory", "المخزون المتقدم"],
  finance: ["Finance", "المالية"],
  growth_tools: ["Growth Tools", "أدوات النمو"],
  advanced_analytics: ["Advanced Analytics", "التحليلات المتقدمة"],
} as const;
const t = (ar: boolean, en: string, arabic: string) => (ar ? arabic : en);
const planHref = (plan: string) =>
  config.start.startsWith("/") && !config.start.startsWith("//")
    ? `${config.start}${config.start.includes("?") ? "&" : "?"}plan=${plan}`
    : config.start;
function PlanCard({ plan, ar }: { plan: PlanPricing; ar: boolean }) {
  const copy = planCopy[plan.code];
  const Icon =
    plan.code === "seed" ? Leaf : plan.code === "grow" ? Sprout : TreeDeciduous;
  const hasExtras =
    plan.extraStore.enabled ||
    plan.extraLocation.enabled ||
    plan.extraStaff.enabled;
  const extra = (
    label: string,
    price: PlanPricing["extraStore"],
    unavailable = false,
  ) =>
    unavailable ? null : (
      <li>
        <span>{label}</span>
        <strong>
          {formatMoney(price.monthlyPrice, ar ? "ar" : "en")}
          <small> / {t(ar, "month", "شهر")}</small>
        </strong>
      </li>
    );
  return (
    <article
      className={`pricing-card ${plan.code === "grow" ? "recommended" : ""}`}
    >
      <div className="pricing-card-top">
        <span className="pricing-plan-icon">
          <Icon size={27} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <p className="pricing-overline">{planCatalog[plan.code].name[ar ? "ar" : "en"]}</p>
        {plan.code === "grow" && (
          <span className="pricing-badge">
            {t(ar, "Recommended", "موصى بها")}
          </span>
        )}
      </div>
      <h3>{copy.tagline[ar ? 1 : 0]}</h3>
      <p>{copy.summary[ar ? 1 : 0]}</p>
      <div className="pricing-price">
        <strong>{formatMoney(plan.monthlyPrice, ar ? "ar" : "en")}</strong>
        <span>{t(ar, "/ month", "/ شهر")}</span>
      </div>
      <p className="pricing-fee">
        {plan.completedOrderFee > 0 ? (
          <>
            {formatMoney(plan.completedOrderFee, ar ? "ar" : "en")} /{" "}
            {t(ar, "completed order", "طلب مكتمل")}
          </>
        ) : (
          <>
            <Check size={14} aria-hidden="true" />
            {t(ar, "No per-order fee", "بدون رسوم على الطلبات")}
          </>
        )}
      </p>
      <a className="rd-button" href={planHref(plan.code)}>
        {t(ar, `Choose ${planCatalog[plan.code].name.en}`, `اختر خطة ${planCatalog[plan.code].name.ar}`)}
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
      <ul className="pricing-limits">
        {[
          [t(ar, "Stores", "المتاجر"), plan.includedStores],
          [t(ar, "Locations", "المواقع"), plan.includedLocations],
          [t(ar, "Staff", "الموظفون"), plan.includedStaff],
          [t(ar, "Managed domains", "النطاقات المُدارة"), plan.includedDomains],
        ].map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <strong>{Number(value).toLocaleString(ar ? "ar" : "en")}</strong>
          </li>
        ))}
      </ul>
      <details className="pricing-card-extras">
        <summary>
          {t(ar, "Available extras", "الإضافات المتاحة")}
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        {!hasExtras && (
          <p>
            {t(
              ar,
              `More capacity is available with ${planCatalog.grow.name.en} and ${planCatalog.canopy.name.en}.`,
              "سعة أكبر مع خطتَي النمو والمظلة.",
            )}
          </p>
        )}
        <ul className="pricing-extras">
          {extra(
            t(ar, "Store", "متجر"),
            plan.extraStore,
            !plan.extraStore.enabled,
          )}
          {extra(
            t(ar, "Location", "موقع"),
            plan.extraLocation,
            !plan.extraLocation.enabled,
          )}
          {extra(
            t(ar, "Staff", "موظف"),
            plan.extraStaff,
            !plan.extraStaff.enabled,
          )}
        </ul>
      </details>
    </article>
  );
}
function Calculations({
  pricing,
  ar,
}: {
  pricing: PricingConfig;
  ar: boolean;
}) {
  const seed = pricing.plans.find((p) => p.code === "seed")!;
  const grow = pricing.plans.find((p) => p.code === "grow")!;
  const [orders, setOrders] = useState(100);
  const [withTools, setWithTools] = useState(false);
  const selected = ["pos", "purchasing", "advanced_inventory", "finance"];
  const addOns = pricing.seedAddOns
    .filter((a) => selected.includes(a.code))
    .reduce((sum, a) => sum + a.monthlyPrice, 0);
  const seedTotal =
    seed.monthlyPrice +
    seed.completedOrderFee * orders +
    (withTools ? addOns : 0);
  const growTotal = grow.monthlyPrice + grow.completedOrderFee * orders;
  return (
    <div className="pricing-calculations">
      <div className="pricing-estimate-intro">
        <span className="pricing-estimate-icon">
          <Sprout size={26} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <h3>{t(ar, "Find your growing point.", "احسب تكلفة نموّك.")}</h3>
        <p>
          {t(
            ar,
            `See how your monthly orders shape the cost of ${planCatalog.seed.name.en} and ${planCatalog.grow.name.en}.`,
            "قارن تكلفة البذرة والنمو حسب عدد طلباتك الشهرية.",
          )}
        </p>
      </div>
      <div className="pricing-estimate-control">
        <label htmlFor="pricing-orders">
          {t(ar, "Completed orders / month", "الطلبات المكتملة شهريًا")}
          <output htmlFor="pricing-orders">
            {orders.toLocaleString(ar ? "ar" : "en")}
          </output>
        </label>
        <input
          id="pricing-orders"
          type="range"
          min="0"
          max="1000"
          step="10"
          value={orders}
          onChange={(e) => setOrders(Number(e.target.value))}
        />
        <div className="pricing-range-labels" aria-hidden="true">
          <span>0</span>
          <span>1,000</span>
        </div>
        <label className="pricing-tools">
          <input
            type="checkbox"
            checked={withTools}
            onChange={(e) => setWithTools(e.target.checked)}
          />
          <span className="pricing-tools-copy">
            <strong>{t(ar, "Seed essentials", "أساسيات البذرة")}</strong>
            <span>
              {t(
                ar,
                "POS, Purchasing, Advanced Inventory & Finance",
                "نقطة البيع والمشتريات والمخزون المتقدم والمالية",
              )}
            </span>
          </span>
          <span className="pricing-tools-toggle" aria-hidden="true">
            <Check size={14} strokeWidth={2.4} />
          </span>
        </label>
      </div>
      <div
        className="pricing-estimate-results"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <span>{planCatalog.seed.name[ar ? "ar" : "en"]}</span>
          <strong>{formatMoney(seedTotal, ar ? "ar" : "en")}</strong>
        </div>
        <div>
          <span>{planCatalog.grow.name[ar ? "ar" : "en"]}</span>
          <strong>{formatMoney(growTotal, ar ? "ar" : "en")}</strong>
        </div>
        <p>
          {t(
            ar,
            "Monthly estimate. Excludes taxes and capacity extras.",
            "تقدير شهري لا يشمل الضرائب وإضافات السعة.",
          )}
        </p>
      </div>
    </div>
  );
}
export function PricingSection() {
  const pricing = usePricingConfig();
  const { locale } = usePreferences();
  const ar = locale === "ar";
  return (
    <section
      className="pricing-section rd-wrap"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing-intro">
        <p className="rd-eyebrow">
          <span />
          {t(ar, "PROPOSED SAMPLE PRICING", "أسعار مقترحة وتجريبية")}
        </p>
        <h2 id="pricing-title">
          {t(ar, "Clear room to grow.", "مساحة واضحة للنمو.")}
          <br />
          <span>{t(ar, "Choose your foundation.", "اختر أساسك.")}</span>
        </h2>
        <p>
          {t(
            ar,
            "Sample pricing for a UI preview. Real billing, taxes and completed-order behavior are not implemented.",
            "أسعار تجريبية لمعاينة الواجهة. الفوترة والضرائب وسلوك الطلبات المكتملة غير مطبقة هنا.",
          )}
        </p>
      </div>
      <div className="pricing-grid">
        {pricing.plans.map((plan) => (
          <PlanCard key={plan.code} plan={plan} ar={ar} />
        ))}
      </div>
      <Calculations pricing={pricing} ar={ar} />
      <details className="pricing-addons">
        <summary>
          <span>{t(ar, "Build on Seed", "أضف إلى خطة البذرة")}</span>
          <span className="pricing-disclosure-note">
            {t(ar, "Explore add-ons", "تصفّح الإضافات")}
          </span>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>
        <div className="pricing-addon-grid">
          {pricing.seedAddOns.map((addon) => (
            <div key={addon.code}>
              <span>{addOnCopy[addon.code][ar ? 1 : 0]}</span>
              <strong>
                {formatMoney(addon.monthlyPrice, ar ? "ar" : "en")} /{" "}
                {t(ar, "month", "شهر")}
              </strong>
            </div>
          ))}
        </div>
      </details>
      <details className="pricing-comparison">
        <summary>
          <span>{t(ar, "A closer look at each plan", "تفاصيل كل خطة")}</span>
          <span className="pricing-disclosure-note">
            {t(ar, "Compare features", "قارن المزايا")}
          </span>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>
        <div
          className="pricing-table-wrap"
          role="region"
          aria-label={t(ar, "Feature comparison", "مقارنة المزايا")}
          tabIndex={0}
        >
          <table>
            <caption className="sr-only">
              {t(ar, "Feature comparison", "مقارنة المزايا")}
            </caption>
            <thead>
              <tr>
                <th>{t(ar, "Capability", "القدرة")}</th>
                {pricing.plans.map((p) => (
                  <th key={p.code}>{planCatalog[p.code].name[ar ? "ar" : "en"]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Storefront", "Included", "Included", "Included"],
                ["POS", "Add-on", "Included", "Included"],
                ["Finance", "Add-on", "Included", "Included"],
                ["Advanced analytics", "Add-on", "Included", "Included"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>
                      {i === 0
                        ? t(
                            ar,
                            cell,
                            (
                              {
                                Storefront: "واجهة المتجر",
                                POS: "نقطة البيع",
                                Finance: "المالية",
                                "Advanced analytics": "التحليلات المتقدمة",
                              } as Record<string, string>
                            )[cell],
                          )
                        : t(
                            ar,
                            cell,
                            cell === "Included"
                              ? "مشمول"
                              : cell === "Add-on"
                                ? "إضافة"
                                : "غير متاح",
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
