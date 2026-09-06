# Jizrak One-Page Landing Page: Complete Build Plan

**Document purpose:** This is the complete, standalone specification for designing and building a new Jizrak marketing landing page in a brand-new repository. It assumes the implementer has no access to the original application, its code, or its documentation.

**Page purpose:** Explain Jizrak's full commerce system to Arab business owners and operators, establish trust through concrete connected workflows, let visitors explore a demo, and convert qualified visitors into starting a Business.

**Required outcome:** One responsive, production-quality page in which every substantive section contains both English and Arabic copy, with native LTR/RTL behavior, accessible interactions, light and dark themes, and deliberate GSAP motion.

---

## 1. Non-Negotiable Product Truths

These rules override aesthetic or implementation convenience.

1. The platform name is **Jizrak** in English and **جِذرك** in Arabic. The canonical lockup is **Jizrak — جِذرك**. The Arabic name means "your root."
2. Never use the legacy names Shopentory, Aeriva, or جِزراق.
3. Jizrak is the commerce foundation beneath a merchant's brands. It is not the merchant's brand and must not present itself as the hero of the merchant's story.
4. Jizrak serves established and growing Arab retailers selling online and in person.
5. The core product idea is **inventory-connected, Arabic-first commerce**: storefront, point of sale, catalog, inventory, purchasing, fulfilment, customer operations, finance, and reporting remain connected rather than becoming separate tools.
6. A **Business** owns subscription and access, one or more Stores, shared physical Locations, and its customer-account realm.
7. A **Store** is an isolated, independently branded commerce operation inside a Business. It owns its catalog, orders, customer profiles and history, inventory ledger, finances, settings, and brand.
8. A **Location** is a Business-owned physical place used for inventory or fulfilment. More than one Store can use the same Location.
9. A **Store ledger** is one Store's stock balance and movement history at a Location. A shared Location never means shared stock.
10. A **Business Owner** can access every Store in the Business. A nonowner operator receives explicit Store-specific roles and permissions.
11. Store admin, storefront, customer account, checkout, and POS are Store-branded surfaces. Jizrak branding belongs to the public platform, Business and Store selection, onboarding, subscriptions, and platform governance.
12. Arabic and English have equal authority. Arabic cannot look like a secondary translation added after the English design.
13. EGP and Egyptian commerce are the primary currency and market context. Do not claim complete multicurrency support.
14. Do not invent testimonials, customer logos, user counts, awards, uptime, revenue impact, savings percentages, certifications, or partner integrations.

### Capability status rule

This plan combines implemented product workflows with the target public presentation of those workflows. Before launch, the implementation team must re-verify every claim against the deployed product and its release evidence. A feature may be described on the landing page only when its user-visible journey is enabled in that deployment. Backend foundations, configuration-only controls, demo fixtures, partial localization, and unfinished provider integrations must not be presented as complete customer capabilities.

---

## 2. Vocabulary

Use these terms consistently in copy, code comments, analytics events, and accessibility labels.

| English term   | Arabic term         | Meaning                                                                   |
| -------------- | ------------------- | ------------------------------------------------------------------------- |
| Jizrak         | جِذرك               | The platform and its platform-owned experiences                           |
| Business       | النشاط التجاري      | Ownership, access, subscription, Location, and customer-account container |
| Store          | المتجر              | One isolated, branded commerce operation                                  |
| Active Store   | المتجر النشط        | The Store whose identity, data, and permissions currently apply           |
| Location       | الموقع              | A Business-owned physical inventory or fulfilment place                   |
| Store ledger   | دفتر مخزون المتجر   | One Store's separate stock at one Location                                |
| Business Owner | مالك النشاط التجاري | Governance authority with access to all Stores in the Business            |
| Store Admin    | مسؤول المتجر        | Nonowner with an explicit administrative Store grant                      |
| Operator       | المشغّل             | A staff user working through Store-specific permissions                   |
| Storefront     | واجهة المتجر        | Public Store-branded shopping experience                                  |
| Point of sale  | نقطة البيع          | Store-branded in-person selling workspace                                 |

Do not call a Business or Store a "tenant." Do not call a Location a Store. Do not imply that Stores sharing a Location share inventory.

---

## 3. Audience, Message, and Conversion

### Primary audience

Owners and operations leaders of growing Arab retail businesses who need online sales, in-person sales, stock, purchasing, fulfilment, and financial records to agree.

### Secondary audience

Store operators evaluating whether Jizrak supports their day-to-day catalog, inventory, order, customer, and finance workflows.

### Page job

Within the first screen, the visitor must understand:

- what Jizrak is;
- that it supports Arabic and English natively;
- that it connects online and in-person commerce to one inventory truth;
- that each Store remains independently branded and operationally isolated; and
- what to do next.

### Primary conversion

- English: **Start your Business**
- Arabic: **ابدأ نشاطك التجاري**

### Secondary conversion

- English: **Explore the Demo**
- Arabic: **استكشف التجربة**

### Tertiary action

- English: **Sign in**
- Arabic: **تسجيل الدخول**

### Required owner inputs before launch

The new repository must expose these as configuration rather than guessing them:

| Input                                 | Development fallback | Launch requirement                                                  |
| ------------------------------------- | -------------------- | ------------------------------------------------------------------- |
| Start Business URL                    | `#start`             | Replace with the real onboarding URL                                |
| Demo URL                              | `#demo`              | Replace with the real demo URL                                      |
| Sign-in URL                           | `#sign-in`           | Replace with the real authentication URL                            |
| Production canonical URL              | local origin         | Set the deployed HTTPS URL                                          |
| Contact/support email                 | omit from UI         | Provide a monitored address if shown                                |
| Legal URLs                            | omit from UI         | Provide Privacy and Terms URLs before collecting leads or analytics |
| Analytics provider and consent policy | disabled             | Approve before adding nonessential tracking                         |

No CTA may ship with a placeholder or dead destination.

---

## 4. Content Strategy: Simultaneous Bilingual Presentation

Every substantive page section must show both languages at the same time. A visitor should never need to switch locale merely to discover the other-language version.

### Pairing model

Each content unit is a `BilingualBlock` with:

- an English element marked `lang="en"` and `dir="ltr"`;
- an Arabic element marked `lang="ar"` and `dir="rtl"`;
- one shared semantic heading level, implemented without duplicating the document outline;
- a visible language label only when the pairing might otherwise be ambiguous;
- CSS logical properties rather than physical left/right rules.

Use one real heading as the accessible section heading and one translated paragraph. The preferred language determines which string occupies the heading, and the DOM must be rerendered in that order rather than visually reordered with CSS. Keep a stable section and heading ID across locale changes.

```tsx
<section id="inventory" aria-labelledby="inventory-heading">
  <h2 id="inventory-heading" lang={primary.lang} dir={primary.dir}>
    {primary.heading}
  </h2>
  <p lang={secondary.lang} dir={secondary.dir} className="translated-heading">
    {secondary.heading}
  </p>
</section>
```

Do not attach the translated heading with `aria-describedby`: screen readers should not be forced to hear every heading twice. Both versions remain visible and available through normal reading navigation. Tests must verify the English-first and Arabic-first DOM orders.

### Locale control behavior

The page starts from the browser language and remembers the visitor's preference in `localStorage`.

- English preference sets the document to `lang="en" dir="ltr"`, places English first, and gives it stronger visual emphasis. Arabic remains visible beside or beneath it.
- Arabic preference sets the document to `lang="ar" dir="rtl"`, places Arabic first, and gives it stronger visual emphasis. English remains visible beside or beneath it.
- The locale control label is **العربية** in English mode and **English** in Arabic mode.
- A language change must not reload the page, reset scroll, replay all entrance motion, or move keyboard focus unexpectedly.
- Navigation, button accessible names, metadata, status messages, and form errors use the preferred locale. Visible marketing content remains bilingual.

Preference precedence is: a valid stored `en` or `ar` choice; otherwise a browser language beginning with `ar`; otherwise English. Invalid stored values are ignored. If storage is unavailable, the choice lasts for the current page session. An inline pre-hydration script must apply the preferred `lang`, `dir`, and theme before first paint; the server-rendered fallback is English-first and remains usable if that script is blocked.

Visible bilingual CTAs use a single link with two language spans and an accessible name in the preferred language. Keep the preferred visible phrase inside the accessible name to satisfy label-in-name behavior.

```tsx
<a href={startUrl} aria-label={locale === "ar" ? "ابدأ نشاطك التجاري" : "Start your Business"}>
  <span lang="en" dir="ltr">
    Start your Business
  </span>
  <span aria-hidden="true"> / </span>
  <span lang="ar" dir="rtl">
    ابدأ نشاطك التجاري
  </span>
</a>
```

Approved interface strings:

| Purpose               | English                                 | Arabic                            |
| --------------------- | --------------------------------------- | --------------------------------- |
| Skip link             | Skip to main content                    | انتقل إلى المحتوى الرئيسي         |
| Open menu             | Open navigation                         | افتح قائمة التنقل                 |
| Close menu            | Close navigation                        | أغلق قائمة التنقل                 |
| Theme control         | Change color theme                      | غيّر سمة الألوان                  |
| Light theme           | Light                                   | فاتح                              |
| Dark theme            | Dark                                    | داكن                              |
| System theme          | System                                  | النظام                            |
| Locale changed status | Language preference changed to English. | تم تغيير تفضيل اللغة إلى العربية. |
| Theme changed status  | Color theme changed.                    | تم تغيير سمة الألوان.             |
| Current section       | Current section                         | القسم الحالي                      |

### Arabic quality rules

- Use natural Egyptian warmth in marketing lines and broadly understood Modern Standard Arabic for precise operational descriptions.
- Never apply uppercase transformation or artificial letter spacing to Arabic.
- Verify shaping, diacritics in **جِذرك**, punctuation, line breaks, and mixed Arabic/Latin strings in a real browser.
- Do not place an entire number, currency, or control region in LTR solely for alignment.
- Long Arabic text must wrap without moving CTAs or clipping artwork.

---

## 5. Narrative Structure

The page is one document with anchored sections. The exact order is intentional:

1. Header and navigation: `#top`
2. Hero, one connected commerce root: `#top`
3. Root map, how the system fits together: `#connected`
4. Multi-Store Business foundation: `#business`
5. Storefront and customer buying journey: `#sell`
6. Catalog, products, variants, and merchandising: `#catalog`
7. Inventory truth, Locations, and assembly: `#inventory`
8. Purchasing and suppliers: `#purchasing`
9. Orders, fulfilment, refunds, and recovery: `#orders`
10. Point of sale: `#pos`
11. Customers, loyalty, reviews, and messaging: `#customers`
12. Finance and analytics: `#understand`
13. Store identity, settings, SEO, and PWA: `#identity`
14. Team access, isolation, safety, and recovery: `#operate`
15. Complete feature atlas: `#features`
16. Demo conversion: `#demo`
17. Final CTA and footer: `#start` and `#footer`

The first seven sections tell the core story. The feature atlas provides exhaustive detail without turning the opening experience into a wall of cards.

---

## 6. Page Copy and Section Specifications

All copy below is approved working copy for the new page. The design may adjust line breaks, but must not change meaning or add unsupported claims.

### 6.1 Header

**Brand:** `Jizrak — جِذرك`

**English navigation:**

- How it connects
- Sell
- Operate
- Understand
- All features

**Arabic navigation:**

- كيف تتصل المنظومة
- البيع
- التشغيل
- فهم الأرقام
- كل المزايا

**Controls:** locale preference, theme, Sign in, and Start your Business.

