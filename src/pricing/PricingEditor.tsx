import { useEffect, useState } from "react";
import { MapPin, Minus, Plus, Store, UsersRound } from "lucide-react";
import { usePreferences } from "../app/preferences";
import { Heading, Notice } from "../workspace/Workspace";
import {
  defaultPricingConfig,
  readPricingConfig,
  resetPricingConfig,
  writePricingConfig,
  type PricingConfig,
  type PlanPricing,
  planCatalog,
} from "./model";
import "./editor.css";

const extraResources = [
  { field: "extraStore", label: "Store", arabic: "متجر إضافي", icon: Store },
  {
    field: "extraLocation",
    label: "Location",
    arabic: "موقع إضافي",
    icon: MapPin,
  },
  {
    field: "extraStaff",
    label: "Staff seat",
    arabic: "موظف إضافي",
    icon: UsersRound,
  },
] as const;

const planFields = [
  { field: "monthlyPrice", en: "Monthly price", ar: "السعر الشهري", type: "money", unit: "EGP" },
  { field: "completedOrderFee", en: "Completed-order fee", ar: "رسوم الطلب المكتمل", type: "money", unit: "EGP" },
  { field: "includedStores", en: "Included stores", ar: "المتاجر المشمولة", type: "quantity", unit: null },
  { field: "includedLocations", en: "Included locations", ar: "المواقع المشمولة", type: "quantity", unit: null },
  { field: "includedStaff", en: "Included staff", ar: "الموظفون المشمولون", type: "quantity", unit: null },
  { field: "includedDomains", en: "Included managed domains", ar: "النطاقات المُدارة", type: "quantity", unit: null },
] as const satisfies ReadonlyArray<{
  field: keyof PlanPricing;
  en: string;
  ar: string;
  type: "money" | "quantity";
  unit: "EGP" | null;
}>;

