import type { BilingualText } from "../content";

export const candidateCopy = {
  eyebrow: {
    id: "apple-hero-eyebrow",
    en: "Jizrak for your Store",
    ar: "جِذرك لمتجرك",
  } satisfies BilingualText,
  heading: {
    id: "apple-hero-heading",
    en: "Sell your products. Run your store.",
    ar: "بع منتجاتك. أدر متجرك.",
  } satisfies BilingualText,
  body: {
    id: "apple-hero-body",
    en: "Manage your online storefront, orders, stock, and customers in one place. Add point of sale when you sell in person.",
    ar: "أدر واجهة متجرك الإلكترونية وطلباتك ومخزونك وعملاءك في مكان واحد. واستخدم نقطة البيع عندما تبيع لعملائك مباشرةً.",
  } satisfies BilingualText,
  reassurance: {
    id: "apple-hero-reassurance",
    en: "One store today. Room for more when you need it.",
    ar: "ابدأ بمتجر واحد، وأضف المزيد عندما تحتاج إليه.",
  } satisfies BilingualText,
  visualLabel: {
    id: "apple-store-visual-label",
    en: "Your Store",
    ar: "متجرك",
  } satisfies BilingualText,
  visualOrder: {
    id: "apple-store-visual-order",
    en: "Order #1042 · Ready to fulfil",
    ar: "الطلب رقم ١٠٤٢ · جاهز للتجهيز",
  } satisfies BilingualText,
  visualStock: {
    id: "apple-store-visual-stock",
    en: "In stock · 24",
    ar: "متاح في المخزون · ٢٤",
  } satisfies BilingualText,
  visualNote: {
    id: "apple-store-visual-note",
    en: "Conceptual Store view",
    ar: "تصوّر لواجهة المتجر",
  } satisfies BilingualText,
  visualProduct: {
    id: "apple-store-visual-product",
    en: "Everyday essentials",
    ar: "منتجاتك اليومية",
  } satisfies BilingualText,
  visualProductNote: {
    id: "apple-store-visual-product-note",
    en: "Simple storefront, clear orders.",
    ar: "واجهة بسيطة وطلبات واضحة.",
  } satisfies BilingualText,
  orderJourney: {
    eyebrow: {
      id: "apple-order-journey-eyebrow",
      en: "One order, one Store",
      ar: "طلب واحد، متجر واحد",
    } satisfies BilingualText,
    heading: {
      id: "apple-order-journey-heading",
      en: "See what happens after a customer chooses.",
      ar: "تابع ما يحدث بعد أن يختار العميل.",
    } satisfies BilingualText,
    body: {
      id: "apple-order-journey-body",
      en: "Start with Everyday essentials in your Store. The same order connects the storefront, checkout, inventory, fulfilment, customer history, and supported financial records.",
      ar: "تبدأ الرحلة من منتجاتك اليومية في متجرك. ويربط الطلب نفسه بين واجهة المتجر وإتمام الشراء والمخزون والتجهيز وسجل العميل والسجلات المالية المدعومة.",
    } satisfies BilingualText,
    illustrative: {
      id: "apple-order-journey-illustrative",
      en: "Illustrative order journey — sample values, not a production order.",
      ar: "رحلة طلب توضيحية — القيم المعروضة نموذجية وليست طلبًا حقيقيًا.",
    } satisfies BilingualText,
    steps: [
      {
        id: "apple-order-discover",
        label: "1",
        heading: {
          id: "apple-order-discover-heading",
          en: "Discover and choose",
          ar: "الاكتشاف والاختيار",
        } satisfies BilingualText,
        body: {
          id: "apple-order-discover-body",
          en: "A customer finds Everyday essentials in the branded Storefront and chooses the product or available variant.",
          ar: "يجد العميل منتجاتك اليومية في واجهة المتجر بعلامتك التجارية، ثم يختار المنتج أو التركيبة المتاحة.",
        } satisfies BilingualText,
      },
      {
        id: "apple-order-checkout",
        label: "2",
        heading: {
          id: "apple-order-checkout-heading",
          en: "Checkout creates the order",
          ar: "يُنشئ إتمام الشراء الطلب",
        } satisfies BilingualText,
        body: {
          id: "apple-order-checkout-body",
          en: "Configured shipping, tax, and payment behavior shape the checkout. Order placement is one indivisible operation with server-authoritative totals.",
          ar: "تحدد إعدادات الشحن والضريبة والدفع شكل إتمام الشراء. ويُنشأ الطلب في عملية واحدة غير قابلة للتجزئة مع احتساب نهائي من الخادم.",
        } satisfies BilingualText,
      },
      {
        id: "apple-order-reserve",
        label: "3",
        heading: {
          id: "apple-order-reserve-heading",
          en: "The Store reserves availability",
          ar: "يحجز المتجر الكمية المتاحة",
        } satisfies BilingualText,
        body: {
          id: "apple-order-reserve-body",
          en: "The Store ledger tracks reserved and available quantity for the order. Reservation is a separate inventory state; it is not the same event as consuming stock on sale.",
          ar: "يتابع دفتر المتجر الكمية المحجوزة والمتاحة للطلب. والحجز حالة مستقلة في المخزون، وليس هو حدث استهلاك المخزون عند البيع.",
        } satisfies BilingualText,
      },
      {
        id: "apple-order-fulfil",
        label: "4",
        heading: {
          id: "apple-order-fulfil-heading",
          en: "The merchant fulfils",
          ar: "يجهّز التاجر الطلب",
        } satisfies BilingualText,
        body: {
          id: "apple-order-fulfil-body",
          en: "The merchant manages the order through controlled status changes and fulfilment records, while the customer can follow the visible progress timeline.",
          ar: "يدير التاجر الطلب عبر حالات تغيير مضبوطة وسجلات تجهيز، ويمكن للعميل متابعة خط سير التقدم الظاهر له.",
        } satisfies BilingualText,
      },
      {
        id: "apple-order-consequences",
        label: "5",
        heading: {
          id: "apple-order-consequences-heading",
          en: "The record keeps unfolding",
          ar: "تستمر آثار الطلب في السجلات",
        } satisfies BilingualText,
        body: {
          id: "apple-order-consequences-body",
          en: "Supported workflows can record stock consumption, payment attempts and events, customer history, and financial records for sales, costs, refunds, receipts, and expenses. These are related records, not one guaranteed simultaneous update.",
          ar: "يمكن لسير العمل المدعوم تسجيل استهلاك المخزون ومحاولات الدفع وأحداثها وسجل العميل والسجلات المالية للمبيعات والتكاليف والمبالغ المستردة والإيصالات والمصروفات. هذه سجلات مترابطة، وليست تحديثًا واحدًا متزامنًا بالضرورة.",
        } satisfies BilingualText,
      },
    ],
  },
  sellChapter: {
    eyebrow: {
      id: "apple-sell-chapter-eyebrow",
      en: "Present and sell products",
      ar: "اعرض منتجاتك وبِعها",
    } satisfies BilingualText,
    heading: {
      id: "apple-sell-chapter-heading",
      en: "Give every product a clear path to purchase.",
      ar: "امنح كل منتج طريقًا واضحًا إلى الشراء.",
    } satisfies BilingualText,
    body: {
      id: "apple-sell-chapter-body",
      en: "Build the Storefront, shape the catalog, guide checkout, and keep post-purchase service connected to the same Store rules.",
      ar: "أنشئ واجهة المتجر، ونظّم الكتالوج، ووجّه إتمام الشراء، وأبقِ خدمة ما بعد الشراء مرتبطة بقواعد المتجر نفسها.",
    } satisfies BilingualText,
    storefront: {
      id: "apple-sell-storefront",
      en: "Storefront",
      ar: "واجهة المتجر",
    } satisfies BilingualText,
    storefrontBody: {
      id: "apple-sell-storefront-body",
      en: "Present a branded, bilingual Storefront with native RTL/LTR layouts. Customers can search, browse, choose variants, add to cart, and see live orderable quantity.",
      ar: "اعرض واجهة متجر تحمل علامتك التجارية باللغتين، مع تخطيط أصلي من اليمين إلى اليسار أو من اليسار إلى اليمين. ويمكن للعملاء البحث والتصفح واختيار التركيبات والإضافة إلى السلة ورؤية الكمية القابلة للطلب.",
    } satisfies BilingualText,
    catalog: {
      id: "apple-sell-catalog",
      en: "Catalog and merchandising",
      ar: "الكتالوج وتسويق المنتجات",
    } satisfies BilingualText,
    catalogBody: {
      id: "apple-sell-catalog-body",
      en: "Write Arabic and English product content, reuse option groups, generate variants, connect each sellable choice to inventory, and merchandise with categories, images, bundles, offers, banners, and reviews.",
      ar: "اكتب محتوى المنتج بالعربية والإنجليزية، وأعد استخدام مجموعات الخيارات، وأنشئ التركيبات، واربط كل خيار قابل للبيع بالمخزون، وسوّق المنتجات عبر التصنيفات والصور والحزم والعروض واللافتات والتقييمات.",
    } satisfies BilingualText,
    checkout: {
      id: "apple-sell-checkout",
      en: "Cart, shipping, and payment",
      ar: "السلة والشحن والدفع",
    } satisfies BilingualText,
    checkoutBody: {
      id: "apple-sell-checkout-body",
      en: "A Store-scoped cart carries quantity changes, offers, coupons, saved or new addresses, configured shipping and tax, and cash on delivery where enabled. Totals are authoritative at the server and order placement protects the last unit.",
      ar: "تحافظ السلة الخاصة بالمتجر على تغييرات الكمية والعروض والقسائم والعناوين المحفوظة أو الجديدة وإعدادات الشحن والضريبة والدفع عند الاستلام عند تفعيله. ويحتسب الخادم الإجماليات النهائية، ويحمي إنشاء الطلب الوحدة الأخيرة.",
    } satisfies BilingualText,
    service: {
      id: "apple-sell-service",
      en: "Confirmation and post-purchase service",
      ar: "التأكيد وخدمة ما بعد الشراء",
    } satisfies BilingualText,
    serviceBody: {
      id: "apple-sell-service-body",
      en: "After confirmation, customers can look up orders, follow progress, recover an abandoned checkout, and reorder. Email delivery and recovery messages require configured provider and worker infrastructure.",
      ar: "بعد التأكيد، يمكن للعملاء البحث عن طلباتهم ومتابعة تقدمها واستعادة عملية شراء متروكة وإعادة الطلب. ويتطلب إرسال البريد ورسائل الاستعادة مزودًا وبنية تشغيل مضبوطة.",
    } satisfies BilingualText,
    pos: {
      id: "apple-sell-pos",
      en: "Optional in-person path",
      ar: "مسار اختياري للبيع المباشر",
    } satisfies BilingualText,
    posBody: {
      id: "apple-sell-pos-body",
      en: "When you sell in person, POS uses the same Store inventory rules. Select the Store, Location, and register, open a shift, record the configured tender, issue a receipt, and keep the sale retry-safe. POS is optional; online selling does not depend on it.",
      ar: "عند البيع مباشرةً، تستخدم نقطة البيع قواعد مخزون المتجر نفسها. اختر المتجر والموقع والصندوق، وافتح وردية، وسجّل وسيلة الدفع المفعّلة، وأصدر إيصالًا، واحفظ البيع مع حماية من التكرار عند إعادة المحاولة. نقطة البيع اختيارية، ولا يعتمد البيع عبر الإنترنت عليها.",
    } satisfies BilingualText,
  },
};
