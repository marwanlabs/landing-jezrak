import { useState } from "react";
import {
  ArrowRight,
  Check,
  Package,
  ShoppingBag,
  Store,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { Button, Notice, Status } from "./Workspace";
import { StageLine } from "../components/StageLine";
import { SelectMenu } from "../components/SelectMenu";
import type { Translate } from "./model";

export function Demo({ t }: { t: Translate }) {
  const [ordered, setOrdered] = useState(false);
  const [category, setCategory] = useState("home");
  const [launched, setLaunched] = useState(false);
  const product =
    category === "home"
      ? t("Everyday ceramic cup", "كوب سيراميك يومي")
      : category === "fashion"
        ? t("Everyday canvas tote", "حقيبة قماش يومية")
        : t("House coffee blend", "خلطة قهوة المتجر");
  return (
    <div className="ws-demo">
      <section className="ws-demo-opening ws-demo-chapter">
        <div>
          <span className="ws-overline">
            {t(
              "A LITTLE EXPLORATION. A LOT OF POSSIBILITY.",
              "تجربة صغيرة، وصورة أوضح.",
            )}
          </span>
          <h1>
            {t("Meet your\nnext workday.", "تعرّف على\nيوم عملك القادم.")}
          </h1>
          <p>
            {t(
              "From a customer’s first order to the shelf it leaves behind. See how a store comes together in Jizrak.",
              "من أول طلب للعميل إلى القطعة التي تغادر الرف. شاهد كيف تتصل تفاصيل المتجر في جِذرك.",
            )}
          </p>
          <div className="ws-demo-promise">
            <span>
              <Check size={16} />
              {t("No sign-up", "بدون تسجيل")}
            </span>
            <span>
              <Clock3 size={16} />
              {t("Two-hour live demo", "تجربة فعلية لساعتين")}
            </span>
          </div>
          <Button href="#demo-workbench">
            {t("Try a sample order", "جرّب طلبًا تجريبيًا")}
          </Button>
        </div>
        <div className="ws-demo-window">
          <div className="ws-demo-window-bar">
            <span />
            <span />
            <span />
            <small>OLIVE / {t("SAMPLE STORE", "متجر تجريبي")}</small>
          </div>
          <div className="ws-demo-shopfront">
            <span>OLIVE HOME</span>
            <h2>{t("Objects for\nthe everyday.", "قطع جميلة\nلكل يوم.")}</h2>
            <div className="ws-cup" aria-hidden="true">
              <div />
            </div>
            <small>
              {t(
                "Thoughtful essentials, simply made.",
                "أساسيات بسيطة، صُنعت بعناية.",
              )}
            </small>
          </div>
          <div className="ws-floating-order">
            <span className="ws-check">
              <Check size={16} />
            </span>
            <div>
              <strong>{t("One connected story", "تفاصيل مترابطة")}</strong>
              <small>
                {t(
                  "Storefront → Order → Stock",
                  "واجهة المتجر ← الطلب ← المخزون",
                )}
              </small>
            </div>
          </div>
        </div>
      </section>
      <section className="ws-demo-bridge ws-demo-chapter">
        <h2>{t("A sale is only the beginning.", "البيع هو البداية فقط.")}</h2>
        <p>
          {t(
            "Behind every order, something moves. Follow one through your sample store.",
            "خلف كل طلب حركة في متجرك. تابع طلبًا واحدًا في هذه التجربة.",
          )}
        </p>
      </section>
      <section
        className={`ws-workbench ws-demo-chapter${ordered ? " is-ordered" : ""}`}
        id="demo-workbench"
      >
        <div className="ws-workbench-header">
          <div>
            <Status>{t("Interactive sample", "مثال تفاعلي")}</Status>
            <h2>
              {t("One order. Everything in step.", "طلب واحد، وتفاصيل متصلة.")}
            </h2>
          </div>
          <div className="ws-sort">
            <span>{t("Store type", "نوع المتجر")}</span>
            <SelectMenu
              ariaLabel={t("Store type", "نوع المتجر")}
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setOrdered(false);
              }}
              options={[
                { value: "home", label: t("Home & living", "المنزل والمعيشة") },
                { value: "fashion", label: t("Fashion & accessories", "الأزياء والإكسسوارات") },
                { value: "coffee", label: t("Coffee & pantry", "القهوة والمؤن") },
              ]}
            />
          </div>
        </div>
        <div className="ws-transaction">
          <div className="ws-order-product">
            <div
              className={`ws-product-drawing ${category}`}
              aria-hidden="true"
            >
              {category === "home" ? (
                <div className="ws-cup">
                  <div />
                </div>
              ) : category === "fashion" ? (
                <ShoppingBag size={112} strokeWidth={1} />
              ) : (
                <Package size={112} strokeWidth={1} />
              )}
            </div>
            <small>{t("YOUR STOREFRONT", "واجهة متجرك")}</small>
            <h3>{product}</h3>
            <p>
              {t(
                "One item. One sample order.",
                "قطعة واحدة، وطلب تجريبي واحد.",
              )}
            </p>
            <Button disabled={ordered} onClick={() => setOrdered(true)}>
              {ordered
                ? t("Sample order placed", "تم الطلب التجريبي")
                : t("Place sample order", "نفّذ طلبًا تجريبيًا")}
            </Button>
          </div>
          <div className="ws-transaction-connector" aria-hidden="true">
            <ArrowRight />
          </div>
          <div className="ws-order-ledger" aria-live="polite">
            <div className="ws-section-heading">
              <h3>{t("Behind the counter", "خلف الكاونتر")}</h3>
              <Package size={22} />
            </div>
            <div className="ws-stock-number">
              <span>{ordered ? "23" : "24"}</span>
              <div>
                {t("available", "متاحة")}
                <small>
                  {ordered
                    ? t(
                        "1 item reserved for this order",
                        "قطعة محجوزة لهذا الطلب",
                      )
                    : t("Ready for the next customer", "جاهزة للعميل القادم")}
                </small>
              </div>
            </div>
            <div className="ws-stock-blocks" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  className={ordered && i === 23 ? "reserved" : ""}
                  key={i}
                />
              ))}
            </div>
            <div className="ws-ledger-entry" key={String(ordered)}>
              <span className="ws-check">
                {ordered ? <Check size={16} /> : <Clock3 size={16} />}
              </span>
              <div>
                <strong>
                  {ordered
                    ? t("Order #1048 recorded", "سُجل الطلب #1048")
                    : t("Waiting for your first order", "في انتظار طلبك الأول")}
                </strong>
                <small>
                  {ordered
                    ? `${product} · ${t("Stock updated", "تم تحديث المخزون")}`
                    : t(
                        "Your activity record will appear here.",
                        "سيظهر سجل الحركة هنا.",
                      )}
                </small>
              </div>
            </div>
            {ordered && (
              <button
                className="ws-text-button"
                onClick={() => setOrdered(false)}
              >
                <RotateCcw size={14} />
                {t("Reset the sample", "إعادة التجربة")}
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="ws-demo-chapter ws-demo-flow">
        <h2>
          {t(
            "Follow the work, all the way through.",
            "تابع العمل من بدايته إلى نهايته.",
          )}
        </h2>
        <StageLine
          label={t("Sample commerce workflow", "خطوات التجارة التجريبية")}
          stages={[
            {
              id: "browse",
              label: { id: "demo-browse", en: "Browse", ar: "تصفح" },
            },
            {
              id: "order",
              label: { id: "demo-order", en: "Order", ar: "طلب" },
            },
            {
              id: "reserve",
              label: { id: "demo-reserve", en: "Reserve", ar: "حجز" },
            },
            {
              id: "fulfill",
              label: { id: "demo-fulfill", en: "Fulfill", ar: "تجهيز" },
            },
          ]}
        />
        <div className="ws-demo-feature-list">
          {[
            [
              t("Storefront & variants", "واجهة المتجر والخيارات"),
              t(
                "See the product from your customer’s side.",
                "شاهد المنتج كما يراه عميلك.",
              ),
            ],
            [
              t("Inventory & order flow", "المخزون والطلبات"),
              t(
                "Follow stock as an order takes shape.",
                "تابع حركة المخزون مع تجهيز الطلب.",
              ),
            ],
            [
              t("POS & assembly", "نقطة البيع والتجميع"),
              t(
                "Explore the work beyond the online checkout.",
                "استكشف البيع المباشر وتجميع المنتجات.",
              ),
            ],
          ].map(([h, p]) => (
            <div key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="ws-demo-close ws-demo-chapter">
        <Store size={34} />
        <h2>{t("Your turn to explore.", "حان دورك لتستكشف.")}</h2>
        <p>
          {t(
            "A live demo would open an isolated Store for two hours. This build lets you preview the launch experience.",
            "تفتح التجربة الفعلية متجرًا مستقلًا لساعتين. يمكنك هنا معاينة خطوة البدء.",
          )}
        </p>
        <Button onClick={() => setLaunched(true)}>
          {t("Preview demo launch", "معاينة بدء التجربة")}
        </Button>
        {launched && (
          <Notice>
            {t(
              "The launch UI is ready. A demo-session service must be connected to provision a Store. You can keep exploring the sample order above.",
              "واجهة البدء جاهزة. يلزم توصيل خدمة الجلسات لإنشاء متجر تجريبي. يمكنك متابعة تجربة الطلب أعلاه.",
            )}
          </Notice>
        )}
      </section>
    </div>
  );
}