Desktop navigation is interface chrome and uses only the preferred locale to avoid an unreadably wide header. It maps to stable anchors as follows: How it connects → `#connected`; Sell → `#sell`; Operate → `#operate`; Understand → `#understand`; All features → `#features`. The corresponding Arabic labels use the same targets.

**Desktop behavior:** A restrained sticky bar with the full bilingual lockup, section links, controls, and primary CTA.

**Mobile behavior:** Keep the lockup, locale, and primary CTA visible. Put section navigation, theme, and Sign in inside an in-flow accessible disclosure below the header row. It is not a modal and does not trap focus; background content remains operable. `Escape` and selecting an anchor close it and return focus to the trigger only for `Escape`, not after anchor navigation. An outside click closes it without moving focus. Keep the disclosure content mounted only while open and restore a valid closed state when crossing into the desktop breakpoint.

### 6.2 Hero: One Connected Commerce Root

**English eyebrow:** `Jizrak — commerce rooted in one system`

**Arabic eyebrow:** `جِذرك — تجارة متصلة في نظام واحد`

**English headline:** `A foundation that grows with every Store you build.`

**Arabic headline:** `أساس بيكبر مع كل متجر تبنيه.`

**English body:**

> Run your storefront, point of sale, products, inventory, purchasing, orders, customers, and finances from one connected commerce foundation — while every Store keeps its own brand, team, and stock ledger.

**Arabic body:**

> أدر واجهة متجرك ونقطة البيع والمنتجات والمخزون والمشتريات والطلبات والعملاء والمالية من أساس تجاري واحد ومترابط — مع احتفاظ كل متجر بعلامته وفريقه ودفتر مخزونه المستقل.

**English premise:** `Your idea stays yours. Jizrak keeps the operational roots connected.`

**Arabic premise:** `فكرتك تفضل فكرتك. جِذرك بيربط جذور التشغيل مع بعض.`

**Actions:** Show paired English/Arabic labels within each CTA. Primary goes to Business onboarding; secondary goes to the Demo. Use the preferred-language accessible name pattern defined in Section 4.

**Visual:** The right or inline-end side contains the signature root map, not a generic dashboard screenshot. Its central node is `Business / النشاط التجاري` and branches to `Storefront / واجهة المتجر`, `POS / نقطة البيع`, `Inventory / المخزون`, `Purchasing / المشتريات`, `Orders / الطلبات`, `Customers / العملاء`, and `Finance / المالية`. The paths visibly converge through `Inventory / المخزون` and `Orders / الطلبات`. Every visible node contains both labels; the adjacent body copy is the complete text alternative. In Arabic mode, the composition mirrors only where this improves reading direction; text inside nodes remains correctly directed.

**GSAP sequence:** On first load, reveal the lockup, paired headline, supporting copy, and CTAs in a restrained sequence; then draw the root paths with SVG stroke animation and bring nodes into focus. Wait at most 250ms for display fonts; that wait is included in a maximum 1.2-second total hero choreography. Never delay interaction.

### 6.3 Root Map: The Work Stays Connected

**English eyebrow:** `One connected root`

**Arabic eyebrow:** `جذر واحد متصل`

**English heading:** `The work stays connected as you grow.`

**Arabic heading:** `الشغل يفضل متصل وإنت بتكبر.`

**English body:**

> Catalog, orders, fulfilment, purchasing, suppliers, finance, and each Store ledger share one clear Business foundation — without blending the Stores you operate.

**Arabic body:**

> الكتالوج والطلبات والتجهيز والمشتريات والموردون والمالية ودفتر كل متجر يجتمعون على أساس واضح للنشاط التجاري — من غير ما المتاجر التي تديرها تختلط ببعض.

**Connected workflow steps:**

| English                                                                                      | Arabic                                                                                 |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Publish a product once its variants and stock links are ready.                               | انشر المنتج بعد تجهيز خياراته وربطه بالمخزون.                                          |
| Sell it through the Storefront or POS against the correct Store ledger.                      | بِعه من واجهة المتجر أو نقطة البيع من دفتر مخزون المتجر الصحيح.                        |
| Reserve and move stock through controlled inventory flows.                                   | احجز المخزون وحرّكه من خلال عمليات مخزون منضبطة.                                       |
| Replenish through suppliers, purchase orders, receiving, or assembly.                        | جدّد المخزون عبر الموردين وأوامر الشراء والاستلام أو التجميع.                          |
| Follow orders, refunds, costs, and performance without rebuilding the story in spreadsheets. | تابع الطلبات والاستردادات والتكاليف والأداء من غير إعادة تجميع الصورة في ملفات منفصلة. |

**Interaction:** As each step crosses the center activation line, GSAP `ScrollTrigger` highlights its matching labelled path. Only the step nearest the viewport center is active; scrolling backward updates the active step. Active state uses a thicker path, a node marker, and `Current step / الخطوة الحالية`, never color alone. The static default highlights the first step. Do not announce scroll-driven decorative state changes to assistive technology; the ordered text already conveys the sequence.

### 6.4 Multi-Store Business Foundation

**English eyebrow:** `One Business, independent Stores`

**Arabic eyebrow:** `نشاط تجاري واحد، متاجر مستقلة`

**English heading:** `Grow more than one brand without mixing their operations.`

**Arabic heading:** `كبّر أكتر من علامة من غير ما عمليات متاجرك تختلط.`

**English body:**

> A Business can own multiple Stores and shared physical Locations. Each Store keeps its own branding, catalog, customers, orders, finances, permissions, and inventory ledger. Business Owners retain oversight while operators enter only the Stores they are allowed to run.

**Arabic body:**

> يمكن للنشاط التجاري امتلاك عدة متاجر واستخدام مواقع فعلية مشتركة. يحتفظ كل متجر بعلامته وكتالوجه وعملائه وطلباته وماليته وصلاحياته ودفتر مخزونه. يظل لمالك النشاط إشراف كامل، بينما يدخل كل مشغّل إلى المتاجر المصرح له بإدارتها فقط.

**Proof points:**

| English                                                          | Arabic                                        |
| ---------------------------------------------------------------- | --------------------------------------------- |
| Store-specific branding and commerce data                        | علامة وبيانات تجارية مستقلة لكل متجر          |
| Business-owned Locations serving one or more Stores              | مواقع يملكها النشاط وتخدم متجراً أو أكثر      |
| Separate Store stock ledgers at a shared Location                | دفتر مخزون منفصل لكل متجر داخل الموقع المشترك |
| Owner access across the Business                                 | وصول المالك إلى كل متاجر النشاط               |
| Store-specific staff roles and permissions                       | أدوار وصلاحيات موظفين خاصة بكل متجر           |
| Safe Store switching that starts at the selected Store dashboard | تبديل آمن يفتح لوحة المتجر المختار            |

**Visual:** A split-ledger diagram. `Location / الموقع` sits in the center. `Store A / المتجر أ` connects to `Store A ledger / دفتر المتجر أ`, while `Store B / المتجر ب` connects to `Store B ledger / دفتر المتجر ب`. Never merge the ledger lines. The six proof points are its full text equivalent.

### 6.5 Storefront and Buying Journey

**English eyebrow:** `Sell online`

**Arabic eyebrow:** `البيع أونلاين`

**English heading:** `A Storefront built around discovery, confidence, and a safe checkout.`

**Arabic heading:** `واجهة متجر تساعد العميل يكتشف ويختار ويكمل شراءه بثقة.`

**English body:**

> Give each Store its own branded shopping experience, from search and product discovery through variant selection, cart, shipping, payment choice, confirmation, and post-purchase account journeys.

**Arabic body:**

> امنح كل متجر تجربة تسوق بعلامته، من البحث واكتشاف المنتجات واختيار الخيارات إلى السلة والشحن وطريقة الدفع والتأكيد وخدمات ما بعد الشراء.

**Capabilities to show:**

| English                                                                                                                                                                                                                                                              | Arabic                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bilingual Storefront foundations with native RTL/LTR layouts; complete localization across every admin and customer workflow remains subject to deployment verification.                                                                                             | أساس ثنائي اللغة لواجهة المتجر مع اتجاه أصلي من اليمين إلى اليسار ومن اليسار إلى اليمين؛ وتظل الترجمة الكاملة لكل مسارات الإدارة والعملاء خاضعة للتحقق في النسخة المنشورة.                                             |
| Configurable announcement bar, navigation, hero banners, social links, and layout.                                                                                                                                                                                   | شريط إعلانات وتنقل وبانرات رئيسية وروابط اجتماعية وتخطيط قابل للتخصيص.                                                                                                                                                 |
| Product search and suggestions; category trees; option filters; sorting; pagination; grid, row, and immersive views; URL-backed shareable catalog state; and remembered filters.                                                                                     | بحث واقتراحات؛ شجرة فئات؛ فلاتر للخيارات؛ ترتيب؛ تقسيم صفحات؛ عرض شبكي أو صفّي أو غامر؛ حالة كتالوج محفوظة في الرابط وقابلة للمشاركة؛ وتذكّر الفلاتر.                                                                  |
| Product cards, quick view, galleries, variant and option selection, effective pricing, live orderable quantity, ratings, reviews, recommendations, and recently viewed products.                                                                                     | بطاقات المنتجات والمعاينة السريعة ومعارض الصور واختيار التركيبات والخيارات والأسعار الفعلية والكمية المتاحة للطلب والتقييمات والمراجعات والتوصيات والمنتجات المشاهدة أخيراً.                                           |
| Bundle pages with tier pricing and availability-safe cart insertion.                                                                                                                                                                                                 | صفحات باقات بأسعار شرائح وإضافة إلى السلة تراعي التوفر الفعلي.                                                                                                                                                         |
| Persistent Store-scoped cart, quantity changes, combo-offer detection, authoritative line and stock reconciliation, and coupons.                                                                                                                                     | سلة محفوظة خاصة بكل متجر وتعديل الكميات واكتشاف العروض المجمعة ومراجعة موثوقة لبنود السلة والمخزون والكوبونات.                                                                                                         |
| Staged checkout with saved or new addresses, Egyptian governorate and area shipping, configured shipping and tax, cash on delivery where enabled, server-authoritative totals, indivisible order placement, and protection when customers compete for the last unit. | دفع على مراحل بعناوين محفوظة أو جديدة وشحن حسب المحافظة والمنطقة وإعدادات الشحن والضريبة والدفع عند الاستلام عند تفعيله وإجماليات يحسبها الخادم وإنشاء الطلب كوحدة واحدة وحماية عند محاولة أكثر من عميل شراء آخر قطعة. |
| Confirmation, customer order lookup, abandoned-checkout capture, recovery-token restoration, recovery status, and email-attempt timestamps. Actual email delivery requires configured provider and worker infrastructure.                                            | تأكيد الطلب وبحث العميل عن طلبه وحفظ عملية الدفع المتروكة واستعادتها برمز مخصص ومتابعة حالة الاستعادة وتوقيت محاولات البريد. يتطلب إرسال البريد فعلياً إعداد مزود الخدمة وعمليات الخلفية.                              |
| Favorites, including guest favorites merged into the customer's Store account after sign-in.                                                                                                                                                                         | المفضلة، بما فيها دمج اختيارات الزائر في حسابه الخاص بالمتجر بعد تسجيل الدخول.                                                                                                                                         |

### 6.6 Catalog and Merchandising

**English eyebrow:** `Shape the offer`

**Arabic eyebrow:** `كوّن عرضك`

**English heading:** `From a simple product to a full variant and bundle catalog.`

**Arabic heading:** `من منتج بسيط إلى كتالوج كامل بالخيارات والباقات.`

**English body:**