export function PricingEditor() {
  const { locale } = usePreferences();
  const ar = locale === "ar";
  const [saved, setSaved] = useState<PricingConfig>(readPricingConfig);
  const [draft, setDraft] = useState<PricingConfig>(saved);
  const [status, setStatus] = useState("");
  const [attempted, setAttempted] = useState(false);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  useEffect(() => {
    const onStorage = () => {
      const next = readPricingConfig();
      setSaved(next);
      setDraft(next);
    };
    window.addEventListener("jizrak:pricing-change", onStorage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("jizrak:pricing-change", onStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const updatePlan = (code: string, field: keyof PlanPricing, value: string) =>
    setDraft((current) => ({
      ...current,
      plans: current.plans.map((p) =>
        p.code === code
          ? { ...p, [field]: value === "" ? Number.NaN : Number(value) }
          : p,
      ),
    }));
  const updateExtra = (
    code: string,
    field: "extraStore" | "extraLocation" | "extraStaff",
    key: "enabled" | "monthlyPrice",
    value: boolean | string,
  ) =>
    setDraft((current) => ({
      ...current,
      plans: current.plans.map((p) =>
        p.code === code
          ? {
              ...p,
              [field]: {
                ...p[field],
                [key]:
                  key === "monthlyPrice"
                    ? value === ""
                      ? Number.NaN
                      : Number(value)
                    : value,
              },
            }
          : p,
      ),
    }));
  const valid =
    draft.plans.length === 3 &&
    draft.seedAddOns.length === 6 &&
    draft.plans.every(
      (p) =>
        [
          p.monthlyPrice,
          p.completedOrderFee,
          p.includedStores,
          p.includedLocations,
          p.includedStaff,
          p.includedDomains,
        ].every((n) => Number.isFinite(n) && Number.isInteger(n) && n >= 0) &&
        p.includedStores > 0 &&
        p.includedLocations > 0 &&
        p.includedStaff > 0 &&
        (p.code === "seed" ? p.completedOrderFee > 0 : p.monthlyPrice > 0) &&
        [p.extraStore, p.extraLocation, p.extraStaff].every(
          (x) =>
            Number.isFinite(x.monthlyPrice) &&
            Number.isInteger(x.monthlyPrice) &&
            x.monthlyPrice >= 0 &&
            (!x.enabled || x.monthlyPrice > 0),
        ),
    ) &&
    draft.seedAddOns.every(
      (a) =>
        Number.isFinite(a.monthlyPrice) &&
        Number.isInteger(a.monthlyPrice) &&
        a.monthlyPrice >= 0,
    );
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    if (!valid) return;
    writePricingConfig(draft);
    const next = readPricingConfig();
    setSaved(next);
    setDraft(next);
    setStatus(
      ar ? "تم حفظ الأسعار في هذا المتصفح." : "Pricing saved in this browser.",
    );
  };
  const reset = () => {
    if (
      !window.confirm(
        ar
          ? "سيؤدي هذا إلى حذف الأسعار المحفوظة واستعادة القيم المقترحة."
          : "This removes saved pricing and restores the proposed defaults.",
      )
    )
      return;
    resetPricingConfig();
    setSaved(defaultPricingConfig);
    setDraft(defaultPricingConfig);
    setStatus(
      ar ? "تمت استعادة القيم المقترحة." : "Proposed defaults restored.",
    );
  };
  return (
    <>
      <Heading
        title={ar ? "أسعار المنصة." : "Platform pricing."}
        description={
          ar
            ? "عدّل أرقام الكتالوج التجريبي من مساحة إدارة المنصة."
            : "Change the numbers in the sample pricing catalog from Platform governance."
        }
        action={
          <a
            className="ws-button"
            href="/#pricing"
            target="_blank"
            rel="noreferrer"
          >
            {ar ? "معاينة الأسعار" : "Preview landing pricing"} ↗
          </a>
        }
      />
      <Notice>
        {ar
          ? "تُحفظ هنا فقط في هذا المتصفح. لا تُرسل التغييرات إلى خادم، وهذه بيئة تجريبية."
          : "Saved in this browser only. Changes update the landing-page preview on this device and are not sent to a server."}
      </Notice>
      <form className="pricing-editor" onSubmit={save}>
        <section className="ws-panel">
          <h2>{ar ? "أسعار الخطط والحدود" : "Plan pricing and limits"}</h2>
          {draft.plans.map((plan) => (
            <fieldset className="pricing-plan-card" key={plan.code}>
              <legend>
                <span>{planCatalog[plan.code].name[ar ? "ar" : "en"]}</span>
                <small>{planCatalog[plan.code].descriptor[ar ? "ar" : "en"]}</small>
              </legend>
              <div className="editor-grid">
                {planFields.map(({ field, en, ar: arabic, type, unit }) => (
                  <label key={field}>
                    <span className="editor-field-label">{ar ? arabic : en}</span>
                    <input
                      className={type === "money" ? "editor-money-input" : ""}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      value={Number.isNaN(plan[field]) ? "" : plan[field]}
                      onChange={(e) =>
                        updatePlan(plan.code, field, e.target.value)
                      }
                    />
                    {unit && <span className="editor-input-unit">{unit}</span>}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </section>
        <section className="ws-panel">
          <h2>{ar ? "أسعار الموارد الإضافية" : "Extra-resource prices"}</h2>
          <p className="pricing-editor-intro">
            {ar
              ? "حدّد الموارد التي يمكن شراؤها كإضافة، ثم أضف رسومها الشهرية."
              : "Choose which resources can be purchased as add-ons, then set their monthly fee."}
          </p>
          {draft.plans.map((plan) => (
            <fieldset
              className="pricing-plan-card pricing-plan-resources"
              key={`${plan.code}-extras`}
            >
              <legend>
                <span>{planCatalog[plan.code].name[ar ? "ar" : "en"]}</span>
                <small>
                  {ar
                    ? `${extraResources.filter(({ field }) => plan[field].enabled).length} موارد متاحة`
                    : `${extraResources.filter(({ field }) => plan[field].enabled).length} resources available`}
                </small>
              </legend>
              <div className="pricing-resources">
                {extraResources.map(({ field, label, arabic, icon: Icon }) => {
                  const resource = plan[field];
                  const controlId = `${plan.code}-${field}-price`;
                  return (
                    <div
                      className={`pricing-resource${resource.enabled ? " is-enabled" : ""}`}
                      key={field}
                    >
                      <label className="pricing-resource-availability">
                        <input
                          className="pricing-resource-checkbox"
                          type="checkbox"
                          checked={resource.enabled}
                          onChange={(e) =>
                            updateExtra(
                              plan.code,
                              field,
                              "enabled",
                              e.target.checked,
                            )
                          }
                        />
                        <span
                          className="pricing-resource-icon"
                          aria-hidden="true"
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        <span className="pricing-resource-copy">
                          <strong>{ar ? arabic : label}</strong>
                          <small>
                            {ar ? "مورد إضافي" : "Additional resource"}
                          </small>
                        </span>
                        <span
                          className="pricing-resource-state"
                          aria-hidden="true"
                        >
                          {resource.enabled ? (
                            <Plus size={14} strokeWidth={2.4} />
                          ) : (
                            <Minus size={14} strokeWidth={2.4} />
                          )}
                          {resource.enabled
                            ? ar
                              ? "متاح"
                              : "Available"
                            : ar
                              ? "غير متاح"
                              : "Unavailable"}
                        </span>
                      </label>
                      <label
                        className="pricing-resource-price"
                        htmlFor={controlId}
                      >
                        <span>{ar ? "الرسوم الشهرية" : "Monthly fee"}</span>
                        <span className="pricing-money-input">
                          <input
                            id={controlId}
                            type="number"
                            inputMode="numeric"
                            min="0"
                            step="1"
                            disabled={!resource.enabled}
                            value={
                              Number.isNaN(resource.monthlyPrice)
                                ? ""
                                : resource.monthlyPrice
                            }
                            onChange={(e) =>
                              updateExtra(
                                plan.code,
                                field,
                                "monthlyPrice",
                                e.target.value,
                              )
                            }
                          />
                          <span>EGP</span>
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </section>
        <section className="ws-panel">
          <h2>{ar ? `إضافات ${planCatalog.seed.name.ar}` : "Seed add-ons"}</h2>
          <div className="editor-grid">
            {draft.seedAddOns.map((addon) => (
              <label key={addon.code}>
                {addon.code.replaceAll("_", " ")}
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={addon.monthlyPrice}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      seedAddOns: draft.seedAddOns.map((a) =>
                        a.code === addon.code
                          ? {
                              ...a,
                              monthlyPrice:
                                e.target.value === ""
                                  ? Number.NaN
                                  : Number(e.target.value),
                            }
                          : a,
                      ),
                    })
                  }
                />
                <span>EGP / month</span>
              </label>
            ))}
          </div>
        </section>
        {attempted && !valid && (
          <p className="editor-error" role="alert">
            {ar
              ? "تحقق من أن كل القيم أعداد صحيحة غير سالبة، وأن الأسعار والحدود المطلوبة أكبر من صفر."
              : "Check that every value is a non-negative whole number and required prices and limits are greater than zero."}
          </p>
        )}
        <div className="editor-actions">
          <button className="ws-button" disabled={!dirty || !valid}>
            {ar ? "حفظ الأسعار" : "Save pricing"}
          </button>
          <button
            type="button"
            className="ws-button secondary"
            disabled={!dirty}
            onClick={() => {
              setDraft(saved);
              setAttempted(false);
            }}
          >
            {ar ? "تجاهل التغييرات" : "Discard changes"}
          </button>
          <button type="button" className="ws-button secondary" onClick={reset}>
            {ar ? "استعادة القيم المقترحة" : "Reset to proposed defaults"}
          </button>
        </div>
        {status && (
          <p role="status" className="editor-status">
            {status}
          </p>
        )}
      </form>
    </>
  );
}
