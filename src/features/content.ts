export type Text = { en: string; ar: string };
export const text = (en: string, ar: string): Text => ({ en, ar });
export type FeatureGroup = {
  id: string;
  title: Text;
  intro: Text;
  items: Text[];
  note?: Text;
};

export const featureGroups: FeatureGroup[] = [
  {
    id: "brand",
    title: text("Brand & storefront", "الهوية وواجهة المتجر"),
    intro: text(
      "Make the store feel like your business, from the first banner to the product page.",
      "امنح متجرك هوية نشاطك، من أول إعلان إلى صفحة المنتج.",
    ),
    items: [
      text(
        "Arabic and English names, content and metadata, with native right-to-left and left-to-right layouts.",
        "أسماء ومحتوى وبيانات وصفية بالعربية والإنجليزية، مع تخطيطات تناسب اتجاه كل لغة.",
      ),
      text(
        "Logo, colors, typography, corner shapes and imagery. Preview light and dark themes, validate them, and import or export theme settings.",
        "شعار وألوان وخطوط وشكل الحواف والصور. عاين المظهر الفاتح والداكن، وتحقق من إعدادات المظهر واستوردها أو صدّرها.",
      ),
      text(
        "Bilingual hero banners, announcement ticker, social links and custom navigation with ordering and visibility controls.",
        "صور رئيسية وشريط إعلانات باللغتين، وروابط اجتماعية وقوائم تنقّل قابلة للترتيب والإظهار والإخفاء.",
      ),
      text(
        "Choose storefront layout, product-card style and grid columns. Configure how ratings and unavailable products appear.",
        "اختر تخطيط الواجهة وبطاقات المنتجات وعدد الأعمدة، وحدد طريقة عرض التقييمات والمنتجات غير المتاحة.",
      ),
    ],
  },
  {
    id: "catalog",
    title: text("Products & variants", "المنتجات وخياراتها"),
    intro: text(
      "Give every product the detail it needs, without losing control of its variants.",
      "أضف تفاصيل كل منتج وتحكّم في خياراته ومتغيراته.",
    ),
    items: [
      text(
        "Create, edit and search products, manage statuses and drafts, and add localized descriptions and multiple images.",
        "أنشئ المنتجات وعدّلها وابحث عنها، وأدر حالاتها ومسوداتها وأضف أوصافًا باللغتين وصورًا متعددة.",
      ),
      text(
        "Organize hierarchical categories, their order and availability. Preview, import and export product CSV data; manage category CSV operations.",
        "نظّم التصنيفات المتفرعة وترتيبها وحالتها. عاين بيانات المنتجات بصيغة CSV واستوردها وصدّرها، وأدر بيانات التصنيفات بالصّيغة نفسها.",
      ),
      text(
        "Reuse option groups, generate variant combinations, and set SKU codes, active status, price overrides and images for individual variants.",
        "أعد استخدام مجموعات الخيارات وولّد تركيبات المتغيرات، وحدد رمز الصنف والحالة والسعر والصور لكل متغير.",
      ),
      text(
        "Use color and visual swatches, grouped variant views, image inheritance and safe-removal previews for option values.",
        "استخدم عينات الألوان والصور وعرض المتغيرات في مجموعات، مع توريث الصور ومعاينة أثر حذف قيم الخيارات.",
      ),
    ],
  },
  {
    id: "offers",
    title: text("Bundles & promotions", "الباقات والعروض"),
    intro: text(
      "Build an offer around a product, a category or a combination that makes sense together.",
      "أنشئ عرضًا لمنتج أو تصنيف أو مجموعة منتجات تكمل بعضها.",
    ),
    items: [
      text(
        "Product bundles with tier pricing and availability-aware cart insertion.",
        "باقات منتجات بتسعير حسب الكمية، مع التحقق من التوفر عند إضافتها للسلة.",
      ),
      text(
        "Combo offers, product-targeted and category-targeted offers, coupons and coupon usage tracking.",
        "عروض مجمّعة وعروض لمنتجات أو تصنيفات محددة، وكوبونات مع متابعة استخدامها.",
      ),
      text(
        "Product-page widgets, recommendations, recently viewed products, reviews and newsletter sign-up.",
        "عناصر إضافية في صفحة المنتج، وتوصيات ومنتجات شوهدت مؤخرًا ومراجعات واشتراك في النشرة البريدية.",
      ),
    ],
  },
  {
    id: "inventory",
    title: text("Inventory & locations", "المخزون والمواقع"),
    intro: text(
      "Know what is physically present, what is promised to an order and what is still available.",
      "اعرف الكمية الموجودة فعليًا والمحجوزة للطلبات والمتاحة للبيع.",
    ),
    items: [
      text(
        "Inventory items, categories, SKU details, costs and valuation, with on-hand, reserved, available, low-stock and out-of-stock views.",
        "أصناف مخزون وتصنيفات ورموز وتكاليف وتقييم للمخزون، مع عرض الموجود والمحجوز والمتاح والأصناف المنخفضة والنافدة.",
      ),
      text(
        "Track stock across multiple locations. Stores sharing a physical location keep separate inventory ledgers.",
        "تابع المخزون عبر عدة مواقع. يحتفظ كل متجر بسجل مخزون مستقل حتى عند مشاركة الموقع الفعلي.",
      ),
      text(
        "Opening balances, adjustments, damage, returns, waste, internal use, sales, receiving and assembly movements, with history and reports.",
        "أرصدة افتتاحية وتسويات وحركات تلف ومرتجعات وهالك واستخدام داخلي وبيع واستلام وتجميع، مع سجل وتقارير.",
      ),
      text(
        "Inventory CSV export, inline reports, guarded deletion and reservation-aware adjustment safeguards.",
        "تصدير المخزون بصيغة CSV وعرض التقارير مباشرة، مع ضوابط للحذف وتسويات تراعي الكميات المحجوزة.",
      ),
    ],
  },
  {
    id: "assembly",
    title: text("Components & assembly", "المكونات والتجميع"),
    intro: text(
      "Sell something made from several parts while respecting the stock behind every part.",
      "بع منتجًا يتكوّن من عدة أجزاء مع مراعاة مخزون كل جزء.",
    ),
    items: [
      text(
        "Link products or individual variants to stock items, shared dependencies or multi-component bills of materials.",
        "اربط المنتجات أو متغيراتها بأصناف المخزون أو بمكونات مشتركة أو بقوائم مواد متعددة المكونات.",
      ),
      text(
        "Calculate product availability and maximum orderable quantity from available components.",
        "احسب توفر المنتج وأقصى كمية قابلة للطلب بناءً على المكونات المتاحة.",
      ),
      text(
        "Preview assembly. Consume components and produce finished items together, with automatic first-build inventory linking where applicable.",
        "عاين عملية التجميع ثم اخصم المكونات وأضف المنتج النهائي في العملية نفسها، مع ربط المخزون تلقائيًا عند أول تجميع حيث ينطبق ذلك.",
      ),
      text(
        "Keep assembly history so the conversion from components to finished stock remains traceable.",
        "احتفظ بسجل التجميع لتتبع تحويل المكونات إلى مخزون جاهز.",
      ),
    ],
  },
  {
    id: "purchasing",
    title: text("Suppliers & purchasing", "الموردون والمشتريات"),
    intro: text(
      "Bring the next shipment into the same stock records you use to sell.",
      "أضف الشحنة التالية إلى سجلات المخزون التي تعتمد عليها في البيع.",
    ),
    items: [
      text(
        "Manage and search suppliers and purchase orders, with references, notes, validated lines and CSV exports.",
        "أدر الموردين وأوامر الشراء وابحث عنها، مع مراجع وملاحظات والتحقق من البنود وتصديرها بصيغة CSV.",
      ),
      text(
        "Expand purchase lines across multiple option dimensions and preserve those variant dimensions in order snapshots.",
        "وسّع بنود الشراء لتشمل تركيبات متعددة من الخيارات، واحتفظ بتفاصيل المتغيرات وقت إنشاء الأمر.",
      ),
      text(
        "Create products from purchase-order expansion or link to existing products through stable option matching.",
        "أنشئ منتجات من خيارات أمر الشراء أو اربطها بمنتجات موجودة عبر مطابقة الخيارات.",
      ),
      text(
        "Receive into a selected location, reverse a receipt when needed, and use guarded purchase-order deletion.",
        "استلم البضاعة في موقع تختاره، واعكس الاستلام عند الحاجة، مع ضوابط لحذف أوامر الشراء.",
      ),
    ],
  },
  {
    id: "checkout",
    title: text("Discovery, cart & checkout", "التصفح والسلة وإتمام الطلب"),
    intro: text(
      "Let customers find the right item and place an order against the store's actual rules.",
      "ساعد العملاء على اختيار المنتج وإتمام الطلب وفق إعدادات متجرك الفعلية.",
    ),
    items: [
      text(
        "Search suggestions, categories, option filters, sorting and shareable catalog URLs. Grid, row and immersive product views, galleries and quick view.",
        "اقتراحات بحث وتصنيفات وفلاتر خيارات وترتيب وروابط كتالوج قابلة للمشاركة. عرض شبكي أو صفوف أو عرض موسّع، مع معارض صور ومعاينة سريعة.",
      ),
      text(
        "Persistent store-specific carts, guest continuity, coupon application, combo detection and stock-aware quantity reconciliation.",
        "سلال محفوظة لكل متجر واستمرار سلة الضيف، مع تطبيق الكوبونات واكتشاف العروض المجمّعة ومراجعة الكميات وفق المخزون.",
      ),
      text(
        "Multi-stage checkout, saved or new addresses, configured tax and shipping, cash on delivery where enabled, and server-checked totals.",
        "إتمام طلب على مراحل وعناوين محفوظة أو جديدة وضريبة وشحن حسب الإعدادات، ودفع عند الاستلام عند تفعيله، مع مراجعة الإجمالي على الخادم.",
      ),
      text(
        "Retry-safe order placement protects the last available unit. Order confirmation, lookup and recovery-token restoration support order continuity.",
        "إنشاء طلب آمن عند إعادة المحاولة يحمي آخر وحدة متاحة، مع تأكيد الطلب والبحث عنه واستعادة الطلب غير المكتمل برمز استعادة.",
      ),
    ],
    note: text(
      "Live Paymob card and wallet processing is not included in the represented feature set. Recovery state exists; complete automated email and WhatsApp delivery is not included.",
      "معالجة مدفوعات البطاقات والمحافظ عبر Paymob ليست ضمن الميزات المعروضة. توجد حالة لاستعادة الطلب، لكن الإرسال الآلي الكامل للبريد وواتساب غير مشمول.",
    ),
  },
  {
    id: "orders",
    title: text("Orders, fulfilment & refunds", "الطلبات والتجهيز والاسترداد"),
    intro: text(
      "Keep a clear record from the first reservation to fulfilment or a recorded refund.",
      "احتفظ بسجل واضح من حجز المخزون حتى تجهيز الطلب أو تسجيل استرداد.",
    ),
    items: [
      text(
        "Search, filter and export orders, inspect saved option details, and prepare consolidated inventory pick lists.",
        "ابحث عن الطلبات وصفّها وصدّرها، وراجع تفاصيل الخيارات المحفوظة وجهّز قوائم جمع الأصناف من المخزون.",
      ),
      text(
        "Controlled order-status changes, fulfilment records and customer-visible fulfilment timelines.",
        "تغييرات منضبطة في حالة الطلب وسجلات للتجهيز وجدول متابعة يظهر للعميل.",
      ),
      text(
        "Reserve, release and consume stock at the appropriate step. Keep payment attempts and payment events on record.",
        "احجز المخزون أو حرره أو اخصمه في الخطوة المناسبة، مع تسجيل محاولات الدفع وأحداثه.",
      ),
      text(
        "Full and partial refund records, limits based on captured funds, internal accounting, activity tracking and CSV export.",
        "سجلات استرداد كاملة أو جزئية بحدود مرتبطة بالأموال المحصّلة، مع محاسبة داخلية ومتابعة النشاط وتصدير CSV.",
      ),
    ],
    note: text(
      "Refunds here are internal records and accounting. Returning money through an external payment provider is not included.",
      "الاسترداد هنا يشمل السجلات والمحاسبة الداخلية. إعادة الأموال عبر مزود دفع خارجي غير مشمولة.",
    ),
  },
  {
    id: "pos",
    title: text("Point of sale", "نقطة البيع"),
    intro: text(
      "Run the counter with stock tied to the selected store and location.",
      "أدر البيع المباشر بمخزون مرتبط بالمتجر والموقع المختارين.",
    ),
    items: [
      text(
        "Select a store, location and register. Open and close shifts, record opening and counted cash, and review cash variance and shift history.",
        "اختر المتجر والموقع والصندوق. افتح الورديات وأغلقها، وسجّل النقد الافتتاحي والمعدود وراجع الفروق وسجل الورديات.",
      ),
      text(
        "Find products and variants, check component-aware availability, manage the cart, capture a customer name and apply order discounts and configured tax.",
        "ابحث عن المنتجات ومتغيراتها وتحقق من توفر المكونات، وأدر السلة وسجّل اسم العميل وطبّق خصم الطلب والضريبة المحددة.",
      ),
      text(
        "Record cash, card, bank-transfer or other tender, calculate cash change, create a sale with duplicate-safe retry, and view a receipt.",
        "سجّل الدفع نقدًا أو ببطاقة أو بتحويل بنكي أو وسيلة أخرى، واحسب الباقي وأنشئ عملية بيع دون تكرار عند إعادة المحاولة واعرض الإيصال.",
      ),
      text(
        "Search sale history and share inventory movements with the online-order stock system.",
        "ابحث في سجل المبيعات واستخدم حركات المخزون المشتركة مع نظام الطلبات الإلكترونية.",
      ),
    ],
    note: text(
      "Recording card tender does not process a card payment. Fully offline POS and barcode-scanner support are not included.",
      "تسجيل الدفع ببطاقة لا يعني معالجة عملية الدفع. العمل الكامل دون اتصال ودعم قارئ الباركود غير مشمولين.",
    ),
  },
  {
    id: "customers",
    title: text("Customers & loyalty", "العملاء والولاء"),
    intro: text(
      "Give each store its own customer relationships and purchase history.",
      "احتفظ بعلاقات العملاء وسجل مشترياتهم لكل متجر على حدة.",
    ),
    items: [
      text(
        "Business-level customer identity with store-specific profiles, registration, sign-in, email confirmation and password recovery workflows.",
        "هوية عميل على مستوى النشاط مع ملف خاص بكل متجر، وتسجيل حساب ودخول وتأكيد البريد ومسارات استعادة كلمة المرور.",
      ),
      text(
        "Search the customer directory, edit profiles and saved addresses, choose a default address, and show order history and reorder options.",
        "ابحث في دليل العملاء وعدّل الملفات والعناوين المحفوظة وحدد العنوان الافتراضي، واعرض سجل الطلبات وخيار إعادة الطلب.",
      ),
      text(
        "Store-specific favorites, guest favorites and merging favorites after sign-in.",
        "مفضلات خاصة بكل متجر ومفضلات للضيف، مع دمجها بعد تسجيل الدخول.",
      ),
      text(
        "Configure loyalty earning and point value. View balances and transaction history, adjust points administratively and review recorded loyalty activity.",
        "حدد قواعد اكتساب نقاط الولاء وقيمتها. اعرض الرصيد وسجل المعاملات وعدّل النقاط إداريًا وراجع نشاط الولاء المسجّل.",
      ),
      text(
        "Eligible-customer reviews, review editing and deletion, admin moderation, ratings and rating-distribution analytics.",
        "مراجعات للعملاء المؤهلين مع تعديلها وحذفها والإشراف عليها، وتقييمات وتحليل توزيعها.",
      ),
    ],
    note: text(
      "Loyalty redemption at checkout, social login, MFA, passkeys and SMS authentication are not included.",
      "استبدال نقاط الولاء عند إتمام الطلب والدخول بحسابات اجتماعية والمصادقة متعددة العوامل ومفاتيح المرور ورسائل التحقق النصية غير مشمولة.",
    ),
  },
  {
    id: "engagement",
    title: text("Consent & notifications", "الموافقات والإشعارات"),
    intro: text(
      "Manage how customers want to hear from you, and keep store activity in view.",
      "أدر تفضيلات تواصل العملاء وتابع نشاط المتجر.",
    ),
    items: [
      text(
        "Email, WhatsApp, personalization and browser-push consent controls.",
        "إعدادات موافقة للبريد وواتساب والتخصيص وإشعارات المتصفح.",
      ),
      text(
        "Newsletter subscriptions and subscriber administration, plus abandoned-cart recovery status.",
        "اشتراكات النشرة البريدية وإدارة المشتركين وحالة استعادة السلات المتروكة.",
      ),
      text(
        "Admin notification inbox, unread state, filters, mark-as-read controls and notification deletion.",
        "صندوق إشعارات للإدارة وحالة غير المقروء وفلاتر وتحديد الإشعارات كمقروءة وحذفها.",
      ),
      text(
        "Store-scoped web-push subscriptions and permission-controlled admin broadcasts when deployment keys are configured.",
        "اشتراكات إشعارات متصفح خاصة بالمتجر وإرسال جماعي حسب الصلاحيات عند إعداد مفاتيح الخدمة.",
      ),
    ],
    note: text(
      "Consent settings do not imply complete automated email or WhatsApp campaigns. Browser push needs deployment configuration.",
      "إعدادات الموافقة لا تعني توفر حملات آلية كاملة للبريد أو واتساب. إشعارات المتصفح تحتاج إلى إعداد الخدمة.",
    ),
  },
  {
    id: "insights",
    title: text("Analytics & accounting", "التحليلات والمحاسبة"),
    intro: text(
      "See performance alongside the financial records behind it.",
      "راجع أداء النشاط مع السجلات المالية التي تفسّره.",
    ),
    items: [
      text(
        "Date-range revenue, orders, average order value and customer acquisition, including daily trends.",
        "إيرادات وطلبات ومتوسط قيمة الطلب واكتساب العملاء خلال فترة تختارها، مع متابعة الاتجاهات اليومية.",
      ),
      text(
        "Top products by units or revenue, category revenue, Egyptian governorate distribution and payment-method distribution.",
        "المنتجات الأعلى حسب الوحدات أو الإيراد، وإيراد التصنيفات والتوزيع حسب المحافظات المصرية ووسائل الدفع.",
      ),
      text(
        "Coupon usage, discounts, ratings, refund activity and loyalty points issued or redeemed in recorded transactions.",
        "استخدام الكوبونات والخصومات والتقييمات ونشاط الاسترداد ونقاط الولاء المضافة أو المستبدلة في المعاملات المسجّلة.",
      ),
      text(
        "Finance overview, income statement, balance sheet, expenses, asset register and chart of accounts.",
        "نظرة مالية عامة وقائمة دخل وميزانية ومصروفات وسجل أصول ودليل حسابات.",
      ),
      text(
        "Double-entry journal foundation and inventory-accounting settings, with automated records for supported sales, costs, refunds, receiving and expense flows.",
        "أساس لدفتر قيود مزدوجة وإعدادات محاسبة المخزون، مع سجلات آلية لمسارات البيع والتكاليف والاسترداد والاستلام والمصروفات المدعومة.",
      ),
    ],
    note: text(
      "Accounting automation applies to supported flows. Recorded loyalty analytics does not mean points can be redeemed at checkout.",
      "المحاسبة الآلية تنطبق على المسارات المدعومة. ظهور تحليلات الولاء المسجّلة لا يعني إمكانية استبدال النقاط عند إتمام الطلب.",
    ),
  },
  {
    id: "team",
    title: text("Team & permissions", "الفريق والصلاحيات"),
    intro: text(
      "Give people access to the stores and responsibilities they actually manage.",
      "امنح أفراد الفريق صلاحيات المتاجر والمهام التي يديرونها.",
    ),
    items: [
      text(
        "Business Owner access across stores, store-specific staff grants, predefined roles and custom roles.",
        "صلاحيات لمالك النشاط عبر المتاجر، وصلاحيات موظفين خاصة بكل متجر وأدوار جاهزة أو مخصصة.",
      ),
      text(
        "Permission-filtered navigation and permission-aware product and order command search.",
        "قوائم إدارة وبحث سريع عن المنتجات والطلبات يراعي صلاحيات الموظف.",
      ),
      text(
        "Staff lookup, expiring invitations, invitation acceptance and staff-grant editing.",
        "البحث عن الموظفين ودعوات محددة الصلاحية وقبول الدعوات وتعديل صلاحيات الوصول.",
      ),
      text(
        "Suspend or revoke access, including handling revocation during a session. Store switching clears unrelated operational state.",
        "علّق الوصول أو ألغِه، بما يشمل سحبه أثناء الجلسة. الانتقال بين المتاجر لا ينقل حالة العمليات من متجر لآخر.",
      ),
    ],
  },
  {
    id: "business",
    title: text("Business & multiple stores", "النشاط والمتاجر المتعددة"),
    intro: text(
      "Grow under one business while preserving the boundaries of each store.",
      "توسّع تحت نشاط واحد مع الحفاظ على استقلال كل متجر.",
    ),
    items: [
      text(
        "Create and find businesses and stores. Review trial or subscription status, store capacity and billing-recovery guidance.",
        "أنشئ الأنشطة والمتاجر وابحث عنها. راجع حالة التجربة أو الاشتراك وسعة المتاجر وإرشادات معالجة مشكلات الفوترة.",
      ),
      text(
        "Manage store handles, localized names, launch readiness and publication, and switch the active store.",
        "أدر معرّفات المتاجر وأسماءها باللغتين وجاهزيتها للإطلاق ونشرها، وانتقل بين المتاجر النشطة.",
      ),
      text(
        "Keep branding, catalog, customers, orders, finances, permissions, settings and inventory specific to each store.",
        "احتفظ بهوية وكتالوج وعملاء وطلبات وماليات وصلاحيات وإعدادات ومخزون خاص بكل متجر.",
      ),
      text(
        "Create, edit and activate business-owned physical locations, link stores to them and share locations while keeping store inventory ledgers separate.",
        "أنشئ المواقع الفعلية التابعة للنشاط وعدّلها وفعّلها، واربط المتاجر بها وشارك المواقع مع بقاء سجلات المخزون منفصلة.",
      ),
    ],
  },
  {
    id: "shipping",
    title: text("Shipping & commerce settings", "الشحن وإعدادات البيع"),
    intro: text(
      "Set the rules that determine what a customer pays and where you deliver.",
      "حدد القواعد التي تضبط تكلفة الطلب ومناطق التوصيل.",
    ),
    items: [
      text(
        "Egyptian governorate rules, area-aware checkout shipping, rates, rule priority and free-shipping thresholds.",
        "قواعد للمحافظات المصرية وشحن حسب المنطقة وأسعار وأولوية للقواعد وحدود للشحن المجاني.",
      ),
      text(
        "Shipping CSV operations and fallback shipping configuration.",
        "إدارة بيانات الشحن بصيغة CSV وإعداد تكلفة شحن بديلة.",
      ),
      text(
        "Store contact details, primary currency, cash-on-delivery enablement, tax and low-stock thresholds.",
        "بيانات التواصل والعملة الأساسية وتفعيل الدفع عند الاستلام والضريبة وحد انخفاض المخزون.",
      ),
    ],
    note: text(
      "The represented context is EGP-first. Full multicurrency presentation, carrier integrations and live carrier tracking are not included.",
      "السياق المعروض يعتمد على الجنيه المصري أساسًا. العرض الكامل بعملات متعددة والتكامل مع شركات الشحن والتتبع المباشر لديها غير مشمولة.",
    ),
  },
  {
    id: "web",
    title: text(
      "SEO, domains & browser access",
      "الظهور في البحث والنطاقات والمتصفح",
    ),
    intro: text(
      "Give your store an address and search presence that belong to it.",
      "امنح متجرك عنوانًا وحضورًا في البحث خاصين به.",
    ),
    items: [
      text(
        "Arabic and English SEO defaults, product and bundle metadata, social-sharing imagery, sitemap and robots behavior.",
        "إعدادات بحث افتراضية بالعربية والإنجليزية وبيانات وصفية للمنتجات والباقات وصور للمشاركة وخريطة موقع وإعدادات لمحركات البحث.",
      ),
      text(
        "Managed store handles, custom-domain registry, store-aware host resolution and canonical URLs.",
        "معرّفات متاجر مُدارة وسجل نطاقات مخصصة وتوجيه للنطاق إلى متجره وروابط أساسية خاصة به.",
      ),
      text(
        "Installable Store PWA, cached storefront assets and cached visited navigation.",
        "إمكانية تثبيت المتجر كتطبيق ويب، وتخزين ملفات الواجهة والصفحات التي تمت زيارتها مؤقتًا.",
      ),
      text(
        "Unknown, ambiguous, inactive and untrusted hosts do not resolve into an unintended store.",
        "النطاقات غير المعروفة أو الملتبسة أو غير النشطة أو غير الموثوقة لا تفتح متجرًا غير مقصود.",
      ),
    ],
    note: text(
      "Automated DNS verification and TLS provisioning are not included. Asset caching is not fully offline checkout, admin, inventory or POS. Public APIs, app marketplaces, ERP connectors and AI commerce features are not included.",
      "التحقق الآلي من DNS وتجهيز TLS غير مشمولين. تخزين الملفات مؤقتًا لا يتيح إتمام الطلب أو الإدارة أو المخزون أو نقطة البيع بالكامل دون اتصال. الواجهات البرمجية العامة وأسواق التطبيقات وروابط ERP وميزات التجارة بالذكاء الاصطناعي غير مشمولة.",
    ),
  },
  {
    id: "safety",
    title: text("Store isolation & history", "عزل بيانات المتجر وسجل العمليات"),
    intro: text(
      "Keep each store's work in its own context, even when your team moves between stores.",
      "أبقِ عمليات كل متجر في سياقها الصحيح حتى حين ينتقل الفريق بين المتاجر.",
    ),
    items: [
      text(
        "Store-partitioned carts and checkout, with isolated drafts, filters, deep routes and pending changes during store switching.",
        "سلات وإتمام طلب خاصان بكل متجر، مع فصل المسودات والفلاتر والروابط الداخلية والتغييرات المعلّقة عند الانتقال بين المتاجر.",
      ),
      text(
        "Store-scoped data policies and transaction-bound store context.",
        "سياسات بيانات خاصة بالمتجر وسياق متجر مرتبط بكل معاملة.",
      ),
      text(
        "Controlled stock movements, audit-friendly events and immutable operational history where required.",
        "حركات مخزون منضبطة وأحداث قابلة للمراجعة وسجل عمليات غير قابل للتغيير حيث يلزم ذلك.",
      ),
      text(
        "Private store media with signed access.",
        "وسائط خاصة بالمتجر مع وصول موقّع.",
      ),
    ],
    note: text(
      "Restricted platform recovery tools are not merchant-facing backup, import or reset controls.",
      "أدوات الاستعادة المقيدة الخاصة بإدارة المنصة ليست أدوات نسخ احتياطي أو استيراد أو إعادة ضبط متاحة للتاجر.",
    ),
  },
];

export const featureMetadata = {
  en: {
    title: "Jizrak features | From your first product to your next store",
    description:
      "Explore Jizrak's store builder, catalog, inventory, checkout, POS, customers, accounting and multiple-store tools through a merchant's working day.",
  },
  ar: {
    title: "ميزات جِذرك | من أول منتج إلى متجرك التالي",
    description:
      "تعرّف على أدوات جِذرك لبناء المتجر وإدارة المنتجات والمخزون والطلبات ونقطة البيع والعملاء والمحاسبة والمتاجر المتعددة.",
  },
};