> Build a bilingual catalog, reuse option groups, generate variant combinations, connect every sellable choice to the right inventory, and merchandise products through categories, images, bundles, offers, banners, and reviews.

**Arabic body:**

> أنشئ كتالوجاً ثنائي اللغة، وأعد استخدام مجموعات الخيارات، وولّد تركيبات المنتجات، واربط كل اختيار قابل للبيع بمخزونه الصحيح، ثم اعرضه بالفئات والصور والباقات والعروض والبانرات والمراجعات.

**Feature details:**

| English                                                                                                                       | Arabic                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Product search, status, create, edit, draft delete, hard delete, and CSV preview/import/export.                               | البحث عن المنتجات وحالاتها وإنشاؤها وتعديلها وحذف المسودة أو الحذف النهائي ومعاينة CSV واستيراده وتصديره.                   |
| Arabic and English product names and descriptions.                                                                            | أسماء وأوصاف المنتجات بالعربية والإنجليزية.                                                                                 |
| Hierarchical categories with ordering, activation, quick creation, and CSV operations.                                        | فئات متدرجة مع الترتيب والتفعيل والإنشاء السريع وعمليات CSV.                                                                |
| Multiple product images and image selection.                                                                                  | صور متعددة للمنتج مع اختيار الصورة المستخدمة.                                                                               |
| Reusable option-group library and per-product option copies.                                                                  | مكتبة مجموعات خيارات قابلة لإعادة الاستخدام مع نسخة خيارات خاصة بكل منتج.                                                   |
| Option values, ordering, color or visual swatches, image inheritance, option-value image overrides, and safe-removal preview. | قيم الخيارات وترتيبها وعينات الألوان أو الخيارات المرئية ووراثة الصور وتخصيص صورة لقيمة معينة ومعاينة أثر الحذف قبل تنفيذه. |
| Automatic variant combination generation.                                                                                     | توليد تركيبات المنتج تلقائياً.                                                                                              |
| Variant activation, SKU, price overrides, grouped views, detail editing, and product defaults.                                | تفعيل التركيبات ورمز SKU والسعر المخصص والعرض المجمع وتعديل التفاصيل والقيم الافتراضية للمنتج.                              |
| Product-to-inventory and variant-to-inventory links.                                                                          | ربط المنتج أو تركيبته بصنف المخزون الصحيح.                                                                                  |
| Bundles with selected products and tier pricing.                                                                              | باقات بمنتجات مختارة وأسعار حسب الشريحة.                                                                                    |
| Combo offers targeting products or categories.                                                                                | عروض مجمعة تستهدف منتجات أو فئات.                                                                                           |
| Product review moderation.                                                                                                    | مراجعة تقييمات المنتجات وإدارتها.                                                                                           |

### 6.7 Inventory, Locations, and Assembly

**English eyebrow:** `One inventory truth, wherever you sell`

**Arabic eyebrow:** `حقيقة مخزون واحدة، أينما تبيع`

**English heading:** `Know what can be sold, what it depends on, and where it moved.`

**Arabic heading:** `اعرف ما يمكن بيعه، وممَّ يتكوّن، وأين تحرّك.`

**English body:**

> Storefront and POS availability come back to controlled Store ledgers at Business-owned Locations. Products can link to finished inventory or depend on several components, so orderability reflects the materials actually available.

**Arabic body:**

> ترجع إتاحة المنتجات في واجهة المتجر ونقطة البيع إلى دفاتر مخزون منضبطة داخل مواقع يملكها النشاط. يمكن ربط المنتج بمخزون نهائي أو بعدة مكونات، فتعبّر الكمية القابلة للبيع عن المواد المتاحة فعلاً.

**Feature details:**

| English                                                                                                                                                 | Arabic                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Inventory item search, SKU details, category assignment, costs, and guarded deletion.                                                                   | البحث في أصناف المخزون وتفاصيل SKU وربط الفئات والتكاليف والحذف المحمي.                                                            |
| Business-owned Location creation, editing, activation, and Store linking.                                                                               | إنشاء المواقع التي يملكها النشاط وتعديلها وتفعيلها وربطها بالمتاجر.                                                                |
| Separate Store-ledger stock, reserved quantity, available quantity, valuation, low-stock, and out-of-stock visibility.                                  | مخزون منفصل في دفتر كل متجر مع الكمية المحجوزة والمتاحة والتقييم وتنبيهات النقص والنفاد.                                           |
| Controlled movements for opening balance, adjustment, damage, return, waste, internal use, sales, receiving, and assembly.                              | حركات منضبطة للرصيد الافتتاحي والتسوية والتلف والمرتجع والهالك والاستخدام الداخلي والمبيعات والاستلام والتجميع.                    |
| Movement history, inventory reports, inline report viewing, and CSV export.                                                                             | سجل الحركات وتقارير المخزون وعرض التقرير داخل الصفحة وتصدير CSV.                                                                   |
| Product and variant inventory links.                                                                                                                    | ربط المنتجات وتركيباتها بأصناف المخزون.                                                                                            |
| Multi-component dependencies or bills of materials, including variant-specific dependency sets.                                                         | وصفات أو قوائم مكونات متعددة، ومنها مكونات خاصة بتركيبة منتج معينة.                                                                |
| Dependency-aware maximum orderable quantity across Storefront and POS.                                                                                  | حساب أقصى كمية قابلة للطلب حسب المكونات في واجهة المتجر ونقطة البيع.                                                               |
| Assembly preview, indivisible component consumption and finished-item production, automatic link on first build where applicable, and assembly history. | معاينة التجميع واستهلاك المكونات وإنتاج الصنف النهائي في عملية واحدة وربطه تلقائياً عند أول إنتاج عند انطباق ذلك وحفظ سجل التجميع. |
| Safeguards that prevent adjustments from violating active reservations.                                                                                 | ضوابط تمنع التسويات من الإخلال بالكميات المحجوزة للطلبات النشطة.                                                                   |

**Foundation not marketed as a current UI:** A stock-transfer server operation exists, but a verified user-facing Location-transfer workflow is not part of this landing-page claim.

### 6.8 Purchasing and Suppliers

**English eyebrow:** `Replenish with context`

**Arabic eyebrow:** `جدّد مخزونك بسياقه الكامل`

**English heading:** `Carry product detail from the purchase order into sellable inventory.`

**Arabic heading:** `انقل تفاصيل المنتج من أمر الشراء إلى مخزون جاهز للبيع.`

**English body:**

> Manage suppliers and purchase orders, receive into the intended Location, preserve option dimensions, and create or link products from purchase-order expansions without losing how variants map to inventory.

**Arabic body:**

> أدر الموردين وأوامر الشراء، واستلم في الموقع المقصود، واحتفظ بأبعاد الخيارات، وأنشئ المنتجات أو اربطها من تفاصيل أمر الشراء من غير فقدان علاقة التركيبات بالمخزون.

**Feature details:**

| English                                                                                               | Arabic                                                                                                   |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Supplier create, view, update, delete, and search.                                                    | إنشاء الموردين وعرضهم وتعديلهم وحذفهم والبحث فيهم.                                                       |
| Purchase-order search, creation, supplier references, notes, line validation, detail, and CSV export. | البحث في أوامر الشراء وإنشاؤها وإضافة مرجع المورد والملاحظات والتحقق من البنود وعرض التفاصيل وتصدير CSV. |
| Multi-dimensional option-group expansion on purchase-order lines.                                     | توسيع مجموعات الخيارات متعددة الأبعاد داخل بنود أمر الشراء.                                              |
| Snapshots that preserve variant dimensions for later matching.                                        | لقطات تحفظ أبعاد التركيبات لمطابقتها لاحقاً.                                                             |
| Receiving into a selected Location through controlled stock movements.                                | استلام البضاعة في موقع محدد عبر حركات مخزون منضبطة.                                                      |
| Receipt reversal and guarded purchase-order deletion.                                                 | إلغاء عملية الاستلام وحذف أمر الشراء بضوابط حماية.                                                       |
| Create a new product from a purchase-order expansion or link the expansion to an existing product.    | إنشاء منتج جديد من تفاصيل أمر الشراء أو ربطها بمنتج موجود.                                               |
| Stable matching of multi-dimensional option signatures.                                               | مطابقة ثابتة لتركيبات الخيارات متعددة الأبعاد.                                                           |

### 6.9 Orders, Fulfilment, Refunds, and Recovery

**English eyebrow:** `Orders end to end`

**Arabic eyebrow:** `الطلبات من البداية للنهاية`

**English heading:** `Keep the order, stock, payment record, and customer history aligned.`

**Arabic heading:** `خلّي الطلب والمخزون وسجل الدفع وتاريخ العميل متوافقين.`

**English body:**

> Search and manage Store orders through controlled status changes, fulfilment, partial or full refunds, exports, customer timelines, reordering, and abandoned-checkout recovery.

**Arabic body:**

> ابحث في طلبات المتجر وأدرها عبر تغييرات حالة منضبطة وتجهيز الطلبات والاسترداد الجزئي أو الكامل والتصدير والخط الزمني للعميل وإعادة الطلب واسترجاع عمليات الدفع المتروكة.

**Feature details:**

| English                                                                                                                                                                  | Arabic                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Admin order search, filters, detail, controlled status transitions, option snapshots on order lines, and consolidated inventory pick lists.                              | البحث في الطلبات وفلاترها وتفاصيلها وتغييرات الحالة المنضبطة ولقطات الخيارات داخل بنود الطلب وقوائم تجهيز مخزون مجمعة.                   |
| Fulfilment records and customer-visible progress timeline.                                                                                                               | سجلات تجهيز الطلب وخط زمني يوضح التقدم للعميل.                                                                                           |
| Partial and full refund requests bounded by captured funds, with internal accounting records and exports.                                                                | طلبات استرداد جزئي أو كامل في حدود المبلغ المحصّل، مع سجلات محاسبية داخلية وتصدير.                                                       |
| Customer order history, detail, and reorder from a previous purchase.                                                                                                    | سجل طلبات العميل وتفاصيلها وإعادة الطلب من عملية شراء سابقة.                                                                             |
| Abandoned-checkout persistence, recovery-token restoration, recovery status, and email-attempt timestamps; delivery requires configured email and worker infrastructure. | حفظ عملية الدفع المتروكة واستعادتها برمز مخصص ومتابعة حالة الاستعادة وتوقيت محاولات البريد؛ ويتطلب الإرسال إعداد البريد وعمليات الخلفية. |
| Idempotent order placement, payment-attempt/event accounting foundation, stock reservation, release, and consumption.                                                    | إنشاء الطلب بأمان عند إعادة المحاولة وأساس محاسبي لمحاولات وأحداث الدفع وحجز المخزون وتحريره واستهلاكه.                                  |
| Order and refund CSV export.                                                                                                                                             | تصدير الطلبات والاستردادات بصيغة CSV.                                                                                                    |

**Accuracy note for implementation:** Do not claim an operational external refund provider or live payment gateway. The reliable current claim is the internal order, payment-event, and refund-accounting foundation plus cash on delivery.

### 6.10 Point of Sale

**English eyebrow:** `Sell in person`

**Arabic eyebrow:** `البيع داخل المتجر`

**English heading:** `A register that sells from the same inventory discipline.`

**Arabic heading:** `صندوق بيع يعمل من نفس نظام المخزون المنضبط.`

**English body:**

> Select the Store, Location, and register; open a shift; search products and variants; record cash, card, transfer, or other tender; calculate change for cash; issue a receipt; and keep the sale and stock movement durable and retry-safe.

**Arabic body:**

