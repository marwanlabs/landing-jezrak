import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleDot } from "lucide-react";
import "./workflow-items-prototype.css";

// THROWAWAY PROTOTYPE — Two workflow-item designs, switchable via ?variant=A|B.
// Question: which shared Arabic item pattern best communicates sequence and status without a decorative divider?

const items = [
  { id: "receive", label: "استلام", note: "تُسجَّل البضاعة في الموقع المحدد" },
  { id: "reserve", label: "حجز", note: "تُحجز الكمية للطلب قبل إتمامه" },
  { id: "sell", label: "بيع", note: "يُنفّذ البيع من القناة المناسبة" },
  { id: "assemble", label: "تجميع", note: "تُحوَّل المكونات إلى صنف جاهز" },
  { id: "report", label: "تقارير التشغيل", note: "تظهر الحركة في التقارير التشغيلية" },
];

const variants = {
  A: "مسار نشط",
  B: "قصة تشغيلية",
} as const;

type Variant = keyof typeof variants;

function PrototypeHeader({ variant }: { variant: Variant }) {
  return (
    <header className="prototype-header" dir="rtl">
      <span className="prototype-kicker">نموذج تجريبي · عنصر مشترك</span>
      <h1>كيف نعرض مراحل التشغيل؟</h1>
      <p>اتجاهان لتقديم الاستلام والحجز والبيع والتجميع من دون صف من الخطوط المنفصلة.</p>
      <span className="prototype-state">الحالة المعروضة: {variants[variant]}</span>
    </header>
  );
}

function VariantA() {
  const [active, setActive] = useState(1);
  const current = items[active];
  return (
    <section className="proto variant-rail" dir="rtl" aria-label="مسار تشغيلي تفاعلي">
      <div className="rail-intro">
        <span>01 / المسار التشغيلي</span>
        <h2>كل مرحلة تترك أثراً واضحاً</h2>
      </div>
      <div className="rail" role="tablist" aria-label="مراحل التشغيل">
        {items.map((item, index) => (
          <button
            className={index === active ? "is-active" : ""}
            key={item.id}
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
          >
            <span className="rail-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="rail-label">{item.label}</span>
          </button>
        ))}
      </div>
      <article className="rail-detail" key={current.id}>
        <span className="detail-status"><CircleDot size={15} /> المرحلة الحالية</span>
        <strong>{current.label}</strong>
        <p>{current.note}</p>
        <ArrowUpRight aria-hidden="true" size={20} />
      </article>
    </section>
  );
}

function VariantB() {
  const [active, setActive] = useState(2);
  return (
    <section className="proto variant-story" dir="rtl" aria-label="قصة سير العمل">
      <div className="story-heading">
        <span>02 / من الحركة إلى القرار</span>
        <h2>مسار يُقرأ كسجلّ، لا كقائمة</h2>
      </div>
      <ol className="story-list">
        {items.map((item, index) => (
          <li className={active === index ? "is-active" : ""} key={item.id}>
            <button onClick={() => setActive(index)} aria-pressed={active === index}>
              <span className="story-marker">{active > index ? <Check size={15} /> : String(index + 1).padStart(2, "0")}</span>
              <span className="story-copy"><strong>{item.label}</strong><small>{item.note}</small></span>
              <span className="story-open" aria-hidden="true">↗</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Switcher({ variant }: { variant: Variant }) {
  const navigate = useNavigate({ from: "/prototype/workflow-items" });
  const keys = Object.keys(variants) as Variant[];
  const change = (delta: number) => {
    const next = keys[(keys.indexOf(variant) + delta + keys.length) % keys.length];
    navigate({ search: { variant: next } });
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") change(1);
      if (event.key === "ArrowRight") change(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  if (!import.meta.env.DEV) return null;
  return (
    <div className="prototype-switcher" dir="ltr" aria-label="Prototype variant switcher">
      <button onClick={() => change(-1)} aria-label="Previous variant"><ArrowLeft size={17} /></button>
      <span><b>{variant}</b> · {variants[variant]}</span>
      <button onClick={() => change(1)} aria-label="Next variant"><ArrowRight size={17} /></button>
    </div>
  );
}

export function WorkflowItemsPrototype() {
  const { variant } = useSearch({ from: "/prototype/workflow-items" });
  return (
    <main className="workflow-items-prototype">
      <PrototypeHeader variant={variant} />
      {variant === "A" && <VariantA />}
      {variant === "B" && <VariantB />}
      <Switcher variant={variant} />
    </main>
  );
}
