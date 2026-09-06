import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type RefObject,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  GitBranch,
  MonitorSmartphone,
} from "lucide-react";
import {
  section,
  copy,
  nodes,
  pair,
  workflowNames,
  type SectionContent,
} from "../content";
import { config } from "../app/config";
import { usePreferences } from "../app/preferences";
import { Header } from "../components/Header";
import { BilingualBlock } from "../components/BilingualBlock";
import { Brand, Cta, PairedLink, RootMark } from "../components/Primitives";
import {
  RootNetwork,
  LedgerDiagram,
  InventoryDiagram,
  CatalogDiagram,
  IdentityDiagram,
  MiniFlow,
} from "../components/RootNetwork";
import { Disclosure } from "../components/Disclosure";
type MotionProps = {
  scope: RefObject<HTMLDivElement | null>;
  setStep: (step: number) => void;
};
function SectionHeading({
  content,
  number,
}: {
  content: SectionContent;
  number?: string;
}) {
  return (
    <div className="section-heading">
      {content.eyebrow.en && (
        <div className="eyebrow">
          {number && <span className="section-number">{number}</span>}
          <BilingualBlock inline text={content.eyebrow} />
        </div>
      )}
      <BilingualBlock
        heading="h2"
        id={`${content.id}-heading`}
        text={content.heading}
      />
    </div>
  );
}
function DetailList({ content }: { content: SectionContent }) {
  return (
    <Disclosure id={`${content.id}-details`} label={copy.detail}>
      <ul className="detail-list">
        {content.details
          .filter(
            (item) =>
              !/restricted Platform Super Admin recovery|Platform operations overview/i.test(
                item.en,
              ),
          )
          .map((item) => (
            <li key={item.id}>
              <Check size={16} aria-hidden="true" />
              <BilingualBlock text={item} />
            </li>
          ))}
      </ul>
    </Disclosure>
  );
}
function Narrative({ id, index }: { id: string; index: number }) {
  const content = section(id);
  let visual;
  if (id === "business") visual = <LedgerDiagram />;
  if (id === "catalog") visual = <CatalogDiagram />;
  if (id === "inventory") visual = <InventoryDiagram />;
  if (id === "identity" || id === "operate") visual = <IdentityDiagram />;
  if (id === "sell")
    visual = (
      <MiniFlow
        steps={[
          pair("discover", "Discover", "اكتشف"),
          pair("choose", "Choose", "اختر"),
          pair("checkout", "Checkout", "إتمام الشراء"),
        ]}
      />
    );
  if (id === "purchasing")
    visual = (
      <MiniFlow
        steps={[
          pair("supplier", "Supplier", "المورد"),
          pair("purchase-order", "Purchase order", "أمر الشراء"),
          pair("receive-order", "Receive", "استلام"),
        ]}
      />
    );
  if (id === "orders")
    visual = (
      <MiniFlow
        steps={[
          pair("reserve-order", "Reserve", "حجز"),
          pair("fulfil", "Fulfil", "تجهيز"),
          pair("history", "Order history", "سجل الطلبات"),
        ]}
      />
    );
  if (id === "pos")
    visual = (
      <MiniFlow
        steps={[
          pair("open-shift", "Open a shift", "افتح الوردية"),
          pair("record-sale", "Record a sale", "سجّل البيع"),
          pair("receipt", "Issue a receipt", "اعرض الإيصال"),
        ]}
      />
    );
  if (id === "customers")
    visual = (
      <MiniFlow
        steps={[
          copy.business,
          copy.storeA,
          pair("profile", "Store customer profile", "ملف العميل في المتجر"),
        ]}
      />
    );
  if (id === "understand")
    visual = (
      <MiniFlow
        steps={[
          pair("sales", "Sales & stock", "المبيعات والمخزون"),
          pair("records", "Financial records", "السجلات المالية"),
          pair("reports", "Operational reports", "تقارير التشغيل"),
        ]}
      />
    );
  // Product truths take precedence over the working copy's platform-recovery reference.
  const body =
    id === "operate"
      ? pair(
          "operate-body-public",
          "Business ownership, Store-specific grants, controlled stock movements, auditable events, and private media keep operating boundaries explicit.",
          "تحافظ ملكية النشاط وصلاحيات كل متجر وحركات المخزون المنضبطة والأحداث القابلة للمراجعة والوسائط الخاصة على حدود تشغيل واضحة.",
        )
      : content.body;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`narrative-section section-${id} ${index % 2 === 0 ? "alternate-surface" : ""}`}
    >
      <div className="container narrative-grid">
        <div className="narrative-copy reveal">
          <SectionHeading
            content={content}
            number={String(index + 2).padStart(2, "0")}
          />
          <BilingualBlock text={body} className="body-copy" />
          {id === "business" && (
            <ul className="proof-points">
              {content.details.slice(0, 3).map((point) => (
                <li key={point.id}>
                  <Check size={16} aria-hidden="true" />
                  <BilingualBlock text={point} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="narrative-evidence">
          {visual}
          <DetailList content={content} />
        </div>
      </div>
    </section>
  );
}
export function Landing() {
  const { locale } = usePreferences();
  const scope = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [Motion, setMotion] = useState<ComponentType<MotionProps> | null>(null);
  useEffect(() => {
    let mounted = true;
    let timedOut = false;
    if (scope.current)
      scope.current.dataset.motionStart = String(performance.now());
    const restore = () => {
      if (scope.current) scope.current.dataset.motionState = "ready";
      scope.current
        ?.querySelectorAll<HTMLElement | SVGElement>("[data-motion-owned]")
        .forEach((el) => {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
          el.style.removeProperty("stroke-dasharray");
          el.style.removeProperty("stroke-dashoffset");
        });
    };
    const watchdog = setTimeout(() => {
      timedOut = true;
      restore();
    }, 2000);
    import("../motion/LandingMotion")
      .then((module) => {
        if (mounted && !timedOut) setMotion(() => module.LandingMotion);
      })
      .catch(restore);
    return () => {
      mounted = false;
      clearTimeout(watchdog);
      restore();
    };
  }, []);
  const hero = section("top");
  const connected = section("connected");
  const atlas = section("features");
  const demo = section("demo");
  const start = section("start");
  return (
    <div ref={scope} className="landing">
      <Header />
      <main id="main" tabIndex={-1}>
        <section id="top" aria-labelledby="top-heading" className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow hero-reveal">
                <span className="connection-dot" />
                <BilingualBlock inline text={hero.eyebrow} />
              </div>
              <BilingualBlock
                heading="h1"
                id="top-heading"
                text={hero.heading}
                className="hero-headline hero-reveal"
              />
              <BilingualBlock
                text={hero.body}
                className="hero-body hero-reveal"
              />
              <div className="actions hero-reveal">
                <Cta />
                <Cta kind="demo" />
              </div>
            </div>
            <div className="hero-art">
              <RootNetwork />
            </div>
          </div>
          <div className="container hero-premise">
            <BilingualBlock text={hero.premise} />
            <a
              className="scroll-cue"
              href="#connected"
              aria-label={connected.heading[locale]}
            >
              <ArrowDown size={22} aria-hidden="true" />
            </a>
          </div>
        </section>
        <aside className="foundation-strip">
          <div className="container">
            {[copy.native, copy.stock, copy.egp].map((text, i) => (
              <div key={text.id}>
                {i === 0 ? (
                  <MonitorSmartphone aria-hidden="true" size={20} />
                ) : i === 1 ? (
                  <GitBranch aria-hidden="true" size={20} />
                ) : (
                  <RootMark />
                )}
                <BilingualBlock text={text} />
              </div>
            ))}
          </div>
        </aside>
        <section
          id="connected"
          aria-labelledby="connected-heading"
          className="connected-section"
        >
          <div className="container connected-grid">
            <div className="connected-intro">
              <SectionHeading content={connected} number="01" />
              <BilingualBlock text={connected.body} className="body-copy" />
              <div className="workflow-key" aria-hidden="true">
                {workflowNames.map((name, i) => (
                  <span key={name.id} data-active={step === i}>
                    <svg
                      className="workflow-path"
                      viewBox="0 0 100 20"
                      fill="none"
                      focusable="false"
                    >
                      <path d="M0 10H100" />
                      <circle cx="8" cy="10" r="3" />
                    </svg>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <BilingualBlock text={name} />
                  </span>
                ))}
              </div>
            </div>
            <ol className="workflow-steps">
              {connected.details.map((detail, i) => (
                <li
                  key={detail.id}
                  className="workflow-step"
                  data-active={step === i}
                >
                  <span className="workflow-number">0{i + 1}</span>
                  <div>
                    <BilingualBlock text={detail} />
                    <span className="current-step" aria-hidden="true">
                      <BilingualBlock inline text={copy.currentStep} />
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        {[
          "business",
          "sell",
          "catalog",
          "inventory",
          "purchasing",
          "orders",
          "pos",
          "customers",
          "understand",
          "identity",
          "operate",
        ].map((id, index) => (
          <Narrative key={id} id={id} index={index} />
        ))}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="atlas-section"
        >
          <div className="container">
            <div className="atlas-intro">
              <SectionHeading content={atlas} />
              <BilingualBlock text={atlas.body} className="body-copy" />
            </div>
            <div className="feature-atlas">
              {atlas.groups?.map((group, i) => {
                const inventory =
                  group.id === "group-17"
                    ? pair(
                        "platform-public",
                        "Installable PWA and cached assets; web push when configured; Store-aware hosts; managed handles; custom-domain registry; private media.",
                        "تطبيق قابل للتثبيت وأصول مخزنة؛ إشعارات ويب عند الإعداد؛ عناوين واعية بالمتجر؛ عناوين مُدارة؛ سجل النطاقات؛ وسائط خاصة.",
                      )
                    : group.inventory;
                return (
                  <Disclosure
                    key={group.id}
                    id={group.id}
                    label={group.name}
                    index={i}
                  >
                    <BilingualBlock
                      text={inventory}
                      className="atlas-inventory"
                    />
                  </Disclosure>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="demo"
          aria-labelledby="demo-heading"
          className="demo-section"
        >
          <div className="container demo-grid">
            <div>
              <SectionHeading content={demo} />
              <BilingualBlock text={demo.body} className="body-copy" />
              {config.demo === "#demo" ? (
                <BilingualBlock
                  text={copy.demoPending}
                  className="preview-note"
                />
              ) : (
                <Cta kind="demo" />
              )}
            </div>
            <div className="demo-diagram" aria-hidden="true">
              <div className="demo-stores">
                <div>
                  <span>A</span>
                  <BilingualBlock text={copy.storeA} />
                </div>
                <div>
                  <span>B</span>
                  <BilingualBlock text={copy.storeB} />
                </div>
              </div>
              <div className="demo-root">
                <RootMark />
                <BilingualBlock text={copy.business} />
              </div>
              <div className="demo-flow">
                {[nodes[0], nodes[2], nodes[3]].map((node) => (
                  <BilingualBlock key={node.id} text={node} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          id="start"
          aria-labelledby="start-heading"
          className="final-section"
        >
          <div className="container">
            <RootMark className="final-mark" />
            <SectionHeading content={start} />
            <BilingualBlock text={start.body} className="body-copy" />
            <div className="actions">
              {config.start !== "#start" && <Cta />}
              <Cta kind="demo" />
            </div>
            {config.start === "#start" && (
              <BilingualBlock
                text={copy.startPending}
                className="preview-note"
              />
            )}
            <svg
              className="final-root"
              viewBox="0 0 600 110"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M300 0v36q0 16-25 16H110q-30 0-30 25v33M300 52h190q30 0 30 25v33M300 52v58" />
            </svg>
          </div>
        </section>
        {config.signin === "#sign-in" && (
          <section
            id="sign-in"
            className="signin-notice container"
            aria-labelledby="sign-in-heading"
          >
            <BilingualBlock
              heading="h2"
              id="sign-in-heading"
              text={copy.signin}
            />
            <BilingualBlock text={copy.signPending} />
          </section>
        )}
      </main>
      <footer id="footer" className="site-footer">
        <div className="container">
          <div className="footer-top">
            <Brand />
            <BilingualBlock text={copy.closing} />
          </div>
          <div className="footer-bottom">
            <span dir="ltr">
              © {new Date().getFullYear()} Jizrak —{" "}
              <span lang="ar" dir="rtl">
                جِذرك
              </span>
            </span>
            <nav aria-label="Footer">
              <PairedLink text={copy.featureLink} href="#features" />
              <PairedLink text={copy.demoLink} href={config.demo} />
              <PairedLink text={copy.signin} href={config.signin} />
              {config.privacy && (
                <PairedLink text={copy.privacy} href={config.privacy} />
              )}
              {config.terms && (
                <PairedLink text={copy.terms} href={config.terms} />
              )}
              <a href="#top" className="back-top" aria-label="Jizrak — جِذرك">
                <ArrowUpRight size={18} />
              </a>
            </nav>
          </div>
          {config.review && (
            <BilingualBlock text={copy.preview} className="review-label" />
          )}
        </div>
      </footer>
      {Motion && <Motion scope={scope} setStep={setStep} />}
    </div>
  );
}