> اختر المتجر والموقع وصندوق البيع، وافتح الوردية، وابحث عن المنتجات وتركيباتها، وسجّل الدفع النقدي أو البطاقة أو التحويل أو طريقة أخرى، واحسب الباقي للنقد، واعرض الإيصال، وامنع تكرار البيع عند إعادة المحاولة.

**Feature details:**

| English                                                                                                        | Arabic                                                                                                             |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Active Store, Location, and register selection.                                                                | اختيار المتجر النشط والموقع وصندوق البيع.                                                                          |
| Register lifecycle and shift opening, closing, opening cash, counted cash, variance, and shift history.        | دورة حياة صندوق البيع وفتح الوردية وإغلاقها والنقدية الافتتاحية والنقدية المعدودة والفرق وسجل الورديات.            |
| Product catalog search, browsing, and variant selection.                                                       | البحث في كتالوج المنتجات وتصفحه واختيار تركيبة المنتج.                                                             |
| Store-ledger and dependency-aware availability.                                                                | إتاحة محسوبة من دفتر مخزون المتجر ومكونات المنتج.                                                                  |
| Cart quantity controls and customer-name capture.                                                              | التحكم في كميات السلة وتسجيل اسم العميل.                                                                           |
| Order-level discounts, configured tax, cash/card/transfer/other tender recording, and cash change calculation. | خصم على مستوى الطلب وضريبة حسب الإعداد وتسجيل الدفع نقداً أو بالبطاقة أو التحويل أو طريقة أخرى وحساب الباقي للنقد. |
| Sale creation as one indivisible operation, with safe retry protection against duplicate sales.                | إنشاء البيع كعملية واحدة لا تتجزأ مع حماية إعادة المحاولة من تكرار البيع.                                          |
| Receipt view and durable searchable sale history.                                                              | عرض الإيصال وسجل بيع ثابت وقابل للبحث.                                                                             |
| Stock movements shared with the same inventory lifecycle used by online orders.                                | حركات مخزون تستخدم دورة المخزون نفسها الخاصة بالطلبات الإلكترونية.                                                 |

**Accuracy note:** Do not mention barcode scanning, card terminals, loyalty redemption at POS, or offline selling. These are not verified current capabilities.

### 6.11 Customers, Loyalty, Reviews, and Messaging

**English eyebrow:** `Know each Store's customers`

**Arabic eyebrow:** `اعرف عملاء كل متجر`

**English heading:** `Build the relationship without mixing customer histories across Stores.`

**Arabic heading:** `ابنِ علاقة العميل من غير خلط تاريخه بين المتاجر.`

**English body:**

> A customer can use one Business-level identity while each Store keeps its own profile, addresses, favorites, consent, loyalty, reviews, and commerce history.

**Arabic body:**

> يمكن للعميل استخدام هوية واحدة داخل النشاط التجاري، بينما يحتفظ كل متجر بملفه وعناوينه ومفضلته وموافقاته وولائه ومراجعاته وتاريخه التجاري بشكل مستقل.

**Feature details:**

| English                                                                                                                | Arabic                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Customer search and directory.                                                                                         | دليل العملاء والبحث فيه.                                                                               |
| Registration, login, logout, email confirmation, forgot password, password reset, recovery, and invitation acceptance. | التسجيل وتسجيل الدخول والخروج وتأكيد البريد ونسيان كلمة المرور وإعادة تعيينها والاستعادة وقبول الدعوة. |
| Store-specific profile editing and address create, edit, delete, and default selection.                                | تعديل ملف العميل الخاص بالمتجر وإنشاء العناوين وتعديلها وحذفها واختيار العنوان الافتراضي.              |
| Favorites with guest-to-account merge.                                                                                 | المفضلة مع دمج اختيارات الزائر في الحساب.                                                              |
| Loyalty earning rules, point-value settings, balance, transaction history, and administrative point adjustment.        | قواعد كسب الولاء وإعداد قيمة النقاط والرصيد وسجل الحركات وتعديل النقاط إدارياً.                        |
| Eligible customer review creation, editing, deletion, rating display, and admin moderation.                            | إنشاء العميل المؤهل للمراجعة وتعديلها وحذفها وعرض التقييم وإدارة المراجعات.                            |
| Email, WhatsApp, personalization, and browser-push consent controls.                                                   | التحكم في موافقات البريد وواتساب والتخصيص وإشعارات المتصفح.                                            |
| Newsletter subscription and subscriber administration.                                                                 | الاشتراك في النشرة البريدية وإدارة المشتركين.                                                          |
| Store-scoped web push subscription and permission-controlled admin broadcasts when deployment keys are configured.     | اشتراك إشعارات الويب الخاص بالمتجر وبث إداري محكوم بالصلاحيات عند إعداد مفاتيح النشر.                  |
| Admin notification inbox with unread state, filters, mark read, mark all read, and delete.                             | صندوق إشعارات الإدارة مع حالة غير المقروء والفلاتر وتحديد المقروء وتحديد الكل وحذف الإشعار.            |

**Accuracy note:** Do not claim customer loyalty redemption at checkout, WhatsApp message delivery, complete event-trigger automation, or fully wired transactional email. WhatsApp is currently a social/consent channel; email and web push depend on provider configuration and incomplete event wiring.

### 6.12 Finance and Analytics

**English eyebrow:** `See the operating picture`

**Arabic eyebrow:** `شوف صورة التشغيل كاملة`

**English heading:** `Connect stock and sales to the numbers that explain the Business.`

**Arabic heading:** `اربط المخزون والمبيعات بالأرقام التي تشرح نشاطك.`

**English body:**

> Follow Store performance by date range, understand product and customer patterns, and maintain core accounting records without separating commerce from its financial consequences.

**Arabic body:**

> تابع أداء المتجر حسب الفترة، وافهم أنماط المنتجات والعملاء، واحتفظ بالسجلات المحاسبية الأساسية من غير فصل التجارة عن نتائجها المالية.

**Analytics details:**

| English                                                              | Arabic                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------- |
| Revenue, order count, average order value, and customer acquisition. | الإيراد وعدد الطلبات ومتوسط قيمة الطلب واكتساب العملاء. |
| Daily revenue, orders, and customers.                                | الإيراد والطلبات والعملاء يومياً.                       |
| Revenue by category.                                                 | الإيراد حسب الفئة.                                      |
| Top products by revenue and units.                                   | أفضل المنتجات حسب الإيراد والوحدات.                     |
| Geographic distribution by Egyptian governorate.                     | التوزيع الجغرافي حسب المحافظة المصرية.                  |
| Payment-method split.                                                | توزيع المبيعات حسب طريقة الدفع.                         |
| Coupon usage and discount totals.                                    | استخدام الكوبونات وإجمالي الخصومات.                     |
| Loyalty points issued and redeemed in recorded transactions.         | نقاط الولاء الممنوحة والمستخدمة في الحركات المسجلة.     |
| Rating distribution.                                                 | توزيع التقييمات.                                        |
| Refund totals and daily refund activity.                             | إجمالي الاستردادات وحركتها اليومية.                     |

**Finance details:**

| English                                                                                                                | Arabic                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Finance overview.                                                                                                      | نظرة عامة على المالية.                                                                                     |
| Date-ranged income statement.                                                                                          | قائمة دخل حسب الفترة الزمنية.                                                                              |
| Balance sheet.                                                                                                         | الميزانية.                                                                                                 |
| Expense list and creation.                                                                                             | عرض المصروفات وإنشاؤها.                                                                                    |
| Asset register and editing.                                                                                            | سجل الأصول وتعديلها.                                                                                       |
| Chart of accounts.                                                                                                     | دليل الحسابات.                                                                                             |
| Balanced double-entry journal foundation.                                                                              | أساس قيود يومية متوازنة بالقيد المزدوج.                                                                    |
| Configurable inventory accounting and automated records for supported sales, cost, refund, receipt, and expense flows. | محاسبة مخزون قابلة للإعداد وسجلات تلقائية لعمليات البيع والتكلفة والاسترداد والاستلام والمصروفات المدعومة. |

### 6.13 Store Identity, Settings, SEO, and PWA

**English eyebrow:** `Your Store stays your brand`

**Arabic eyebrow:** `متجرك يفضل بعلامتك`

**English heading:** `Control how every Store looks, speaks, sells, and appears in search.`

**Arabic heading:** `تحكّم في شكل كل متجر ولغته وبيعه وظهوره في البحث.`

**English body:**

> Jizrak supplies the operating structure while each Store controls its localized identity, content, commerce rules, and public presentation.

**Arabic body:**

> يوفّر جِذرك هيكل التشغيل، بينما يتحكم كل متجر في هويته ومحتواه وقواعده التجارية وظهوره العام بكل لغة.

**Feature details:**

| English                                                                                                                   | Arabic                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Localized Store name, logo, colors, typography, radius, imagery, metadata, and content.                                   | اسم المتجر المحلي وشعاره وألوانه وخطوطه واستدارة عناصره وصوره وبياناته الوصفية ومحتواه.                                |
| Validated appearance themes with light/dark preview and theme import/export.                                              | سمات مظهر خاضعة للتحقق مع معاينة فاتحة وداكنة واستيراد السمة وتصديرها.                                                 |
| Bilingual hero banners and announcement ticker.                                                                           | بانرات رئيسية وشريط إعلانات بالعربية والإنجليزية.                                                                      |
| Built-in and custom Storefront navigation with order and enablement controls.                                             | تنقل جاهز أو مخصص لواجهة المتجر مع التحكم في الترتيب والتفعيل.                                                         |
| Store contact details, primary currency, COD, tax, fallback shipping, low-stock threshold, and inventory-accounting mode. | بيانات اتصال المتجر وعملته الأساسية والدفع عند الاستلام والضريبة والشحن الاحتياطي وحد نقص المخزون ووضع محاسبة المخزون. |
| Product-card style, layout, grid columns, ratings display, and out-of-stock hide or gray behavior.                        | نمط بطاقة المنتج والتخطيط وأعمدة الشبكة وعرض التقييمات وإخفاء المنتج النافد أو عرضه بالرمادي.                          |
| Loyalty earning and point-value rules, plus social links.                                                                 | قواعد كسب نقاط الولاء وقيمتها والروابط الاجتماعية.                                                                     |
| Bilingual SEO defaults, per-product and per-bundle metadata, Open Graph imagery, sitemap, and robots behavior.            | إعدادات SEO بالعربية والإنجليزية وبيانات كل منتج وباقة وصور Open Graph وخريطة الموقع وسلوك محركات البحث.               |
| Governorate-based shipping rules, rates, priority, free-shipping thresholds, and CSV operations.                          | قواعد شحن حسب المحافظة وأسعارها وأولويتها وحد الشحن المجاني وعمليات CSV.                                               |
| Configurable product-page widgets.                                                                                        | مكونات قابلة للإعداد داخل صفحة المنتج.                                                                                 |
| Installable Store PWA with cached Storefront assets and browser push support when configured.                             | تطبيق متجر قابل للتثبيت مع تخزين أصول الواجهة ودعم إشعارات المتصفح عند إعدادها.                                        |
| Store-aware managed handles, custom-domain registry, canonical host behavior, and fail-closed Store resolution.           | عناوين مُدارة تراعي المتجر وسجل للنطاقات المخصصة وسلوك العنوان الأساسي وحل هوية المتجر بشكل يرفض الحالات غير الموثوقة. |

**Accuracy note:** Do not claim comprehensive offline commerce, full multicurrency display, self-service DNS verification, or automated TLS provisioning. The PWA caches supported assets and visited navigation; it does not queue offline orders or POS sales.

### 6.14 Access, Isolation, Safety, and Recovery

**English eyebrow:** `Control without confusion`

