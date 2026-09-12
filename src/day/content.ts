import { pair } from "../content";

export const roots = [
  {
    id: "inventory",
    href: "/features#prepare",
    label: pair("root-stock", "Inventory", "المخزون"),
    title: pair(
      "root-stock-title",
      "Know what you can promise.",
      "اعرف ما يمكنك بيعه.",
    ),
    body: pair(
      "root-stock-body",
      "Receive stock, reserve it for orders, and track every movement in the right Store ledger. What you offer stays connected to what you have.",
      "سجّل الاستلام، واحجز الكميات للطلبات، وتابع كل حركة في دفتر المتجر الصحيح. ما تعرضه للبيع مرتبط بما لديك فعلاً.",
    ),
    detail: pair(
      "root-stock-detail",
      "Receiving · Reservations · Assembly",
      "الاستلام · الحجز · التجميع",
    ),
    path: "M400 58 C397 123 338 129 282 160 S181 182 137 238 M282 160 C271 201 234 229 212 268 M338 130 C316 100 274 109 251 95",
  },
  {
    id: "orders",
    href: "/features#sell",
    label: pair("root-orders", "Orders", "الطلبات"),
    title: pair(
      "root-orders-title",
      "Give every order a clear path.",
      "مسار واضح لكل طلب.",
    ),
    body: pair(
      "root-orders-body",
      "Keep the sale, stock reservation and fulfilment connected. Follow the order through its history, with refunds and post-purchase service close at hand.",
      "اربط البيع بحجز المخزون وتجهيز الطلب. تابع سجل الطلب، وارجع إلى الاستردادات وخدمة ما بعد الشراء من نفس النظام.",
    ),
    detail: pair(
      "root-orders-detail",
      "Order history · Fulfilment · Refunds",
      "سجل الطلبات · التجهيز · الاستردادات",
    ),
    path: "M400 58 C408 104 440 131 499 155 S598 183 661 238 M499 155 C525 190 515 219 557 251 M461 139 C489 101 525 113 548 93",
  },
  {
    id: "purchasing",
    href: "/features#prepare",
    label: pair("root-purchasing", "Purchasing", "المشتريات"),
    title: pair(
      "root-purchasing-title",
      "Keep the next sale possible.",
      "جهّز مخزونك للبيع القادم.",
    ),
    body: pair(
      "root-purchasing-body",
      "Bring suppliers, purchase orders and receiving into the same rhythm as your sales. Replenish stock with a record of where it came from.",
      "اجمع الموردين وأوامر الشراء والاستلام مع مبيعاتك في نظام واحد. جدّد المخزون مع الاحتفاظ بسجل مصدره.",
    ),
    detail: pair(
      "root-purchasing-detail",
      "Suppliers · Purchase orders · Receiving",
      "الموردون · أوامر الشراء · الاستلام",
    ),
    path: "M400 58 C384 160 364 237 302 275 S227 349 187 390 M302 275 C266 284 221 278 178 306 M260 316 C280 357 245 396 251 428",
  },
  {
    id: "customers",
    href: "/features#understand",
    label: pair("root-customers", "Customers", "العملاء"),
    title: pair(
      "root-customers-title",
      "Remember the person behind the purchase.",
      "اعرف العميل وراء كل عملية شراء.",
    ),
    body: pair(
      "root-customers-body",
      "Keep customer profiles and purchase history within their Store. Give your team the context to continue the relationship after checkout.",
      "احتفظ بملفات العملاء وسجل مشترياتهم داخل متجرهم. امنح فريقك المعلومات التي يحتاجها لخدمة العميل بعد الشراء.",
    ),
    detail: pair(
      "root-customers-detail",
      "Store profiles · Purchase history · Service",
      "ملفات المتجر · سجل المشتريات · الخدمة",
    ),
    path: "M400 58 C421 151 434 232 500 275 S578 343 621 390 M500 275 C532 282 584 278 627 306 M552 323 C529 356 558 395 551 423",
  },
  {
    id: "finance",
    href: "/features#understand",
    label: pair("root-finance", "Finance", "المالية"),
    title: pair(
      "root-finance-title",
      "See the business behind the numbers.",
      "افهم ما تقوله أرقام نشاطك.",
    ),
    body: pair(
      "root-finance-body",
      "Follow sales, refunds, costs and financial records together. Use operational reports to understand what happened and decide what comes next.",
      "تابع المبيعات والاستردادات والتكاليف والسجلات المالية معًا. استخدم تقارير التشغيل لفهم النتائج وتحديد الخطوة التالية.",
    ),
    detail: pair(
      "root-finance-detail",
      "Financial records · Costs · Reports",
      "السجلات المالية · التكاليف · التقارير",
    ),
    path: "M400 58 C394 161 412 245 398 318 S409 420 400 462 M399 310 C355 338 357 379 329 400 M401 369 C441 398 458 416 460 444",
  },
];

export const trust = [
  {
    title: pair(
      "trust-stores",
      "Independent Stores. One Business.",
      "متاجر مستقلة. نشاط تجاري واحد.",
    ),
    body: pair(
      "trust-stores-body",
      "Each Store keeps its own brand, customers, finances and stock ledger, even when Stores share a physical Location. The Business Owner retains oversight.",
      "يحتفظ كل متجر بعلامته وعملائه وماليته ودفتر مخزونه، حتى عند مشاركة موقع فعلي مع متجر آخر. ويظل لمالك النشاط الإشراف على الجميع.",
    ),
  },
  {
    title: pair(
      "trust-access",
      "The right access for each person.",
      "الصلاحيات المناسبة لكل شخص.",
    ),
    body: pair(
      "trust-access-body",
      "Store-specific roles and permissions keep operating boundaries clear. Operators enter the Stores they are allowed to run, with auditable events behind the work.",
      "توضّح أدوار وصلاحيات كل متجر مسؤولية كل موظف. يدخل المشغّلون إلى المتاجر المصرّح لهم بإدارتها، مع أحداث مسجّلة يمكن مراجعتها.",
    ),
  },
  {
    title: pair(
      "trust-language",
      "Built with Arab businesses in mind.",
      "مصمّم للأنشطة التجارية العربية.",
    ),
    body: pair(
      "trust-language-body",
      "Arabic and English Storefront foundations, native right-to-left layouts, and checkout with Egyptian governorate and area shipping. Payment and delivery options follow your configuration.",
      "أساس لواجهات متاجر بالعربية والإنجليزية، واتجاه أصلي من اليمين إلى اليسار، وشحن حسب المحافظة والمنطقة في مصر. تتبع خيارات الدفع والتوصيل إعدادات متجرك.",
    ),
  },
];