**Arabic eyebrow:** `تحكّم واضح من غير لخبطة`

**English heading:** `Give people the access they need and keep every Store boundary explicit.`

**Arabic heading:** `امنح كل شخص الصلاحية التي يحتاجها وحافظ على حدود كل متجر.`

**English body:**

> Business ownership, Store-specific grants, controlled stock movements, auditable events, private media, and restricted platform recovery infrastructure create a safer operating foundation without turning the landing page into a certification claim.

**Arabic body:**

> توفّر ملكية النشاط وصلاحيات كل متجر وحركات المخزون المنضبطة والأحداث القابلة للمراجعة والوسائط الخاصة وبنية استعادة المنصة المقيّدة أساساً أكثر أماناً، من غير تقديم ادعاءات اعتماد غير مثبتة.

**Feature details:**

| English                                                                                                                                                                                                     | Arabic                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Permission-filtered Store admin navigation and product/order command search.                                                                                                                                | تنقل إدارة المتجر حسب الصلاحيات وبحث سريع في أوامر المنتجات والطلبات.                                                                                       |
| Business Owner authority and Store-specific predefined or custom staff roles.                                                                                                                               | صلاحيات مالك النشاط وأدوار موظفين جاهزة أو مخصصة لكل متجر.                                                                                                  |
| Staff lookup, hashed expiring invitations, grant editing, suspension, revocation, and mid-session access-revocation handling.                                                                               | البحث عن الموظفين ودعوات مشفّرة محددة المدة وتعديل الصلاحية وتعليقها وإلغاؤها والتعامل مع سحب الوصول أثناء الجلسة.                                          |
| Safe Store entry and Store switching without carrying another Store's cart, draft, filter, deep route, or mutation state.                                                                                   | دخول وتبديل آمن للمتجر من غير نقل سلة أو مسودة أو فلتر أو صفحة داخلية أو عملية تعديل من متجر آخر.                                                           |
| Business workspace subscription state, trial end, Store capacity, and billing-recovery guidance.                                                                                                            | حالة الاشتراك في مساحة النشاط ونهاية الفترة التجريبية وسعة المتاجر وإرشادات استعادة الفوترة.                                                                |
| Store-aware host resolution that fails closed for unknown, ambiguous, inactive, or untrusted hosts.                                                                                                         | حل عنوان الموقع حسب المتجر مع رفض العناوين المجهولة أو الملتبسة أو غير النشطة أو غير الموثوقة.                                                              |
| Store-partitioned cart and checkout persistence.                                                                                                                                                            | حفظ السلة والدفع في مساحة منفصلة لكل متجر.                                                                                                                  |
| Store-scoped database policy foundation, transaction-bound context, and immutable operational history where required.                                                                                       | أساس سياسات بيانات خاص بكل متجر وسياق مرتبط بالمعاملة وسجل تشغيل غير قابل للتعديل عند الحاجة.                                                               |
| Private Store media with signed access.                                                                                                                                                                     | وسائط خاصة بالمتجر بوصول موقّع.                                                                                                                             |
| Restricted Platform Super Admin recovery infrastructure with encrypted, checksummed artifacts; it is not a merchant Store-admin backup feature and may be disabled by deployment configuration.             | بنية استعادة مقيّدة لمسؤول المنصة بملفات مشفّرة ومزوّدة بفحص سلامة؛ وليست ميزة نسخ احتياطي لمسؤول المتجر وقد تكون معطلة حسب إعداد النشر.                    |
| Platform operations overview, Business health and alerts, subscription-state controls, Store lifecycle overrides, archive/restore workflow, domain-state controls, and audited time-limited support access. | نظرة عامة لعمليات المنصة وصحة الأنشطة وتنبيهاتها والتحكم في حالة الاشتراك ودورة حياة المتجر والأرشفة والاستعادة وحالة النطاق ووصول دعم مؤقت وخاضع للمراجعة. |

**Accuracy note:** Describe these as product controls, not as proof of a security certification or completed production audit. Do not claim that every direct admin route has complete permission parity.

### 6.15 Complete Feature Atlas

This section is required. It prevents the page from hiding the breadth of the product while allowing the narrative sections to stay readable.

**English eyebrow:** `The complete operating system`

**Arabic eyebrow:** `نظام التشغيل الكامل`

**English heading:** `Every connected capability, in one place.`

**Arabic heading:** `كل الإمكانات المترابطة، في مكان واحد.`

**English introduction:**

> Open any group to see the detailed workflows Jizrak connects. Nothing here replaces the product itself; it gives your team a clear map of what can be explored.

**Arabic introduction:**

> افتح أي مجموعة لرؤية تفاصيل سير العمل الذي يربطه جِذرك. هذه القائمة لا تستبدل تجربة المنتج؛ لكنها تعطي فريقك خريطة واضحة لما يمكن استكشافه.

Render every group as a native `<details>` element with a bilingual `<summary>` at all breakpoints. This is the functional no-JavaScript baseline: every group can be opened, all content remains in the DOM, and no state depends on a script. On desktop, arrange the same details elements in two columns; do not transform them into tabs or a one-panel category rail. With JavaScript, allow multiple groups to remain open and preserve native Enter/Space keyboard behavior. When crossing breakpoints, keep each element's `open` state and current focus. GSAP may animate only the inner panel's opacity and transform after the native open state changes; it must not animate measured height or delay access to content.

| Group                                         | English feature inventory                                                                                                                                                                                                                                                                                                               | Arabic feature inventory                                                                                                                                                                                                                                                                                |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business and Stores / النشاط والمتاجر         | Business discovery and search; Business creation; workspace; subscription/trial state; Store capacity and billing-recovery guidance; Store search and creation; managed handles; localized names; launch-readiness checklist; publication; multiple independent Stores; Active Store switching; shared Locations with separate ledgers. | اكتشاف الأنشطة والبحث فيها؛ إنشاء النشاط؛ مساحة العمل؛ حالة الاشتراك والفترة التجريبية؛ سعة المتاجر وإرشادات استعادة الفوترة؛ البحث عن المتاجر وإنشاؤها؛ عناوين مُدارة؛ أسماء محلية؛ قائمة جاهزية الإطلاق؛ النشر؛ عدة متاجر مستقلة؛ تبديل المتجر النشط؛ مواقع مشتركة بدفاتر منفصلة.                     |
| Team and access / الفريق والصلاحيات           | Owner-wide access; Store-specific grants; predefined and custom roles; permission-filtered navigation; staff lookup; invitation; update; suspension; revocation; access-loss handling.                                                                                                                                                  | وصول المالك لكل المتاجر؛ صلاحيات خاصة بكل متجر؛ أدوار جاهزة ومخصصة؛ تنقل حسب الصلاحية؛ البحث عن الموظفين؛ الدعوة؛ التعديل؛ الإيقاف؛ الإلغاء؛ التعامل مع فقدان الوصول.                                                                                                                                   |
| Catalog / الكتالوج                            | Products; bilingual content; statuses; images; hierarchical categories; reusable options; option values; color or visual swatches; generated variants; SKU and price overrides; image inheritance; product defaults; CSV import preview, import, and export; guided product workflows.                                                  | المنتجات؛ محتوى ثنائي اللغة؛ الحالات؛ الصور؛ فئات متدرجة؛ خيارات قابلة لإعادة الاستخدام؛ قيم الخيارات؛ عينات ألوان أو خيارات مرئية؛ توليد التركيبات؛ رموز وأسعار مخصصة؛ وراثة الصور؛ إعدادات المنتج الافتراضية؛ معاينة واستيراد وتصدير CSV؛ إرشادات داخلية لعمليات المنتج.                              |
| Merchandising / العرض والترويج                | Bundles; tier pricing; combo offers; coupons; product/category targeting; hero banners; announcement bar; custom navigation; product widgets; reviews; recommendations; recently viewed; newsletter.                                                                                                                                    | الباقات؛ أسعار الشرائح؛ العروض المجمعة؛ الكوبونات؛ استهداف المنتجات والفئات؛ البانرات؛ شريط الإعلانات؛ تنقل مخصص؛ مكونات صفحة المنتج؛ المراجعات؛ التوصيات؛ المشاهدة الأخيرة؛ النشرة البريدية.                                                                                                           |
| Inventory / المخزون                           | Inventory items and categories; multi-Location Store ledgers; reserved and available quantities; costs and valuation; low/out-of-stock visibility; controlled adjustments; movements; history; inline reports; CSV; guarded deletion; guided inventory workflows.                                                                       | أصناف وفئات المخزون؛ دفاتر المتجر متعددة المواقع؛ الكميات المحجوزة والمتاحة؛ التكاليف والتقييم؛ تنبيهات النقص والنفاد؛ تسويات منضبطة؛ الحركات؛ السجل؛ تقارير داخل الصفحة؛ CSV؛ حذف محمي؛ إرشادات داخلية لعمليات المخزون.                                                                                |
| Dependencies and assembly / المكونات والتجميع | Product and variant stock links; shared and variant dependencies; multi-component bills of materials; dependency-aware availability; assembly preview; assembly as one indivisible operation; auto-link on first build; assembly history.                                                                                               | ربط مخزون المنتج والتركيبة؛ مكونات مشتركة وخاصة بالتركيبة؛ قوائم مكونات متعددة؛ إتاحة حسب المكونات؛ معاينة التجميع؛ تنفيذ التجميع كعملية واحدة؛ ربط تلقائي عند أول إنتاج؛ سجل التجميع.                                                                                                                  |
| Purchasing / المشتريات                        | Supplier CRUD/search; purchase orders; references and notes; option expansion; PO snapshots; Location receiving; receipt cancellation; deletion safeguards; purchase-order CSV export; create product from PO; link to existing product; multidimensional matching.                                                                     | إنشاء الموردين وعرضهم وتعديلهم وحذفهم والبحث فيهم؛ أوامر الشراء؛ المراجع والملاحظات؛ توسيع الخيارات؛ لقطات أمر الشراء؛ الاستلام في الموقع؛ إلغاء الاستلام؛ حماية الحذف؛ تصدير أوامر الشراء CSV؛ إنشاء منتج من الأمر؛ الربط بمنتج موجود؛ مطابقة متعددة الأبعاد.                                          |
| Storefront / واجهة المتجر                     | Search, suggestions, and command navigation; categories; option filters; sort; pagination; URL state; remembered filters; multiple views; cards; quick view; galleries; product detail; variants; pricing; availability; bundles; recommendations; recently viewed; ratings and reviews.                                                | البحث والاقتراحات والتنقل السريع؛ الفئات؛ فلاتر الخيارات؛ الترتيب؛ الصفحات؛ حالة الرابط؛ تذكر الفلاتر؛ طرق عرض؛ البطاقات؛ المعاينة السريعة؛ الصور؛ تفاصيل المنتج؛ التركيبات؛ الأسعار؛ الإتاحة؛ الباقات؛ التوصيات؛ المشاهدة الأخيرة؛ التقييمات والمراجعات.                                               |
| Cart and checkout / السلة والدفع              | Store-scoped persistent cart; quantity limits; stock reconciliation; offers; coupons; saved/new addresses; governorate/area shipping; tax; COD; authoritative totals; order creation as one operation; last-unit concurrency protection; confirmation; token recovery with provider-dependent email delivery.                           | سلة محفوظة لكل متجر؛ حدود الكمية؛ مراجعة المخزون؛ العروض؛ الكوبونات؛ عناوين محفوظة أو جديدة؛ شحن المحافظة والمنطقة؛ الضريبة؛ الدفع عند الاستلام؛ إجماليات موثوقة؛ إنشاء الطلب كعملية واحدة؛ حماية آخر قطعة عند تزامن المشترين؛ التأكيد؛ استعادة برمز مع إرسال بريد يعتمد على إعداد المزود.              |
| Orders / الطلبات                              | Search; filters; details; option snapshots; consolidated pick lists; controlled statuses; fulfilment timeline; partial/full internal refund records; exports; customer history; reorder; reservations; payment attempts and events; guided workflows.                                                                                   | البحث؛ الفلاتر؛ التفاصيل؛ لقطات الخيارات؛ قوائم تجهيز مجمعة؛ حالات منضبطة؛ خط التجهيز الزمني؛ سجلات استرداد جزئي وكامل؛ التصدير؛ تاريخ العميل؛ إعادة الطلب؛ الحجوزات؛ محاولات وأحداث الدفع؛ إرشادات داخلية.                                                                                             |
| POS / نقطة البيع                              | Store, Location, and register context; register lifecycle; shift open/close/history; cash counts and variance; catalog search; variants; availability; cart; discount; tax; customer name; cash/card/transfer/other tender; cash change; one-operation sale; duplicate-safe retry; receipt; sale history; guided workflow.              | سياق المتجر والموقع وصندوق البيع؛ دورة حياة الصندوق؛ فتح وإغلاق وسجل الورديات؛ عد النقدية والفرق؛ البحث؛ التركيبات؛ الإتاحة؛ السلة؛ الخصم؛ الضريبة؛ اسم العميل؛ الدفع نقداً أو بالبطاقة أو التحويل أو غيره؛ باقي النقد؛ بيع في عملية واحدة؛ إعادة محاولة بلا تكرار؛ الإيصال؛ سجل البيع؛ إرشادات داخلية. |
| Customers / العملاء                           | Directory; Business identity; Store profiles; profile edit; address CRUD/default; favorites and guest merge; consent; order history/detail/reorder; loyalty balance and history; eligible reviews.                                                                                                                                      | الدليل؛ هوية النشاط؛ ملفات المتاجر؛ تعديل الملف؛ إدارة العناوين والافتراضي؛ المفضلة ودمج الضيف؛ الموافقات؛ سجل وتفاصيل وإعادة الطلب؛ رصيد وسجل الولاء؛ المراجعات المؤهلة.                                                                                                                               |
| Engagement / التواصل                          | Coupons and usage; loyalty earning/admin adjustment; review moderation; newsletter subscribers; push opt-in; Store broadcasts; notification inbox/read/delete; abandoned-cart recovery status.                                                                                                                                          | الكوبونات والاستخدام؛ كسب الولاء وتعديل الإدارة؛ مراجعة التقييمات؛ مشتركو النشرة؛ الاشتراك في الإشعارات؛ بث المتجر؛ صندوق الإشعارات وقراءتها وحذفها؛ حالة استرجاع السلة.                                                                                                                                |
| Finance / المالية                             | Overview; chart of accounts; double-entry journal foundation; expenses; assets; income statement; balance sheet; inventory accounting configuration; supported automatic commerce postings.                                                                                                                                             | النظرة العامة؛ دليل الحسابات؛ أساس القيود المزدوجة؛ المصروفات؛ الأصول؛ قائمة الدخل؛ الميزانية؛ إعداد محاسبة المخزون؛ قيود تلقائية للعمليات المدعومة.                                                                                                                                                    |
| Analytics / التحليلات                         | Revenue; orders; AOV; customer acquisition; daily trends; category revenue; top products; governorates; payment mix; coupons; loyalty; ratings; refunds; date ranges.                                                                                                                                                                   | الإيراد؛ الطلبات؛ متوسط قيمة الطلب؛ اكتساب العملاء؛ الاتجاهات اليومية؛ إيراد الفئات؛ أفضل المنتجات؛ المحافظات؛ مزيج الدفع؛ الكوبونات؛ الولاء؛ التقييمات؛ الاستردادات؛ الفترات الزمنية.                                                                                                                  |
| Store configuration / إعداد المتجر            | Contact and currency; COD; tax; shipping; stock thresholds; accounting mode; layout; cards; grid; ratings; out-of-stock behavior; ticker; loyalty; social links; bilingual SEO; colors; themes; banners; navigation; widgets.                                                                                                           | الاتصال والعملة؛ الدفع عند الاستلام؛ الضريبة؛ الشحن؛ حد المخزون؛ وضع المحاسبة؛ التخطيط؛ البطاقات؛ الشبكة؛ التقييمات؛ سلوك النفاد؛ الشريط؛ الولاء؛ الروابط الاجتماعية؛ SEO ثنائي اللغة؛ الألوان؛ القوالب؛ البانرات؛ التنقل؛ المكونات.                                                                    |
| Platform and resilience / المنصة والاستمرارية | Installable PWA and cached assets; web push when configured; Store-aware hosts; managed handles; custom-domain registry; private media; restricted Super Admin recovery infrastructure; encrypted artifacts and checksums; platform health, lifecycle, archive/restore, domain controls, and bounded support access.                    | تطبيق قابل للتثبيت وأصول مخزنة؛ إشعارات ويب عند الإعداد؛ عناوين واعية بالمتجر؛ عناوين مُدارة؛ سجل النطاقات؛ وسائط خاصة؛ بنية استعادة مقيّدة لمسؤول المنصة؛ ملفات مشفرة وفحص سلامة؛ صحة المنصة ودورة الحياة والأرشفة والاستعادة والنطاقات ودعم محدود.                                                    |

### 6.16 Demo Conversion

**English eyebrow:** `See the connected workflow`

**Arabic eyebrow:** `شاهد سير العمل المترابط`

**English heading:** `Explore a demonstration Store before you start.`

**Arabic heading:** `استكشف متجراً تجريبياً قبل أن تبدأ.`

**English body:**

> Follow products from discovery through cart and checkout, then explore how Store operations connect catalog, stock, purchasing, orders, customers, finance, and POS. Demo data demonstrates workflows; it is not customer proof.

**Arabic body:**

> تابع المنتجات من الاكتشاف إلى السلة والدفع، ثم استكشف كيف تربط عمليات المتجر الكتالوج والمخزون والمشتريات والطلبات والعملاء والمالية ونقطة البيع. البيانات التجريبية تشرح طريقة العمل ولا تمثل نتائج حقيقية لعملاء.

If the configured Demo URL points to Jizrak's current sandbox, add the paired note `No sign-up · Two-hour interactive workspace / من غير تسجيل · مساحة عمل تفاعلية لمدة ساعتين` and state that it opens the Demo Store admin. Omit this note for any other demo destination unless that behavior is independently verified.

**CTA:** `Explore the Demo / استكشف التجربة`

### 6.17 Final CTA

**English heading:** `Build your brand on roots that stay connected.`

**Arabic heading:** `ابنِ علامتك على جذور تفضل متصلة.`

**English body:** `Start with one Business and give every Store a clear place to grow.`

**Arabic body:** `ابدأ بنشاط تجاري واحد وامنح كل متجر مساحة واضحة للنمو.`

**Primary CTA:** `Start your Business / ابدأ نشاطك التجاري`

**Secondary CTA:** `Explore the Demo / استكشف التجربة`

### 6.18 Footer

**Lockup:** `Jizrak — جِذرك`

**English closing line:** `Your idea. Your brand. Your roots.`

**Arabic closing line:** `فكرتك. براندك. جذرك.`

**Footer links in both languages:**

- Features / المزايا
- Demo / التجربة
- Sign in / تسجيل الدخول
- Privacy / الخصوصية
- Terms / الشروط

**Copyright:** `© {currentYear} Jizrak — جِذرك`

Do not show Privacy or Terms as links until real destinations exist. Do not use `href="#"`.

---

## 7. Visual Direction: Rooted Infrastructure

### Design thesis

The visual language is **rooted infrastructure**: calm, capable, connected, and ready to grow. The page should feel like a precise operating system explained through one living structural diagram, not like an environmental brand or a generic SaaS dashboard.

### Signature element

The memorable element is a single continuous **root-to-ledger network**. It starts in the hero as the Business foundation, travels behind section boundaries as restrained SVG linework, branches into commerce workflows, and resolves at the final CTA. It is structural: each branch corresponds to a real product relationship.

This is the page's one aesthetic risk. Keep everything else restrained. Do not add floating blobs, glass panels, fake browser windows, random particle fields, or unrelated 3D objects.

### Composition

- Use asymmetric but balanced layouts.
- Use generous negative space for major claims and disciplined density for feature detail.
- Let rules, alignment, tonal fields, and the root network create structure.
- Alternate broad narrative bands with denser operational diagrams.
- Avoid a repetitive grid of interchangeable rounded cards.
- Keep maximum readable content width near `72rem`; allow the root artwork to bleed wider without affecting text measure.
- Body copy should remain approximately `45-70ch` per language.

### Color tokens

Use semantic custom properties. Do not scatter raw hex values through components.

| Token     | Light     | Dark      | Use                                            |
| --------- | --------- | --------- | ---------------------------------------------- |
| Forest    | `#153C2B` | `#78B88F` | Primary action, active structure, brand anchor |
| Deep root | `#0B2419` | `#09150F` | Hero depth and strongest canvas                |
| Growth    | `#4F9368` | `#70B889` | Connections, progress, positive emphasis       |
| Sprout    | `#A9C9A8` | `#3A6A4B` | Quiet highlights and diagram accents           |
| Limestone | `#F4F1E8` | `#15231B` | Main canvas                                    |
| Chalk     | `#FCFBF7` | `#1C2D23` | Raised or alternate surfaces                   |
| Root ink  | `#17221C` | `#F1F3ED` | Primary text                                   |
| Soil      | `#73513A` | `#C79773` | Warm secondary emphasis                        |
| Copper    | `#B66B45` | `#D18A63` | Sparse conversion or diagram accent            |

Forest is dominant. Soil and Copper are accents, not competing brand colors. Green communicates stability and healthy growth, not sustainability. Warning, error, information, and destructive colors remain semantically separate. Verify every state and text combination at WCAG AA contrast.

### Typography

- Display and marketing headings: **Alexandria**, with verified Arabic and Latin glyphs for all used weights.
- Body, controls, labels, and data: **IBM Plex Sans Arabic** and **IBM Plex Sans**.
- Fallback: `ui-sans-serif, system-ui, sans-serif`.
- Obtain Alexandria, IBM Plex Sans Arabic, and IBM Plex Sans WOFF2 files from their official upstream distributions, retain their license files in `public/fonts/licenses/`, pin the downloaded release or commit and checksums in the repository, and verify redistribution before launch. Until those reviewed assets exist, use the declared system fallbacks rather than downloading fonts at runtime.
- Load only used weights: Alexandria 500/600/700 and IBM Plex 400/500/600 are sufficient unless the final design proves otherwise.
- Use `font-display: swap` and metrics-compatible fallbacks where practical.
- Use tabular numerals for comparisons and metrics.
- Never use an editorial serif, especially the perfume Demo Store style, as Jizrak identity.

### Geometry and depth

- Small controls may use a restrained `0.5rem` radius.
- Content panels use `0-0.75rem` based on hierarchy, never oversized pills.
- Prefer one-pixel borders, tonal shifts, and spacing to shadows.
- Reserve shadow for sticky navigation, menus, and dialogs.
- Root linework stays behind content and never crosses interactive hit areas visibly.

### Iconography and imagery

- Use a consistent outlined icon family such as Lucide.
- Use icons only where they improve scanning; never use sixteen identical icon cards as the primary composition.
- Create original SVG root/network diagrams. Do not use generic leaf or tree stock imagery.
- Do not use perfume imagery. The perfume profile belongs only to a Demo Store, not Jizrak.
- Product UI imagery, if included, must be industry-neutral or clearly labeled as demo content.

### Themes

Support light, dark, and system preference. Persist explicit choice. Set `color-scheme`, `theme-color`, and all semantic tokens per theme. Dark mode must be independently tuned, not produced by color inversion.

---

## 8. GSAP Motion Specification

GSAP is required. Motion explains continuity and connection; it must never hide meaning or block interaction.

### Dependencies

- `gsap` version 3.x.
- `@gsap/react` for React lifecycle integration.
- Register `ScrollTrigger` only in the browser.
- Do not add paid GSAP plugins unless the project owner explicitly approves the license and dependency.

### React integration rules

- Use `useGSAP()` with a component scope so selectors cannot leak across sections.
- Register plugins once in a client-only module.
- Revert GSAP contexts on unmount.
- Recreate direction-sensitive timelines when the preferred locale changes, preserving the current scroll position.
- Use refs and scoped selectors rather than global class queries.
- Animate `transform`, `opacity`, and SVG stroke properties. Avoid layout-heavy animation of top, left, width, or height.
- Never animate React-controlled values with direct DOM writes when React also owns the same property.
- Content starts fully visible in server HTML and static CSS. After a scoped GSAP context is successfully created, use `fromTo()` to apply and animate initial states in the same layout phase. Wrap initialization so any exception immediately calls `gsap.set(scope, { clearProps: "all" })` and restores complete SVG strokes.
- Create one `gsap.matchMedia()` instance per scoped composition. On locale or breakpoint change, revert the current context and match-media instance, render the new DOM order, create one replacement instance, then call `ScrollTrigger.refresh()` in the next animation frame. Cleanup must call both context and match-media `revert()` so duplicate timelines and triggers cannot survive.

### Motion system

| Motion              | Trigger                            | Behavior                                                                                                                     | Reduced-motion behavior             |
| ------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Hero reveal         | First paint after fonts or timeout | Lockup, paired copy, CTAs, then network; under 1.2s                                                                          | Everything visible immediately      |
| Root draw           | Hero and root-map entry            | Animate `stroke-dashoffset` once                                                                                             | Render complete paths               |
| Workflow continuity | Root-map scroll                    | Highlight one real commerce path at a time                                                                                   | Static highlighted path plus labels |
| Section reveal      | First viewport entry               | Small logical-inline shift and fade; 250-450ms                                                                               | No shift or fade                    |
| Ledger separation   | Multi-Store section                | One Location path branches to two separate ledgers                                                                           | Static completed diagram            |
| Inventory flow      | Inventory section                  | The paired nodes `Receive / استلام`, `Reserve / حجز`, `Sell / بيع`, and `Assemble / تجميع` pulse once as their paths connect | Static numbered and bilingual flow  |
| Feature atlas       | User opens a group                 | Native open state changes immediately; inner content receives a fast opacity/transform accent                                | Instant open/close                  |
| Final resolution    | Final CTA enters                   | Root line resolves beneath CTA; no loop                                                                                      | Static line                         |

### ScrollTrigger rules

- Use one ScrollTrigger per narrative section at most, not one per sentence.
- Default to `once: true` for reveals.
- Do not use scroll-jacking, smooth-scroll replacement, mandatory pinning, or long scrub sequences.
- If a diagram is pinned on desktop, keep the pin short, disable it below tablet width, and confirm that keyboard focus never moves into visually hidden content.
- Call `ScrollTrigger.refresh()` after fonts settle and after locale-driven copy reflow.
- Kill triggers cleanly on unmount and in development hot reload.
- GSAP loading is fail-open. Never place `opacity: 0`, incomplete strokes, or off-screen transforms in static CSS or server HTML. If the GSAP chunk is blocked after hydration starts, a two-second watchdog clears animation-owned inline styles and restores all SVG paths to their final state.

### Reduced motion

Check `window.matchMedia("(prefers-reduced-motion: reduce)")` and use `gsap.matchMedia()` to build either the animated or static treatment. Under reduced motion:

- do not merely shorten animations;
- skip entrance opacity states entirely;
- render all paths and content in their final state;
- keep accordions functional without animated height;
- do not autoplay any decorative motion.

### Performance budget for motion

- Keep the root artwork as optimized inline SVG.
- Avoid filters, large blurred layers, and continuously moving paths.
- No perpetual animation after the initial story resolves.
- Verify animation on mid-range mobile hardware, not only desktop.
- The page must remain fully readable if GSAP fails to load.

---

## 9. Responsive Behavior

Design and test at content-driven breakpoints rather than targeting specific devices.

### Narrow mobile: approximately 320-479px

- One content column.
- Preferred language first; second language immediately below with a clear divider.
- Persistent header shows compact bilingual mark, locale control, and one primary action.
- Root artwork becomes a vertical flow with short branches; no pinning.
- Feature atlas uses native-feeling accordion rows.
- CTAs are full-width only when labels need the space.
- Minimum interactive target is 44 by 44 CSS pixels.

### Large mobile and tablet: approximately 480-1023px

- Paired copy may use two columns only when each language retains a readable measure.
- Diagrams can sit between heading and detail.
- Navigation remains in a disclosure until space is proven sufficient.
- No horizontal scroll from mixed-direction text, tables, or SVG.

### Desktop: approximately 1024-1439px

- Use asymmetrical two-column narrative sections.
- Keep one language visually primary according to preference while both remain legible.
- Root artwork can persist through adjacent sections.
- Feature atlas uses a two-column arrangement of the same native details elements used on mobile.

### Wide desktop: 1440px and above

- Do not stretch body copy.
- Let diagram negative space grow rather than increasing text widths.
- Cap navigation and content containers; permit only decorative SVG lines to bleed.

### Direction rules

- Use `margin-inline`, `padding-inline`, `inset-inline`, `border-inline`, and logical text alignment.
- Leading icons stay at inline start; chevrons and disclosure icons stay at inline end.
- Mirror arrows that communicate forward/back direction.
- Do not automatically mirror logos, charts, numerals, or diagrams whose topology has meaning.

---

## 10. Accessibility Requirements

Target WCAG 2.2 AA.

- Use semantic `header`, `nav`, `main`, `section`, `aside`, and `footer` landmarks.
- Add a localized skip link as the first focusable element.
- Maintain one `h1` and an ordered heading hierarchy.
- Every section has a stable ID and programmatically associated heading.
- Every bilingual fragment carries the correct `lang` and `dir` attributes.
- Decorative root artwork has `aria-hidden="true"` and `focusable="false"`. Any diagram conveying unique information needs an adjacent text equivalent.
- Locale and theme controls have explicit localized accessible names and state.
- The mobile menu and feature atlas expose `aria-expanded`, `aria-controls`, and keyboard behavior.
- Visible focus uses a three-pixel Growth-green outline with sufficient contrast and offset.
- Color is never the only way to identify a Store, ledger, state, or active path.
- Links look like links; buttons perform actions.
- Anchor navigation accounts for sticky-header offset and moves focus only when doing so improves accessibility.
- Do not announce decorative animation. Announce only user-requested state changes such as theme or locale when needed.
- Respect zoom to 200%, text spacing overrides, forced colors, and reduced motion.
- Keep all content available when JavaScript, fonts, animation, or nonessential artwork is delayed.

---

## 11. Technical Architecture for the New Repository

### Required stack and runtime

- Bun 1.2.x for local scripts and CI; commit `bun.lock` and the version in `.tool-versions` or an equivalent runtime file
- TanStack Start 1.x with server rendering and static prerendering for `/`
- React 19
- TypeScript 5.8.x with strict mode
- Vite 7.x
- Tailwind CSS 4.x backed by the semantic custom properties in this document
- GSAP 3 with `@gsap/react`
- i18next and react-i18next for preferred-locale UI strings
- Lucide React for interface icons
- Vitest and Testing Library
- Playwright for browser acceptance
- ESLint and Prettier

Pin exact compatible versions in the generated lockfile. Do not use `latest` in reproducible setup documentation. The repository must expose `bun run dev`, `bun run build`, `bun run preview`, `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run e2e`.

### Suggested source layout

```text
src/
  app/
    config.ts
    metadata.ts
  routes/
    __root.tsx
    index.tsx
  components/
    BilingualBlock.tsx
    Header.tsx
    Footer.tsx
    LocalePreference.tsx
    ThemeToggle.tsx
    RootNetwork.tsx
    SectionHeading.tsx
    FeatureAtlas.tsx
  content/
    landing.en.ts
    landing.ar.ts
    featureAtlas.ts
  hooks/
    useLocalePreference.ts
    useReducedMotion.ts
  motion/
    gsap.client.ts
    useHeroMotion.ts
    useRootStory.ts
    useSectionReveal.ts
  sections/
    HeroSection.tsx
    RootMapSection.tsx
    MultiStoreSection.tsx
    StorefrontSection.tsx
    CatalogSection.tsx
    InventorySection.tsx
    PurchasingSection.tsx
    OrdersSection.tsx
    PosSection.tsx
    CustomersSection.tsx
    FinanceSection.tsx
    StoreIdentitySection.tsx
    SafetySection.tsx
    FeatureAtlasSection.tsx
    DemoSection.tsx
    FinalCtaSection.tsx
  styles/
    fonts.css
    tokens.css
    globals.css
  test/
    setup.ts
public/
  icons/
  og/
  fonts/
e2e/
  landing.spec.ts
```

### Content model

Keep copy out of JSX. Every paired block uses a stable ID and typed content shape:

```ts
type BilingualText = {
  id: string;
  en: string;
  ar: string;
};
```

Long-form content may use arrays of `BilingualText`. Avoid raw HTML translation strings. If rich text is required, model allowed emphasis and links as typed segments so translations cannot inject markup.

### Configuration

Use public build-time environment variables only for nonsecret destinations and metadata:

```text
VITE_SITE_URL
VITE_START_BUSINESS_URL
VITE_DEMO_URL
VITE_SIGN_IN_URL
```

Validate them during development startup and before the production build. In production, require allowed absolute or same-origin destinations and fail the build if any CTA destination is missing. These values are public and must never contain credentials or secrets.

`VITE_SITE_URL` must be an HTTPS origin with no path, query, or fragment. The three CTA variables accept same-origin paths or HTTPS URLs and open in the same tab. Development alone may use the documented hash fallbacks. Add `bun run validate:config` and make `bun run build` invoke it first; the command must name each missing or invalid variable and exit nonzero in production mode. Optional legal URLs are separate nullable configuration values; when absent, remove the link and its adjacent separator together.

### Rendering and deployment

Use TanStack Start server rendering and prerender the root route to complete HTML during `bun run build`. The output must be deployable to an HTTPS JavaScript server/edge target supported by the chosen TanStack Start adapter; record that adapter and host in the new repository README before implementation begins. The root response contains all bilingual copy, metadata, links, and native details elements. React hydrates locale/theme controls and GSAP motion. Do not ship a client-only empty root or introduce a second localized route.

### Progressive enhancement

- Render complete content and usable links before GSAP starts.
- Anchor navigation and accordion content must remain usable if animation fails.
- Serve the prerendered root generated by the required TanStack Start build; core copy must exist in its HTML.
- Do not fetch core landing copy at runtime.

### Error boundary

Add a page-level error boundary with paired copy:

- English: `The page could not finish loading. Reload to try again.`
- Arabic: `تعذر إكمال تحميل الصفحة. أعد التحميل للمحاولة مرة أخرى.`

Core CTA links should remain available in the fallback when configuration is valid.

---

## 12. SEO, Metadata, and International Discoverability

### Default metadata

**English title:** `Jizrak — connected commerce for every Store`

**Arabic title:** `جِذرك — تجارة مترابطة لكل متجر`

**English description:**

> Run branded Stores, catalog, orders, inventory, purchasing, customers, finance, and POS in one Arabic-first commerce system built for Arab businesses.

**Arabic description:**

> أدر المتاجر بعلاماتها والكتالوج والطلبات والمخزون والمشتريات والعملاء والمالية ونقاط البيع في نظام تجاري واحد صُمم بالعربية أولاً لاحتياجات الأنشطة العربية.

### Requirements

- Set a canonical URL.
- Because both languages live on one URL, use one canonical page rather than fake locale alternates. Do not add `hreflang` entries pointing to nonexistent localized routes.
- Add Open Graph and X/Twitter metadata with a purpose-built Jizrak image, never a Demo perfume image.
- The social image must contain the canonical bilingual lockup and remain legible at common crops.
- Add Organization and WebSite JSON-LD only with verified legal name, URL, and logo. Do not add ratings, offers, pricing, or customer claims.
- Provide `robots.txt` and `sitemap.xml` for the deployed page.
- Add Jizrak favicon, mask icon where relevant, touch icon, and PWA icons; do not reuse Store or Demo branding.
- Use descriptive anchor text instead of repeated ambiguous "Learn more" links.
- Keep critical headings and product descriptions in initial HTML.
- Use the English title and description in the prerendered single-URL response and a bilingual Open Graph image. After hydration, update the document title and description to the preferred locale without changing the URL or history. Open Graph crawler metadata remains the stable prerendered version because social crawlers may not execute JavaScript.

---

## 13. Performance Requirements

Use these as implementation budgets, then validate them against the selected hosting environment rather than presenting them as product claims.

- Keep initial JavaScript small by splitting noncritical atlas behavior if needed; GSAP and required hero motion may remain in the main page bundle only if measured impact is acceptable.
- Inline or preload only the critical font subsets and avoid loading unused weights.
- Use optimized SVG for the root network and responsive AVIF/WebP for any raster demo imagery.
- Reserve dimensions for fonts, icons, and media to prevent layout shift.
- Lazy-load below-the-fold images and noncritical interactive modules.
- Do not lazy-render text in a way that removes it from search or no-script access.
- Avoid continuous animation, expensive filters, and large painted fixed backgrounds.
- Run Lighthouse or equivalent audits in both themes, both locale preferences, and a mobile profile.
- Measure Core Web Vitals in the deployed environment before establishing numeric release thresholds.

---

## 14. Analytics and Privacy

Analytics is optional and disabled until the owner approves a provider and consent policy.

If approved, track only decision-relevant events:

| Event                    | Properties                           |
| ------------------------ | ------------------------------------ | ---- | --------------------------------------- |
| `landing_cta_selected`   | `cta: start_business                 | demo | sign_in`, `section`, `preferred_locale` |
| `landing_nav_selected`   | `target_section`, `preferred_locale` |
| `landing_locale_changed` | `from`, `to`                         |
| `landing_theme_changed`  | `theme`                              |
| `feature_group_opened`   | `group_id`, `preferred_locale`       |

Do not collect typed content, names, emails, Store names, or fingerprinting data on this page. Respect applicable consent and Do Not Track decisions according to the selected analytics provider and legal policy.

---

## 15. Honest Claims Boundary

### Implemented capabilities eligible for launch copy after deployment verification

- Arabic/English and native RTL/LTR foundations, with broad localized Storefront journeys; do not imply that every admin and customer workflow has complete Arabic coverage.
- EGP-first and Egyptian commerce workflows.
- Multiple isolated branded Stores under one Business.
- Business-wide ownership and Store-specific staff roles.
- Shared physical Locations with separate Store inventory ledgers.
- Product variants and dependency-aware inventory.
- Inventory reservations, movements, receiving, assembly, and audit history. Do not claim a user-facing Location-transfer workflow until one is verified.
- Storefront, cash-on-delivery checkout, order management, and POS tied to inventory.
- Customer Store profiles, addresses, favorites, loyalty, reviews, and order history.
- Store configuration, bilingual SEO content, appearance, shipping rules, promotions, and notifications.
- Finance records and operational analytics.
- Installable Store PWA with cached assets and web push support when configured.
- Custom-domain registry and Store-aware host routing.
- Private Store media. Restricted encrypted platform recovery infrastructure may be mentioned only in platform-operations material, not as a Store-admin backup feature.

### Do not advertise as delivered

- Live Paymob card or wallet payment processing.
- External payment-provider refunds.
- Complete multicurrency presentation.
- Google or other social login.
- MFA, passkeys, or SMS authentication.
- Automated DNS verification or TLS provisioning.
- Integrated shipping carriers or live carrier tracking.
- Complete transactional email or WhatsApp delivery automation.
- Fully offline checkout, admin, inventory, or POS.
- Barcode scanner support.
- Public developer API, OAuth apps, integration marketplace, or ERP connectors.
- AI commerce features.
- Security, privacy, uptime, scale, or compliance certifications.
- Production-certification claims about every multi-tenant path.
- Customer loyalty redemption at checkout.
- A merchant-facing Store backup/import/reset workflow.

Do not create a "Coming soon" section for these items. Omit them from marketing unless the product status changes and evidence is re-verified.

---

## 16. Testing and Acceptance

### Automated component tests

- `BilingualBlock` renders both languages with correct `lang` and `dir`.
- Every English content ID has exactly one nonempty Arabic counterpart and every Arabic content ID has exactly one English counterpart.
- Locale preference changes order and emphasis without hiding either language.
- Theme control supports light, dark, and system modes and persists explicit choice.
- Header disclosure and Feature Atlas expose correct accessibility state.
- Every configured CTA receives a valid destination.
- Reduced-motion mode skips hidden initial states and GSAP timelines.
- Root diagram text equivalent includes every relationship conveyed visually.

### Browser journeys

Run at minimum in Chromium, Firefox, and WebKit:

1. Load in English preference, navigate every section, open every feature group, and activate each CTA.
2. Load in Arabic preference and repeat with RTL assertions.
3. Change locale halfway down the page; verify scroll position, focus, layout, and animation stability.
4. Change light/dark/system theme and verify persisted behavior.
5. Use keyboard only through skip link, desktop/mobile navigation, locale, theme, atlas, and CTAs.
6. Emulate reduced motion and verify all content is visible without animation.
7. Test at 320px, 375px, 768px, 1024px, 1440px, and 200% zoom.
8. Disable JavaScript or block GSAP and confirm content, anchors, and CTAs remain available.
9. Interrupt the GSAP chunk after hydration begins; verify the watchdog restores final opacity, transforms, and SVG strokes.
10. Simulate slow fonts and slow network; verify no blank hero or cross-language layout break.
11. Verify no horizontal overflow in either direction with the longest Arabic content.
12. Verify every anchor accounts for the sticky header.
13. Verify Store/Demo imagery never replaces Jizrak identity in metadata or icons.
14. With a screen reader, verify both preferred-locale heading orders, bilingual CTA names, and DOM reading order after a locale change.

### Accessibility checks

- Automated axe scan with zero serious or critical violations.
- Manual screen-reader pass in one desktop combination and one mobile combination.
- Heading and landmark review.
- Focus order and focus visibility review.
- Contrast review in both themes, including hover, active, visited, and focus states.
- Forced-colors review.
- Text-spacing and zoom review.
- Arabic pronunciation spot check using `lang="ar"` fragments.

### Content checks

- Both languages appear in every substantive section.
- No Arabic text is clipped or visually subordinate to unreadability.
- Canonical spelling **جِذرك** is used everywhere.
- Business, Store, Location, and Store ledger are never conflated.
- No unsupported claim from Section 15 appears.
- No placeholder CTA, legal link, testimonial, metric, or logo appears.
- Every feature in the Feature Atlas is represented accurately in its narrative section or detailed inventory.

### Build checks

- Type checking passes with strict TypeScript.
- Linting passes with no warnings.
- Unit/component tests pass.
- Production build passes.
- Browser tests pass in all configured projects.
- Bundle and font reports are reviewed.
- Metadata, canonical URL, sitemap, robots, social image, and icons resolve in production.

---

## 17. Implementation Sequence

### Phase 1: Foundation

1. Initialize the repository with React, TypeScript, Vite, styles, lint, formatting, Vitest, and Playwright.
2. Add strict environment validation for the four public URLs.
3. Add semantic color, spacing, type, radius, and theme tokens.
4. Load and verify Alexandria and IBM Plex font assets.
5. Implement document theme and locale preference without page content.
6. Add the content types and all approved bilingual copy.

### Phase 2: Static semantic page

1. Build the skip link, header, main landmarks, every section, final CTA, and footer.
2. Implement `BilingualBlock` and validate document outline and screen-reader behavior.
3. Build responsive layouts from 320px upward using logical properties.
4. Build the Feature Atlas with accessible no-animation behavior first.
5. Add all CTA destinations and metadata.

### Phase 3: Rooted-infrastructure artwork

1. Design the hero/root network as a semantic plan before drawing SVG.
2. Create diagrams for connected workflow, separate Store ledgers, inventory movement, and final resolution.
3. Add adjacent textual equivalents.
4. Optimize paths and confirm both directional compositions.

### Phase 4: GSAP

1. Add client-only GSAP registration and scoped React hooks.
2. Implement hero choreography.
3. Implement root drawing and one controlled workflow highlight per relevant section.
4. Add restrained section and atlas transitions.
5. Implement the complete reduced-motion branch at the same time.
6. Test cleanup, hot reload, route remount, resize, font load, and locale reflow.

### Phase 5: Quality and launch

1. Run content, accessibility, responsive, RTL, theme, and performance reviews.
2. Replace all development CTA URLs with verified production destinations.
3. Add owner-approved legal links and analytics only if available.
4. Generate Jizrak-only icons and social imagery.
5. Run the full acceptance matrix.
6. Deploy a preview, review it with Arabic and English readers, correct copy in context, and rerun affected checks.

---

## 18. Definition of Done

The landing page is complete only when:

- it is one coherent page rather than disconnected feature-card sections;
- it communicates the connected-commerce thesis in the first viewport;
- every substantive section visibly contains accurate English and Arabic;
- locale preference changes priority and direction without hiding content;
- the page works in LTR, RTL, light, dark, reduced motion, mobile, tablet, desktop, keyboard, and assistive-technology contexts;
- GSAP reinforces real product relationships and is not required to access content;
- the full verified feature inventory is discoverable in the page;
- incomplete capabilities are not marketed as delivered;
- CTA, canonical, legal, metadata, icon, and social-image destinations are real;
- no Store or Demo brand leaks into Jizrak identity;
- all automated and manual acceptance checks in this document pass; and
- an Arabic reviewer and an English reviewer approve the final copy in the rendered design.

---

## 19. Final Creative Guardrails

Use these as the last design review checklist.

- The page should feel like **commerce infrastructure with visible roots**, not a generic SaaS template.
- The hero must be a thesis, not a dashboard screenshot beside a headline.
- The continuous root-to-ledger network is the one signature effect; remove competing decoration.
- Avoid generic leaves, ornamental vines, eco claims, glassmorphism, neon, broad gradients, floating pill cards, and perfume imagery.
- Prefer clear operational consequences over adjectives such as seamless, revolutionary, powerful, or all-in-one.
- Keep the merchant's idea and brands central: **Jizrak is the foundation, not the hero.**
- End on the approved thought: **Your idea. Your brand. Your roots. / فكرتك. براندك. جذرك.**
