---
name: no-ai-slop-ar
description: Apply whenever creating, editing, translating, summarizing, or reviewing Arabic output text, even if the user prompt is in English. Produce natural, specific Arabic without generic AI filler, translationese, inflated rhetoric, or mechanical structure. Preserve the requested register, dialect, meaning, and writer's voice. In mixed-language output, apply to the Arabic passages. Not an AI-authorship detector.
---

# No slop in Arabic output

This skill governs the Arabic text you produce, not the language of these instructions. Use it as a writing-quality layer within the user's task. It applies to fresh answers and drafts as well as edits, translations, summaries, captions, emails, articles, explanations, and interface copy. Do not turn an ordinary Arabic answer into an editing report.

Write Arabic that belongs to its audience and purpose. By “slop,” mean wording that adds bulk, fake significance, or mechanical polish without useful meaning. Do not equate good grammar, formal Arabic, eloquence, or a particular word with AI authorship.

## Choose the mode without blocking the task

- **Write:** Produce the requested Arabic content directly. Silently apply the checks below. Do not ask for a draft when the user wants new content.
- **Edit:** Preserve meaning and voice; make the minimum effective changes. Return the edited text. Add a short «ما الذي تغيّر» only when useful and compatible with the requested format; omit it for copy-only requests.
- **Translate or summarize:** Preserve facts, qualification, and attribution. Reconstruct natural Arabic sentences instead of transferring source-language syntax. Follow the requested scope and length.
- **Audit:** When asked to flag slop without rewriting, quote each problematic passage, name the specific pattern, explain the loss of meaning or clarity, and give a brief repair direction. Do not rewrite the whole text or estimate an AI probability. If no meaningful problem appears, say so.

Use the audience, channel, and language preference already established. Ask a focused question only if missing information would materially change the result. If an editing request lacks the draft, ask for it. For ordinary new Arabic output with no other register cues, use accessible contemporary Modern Standard Arabic (MSA).

## Preserve the Arabic the user actually wants

- Follow an explicit dialect or register request. Preserve an existing draft's consistent dialect and intentional code-switching. Do not turn Egyptian, Gulf, Levantine, Maghrebi, or another variety into MSA merely to sound polished.
- Do not manufacture a hybrid dialect by scattering «مش»، «مو»، «وايد»، «بزاف» across unrelated voices. A dialect is more than a few vocabulary substitutions. Do not infer one from the user's name or location.
- Match the genre. A service notice needs direct instructions; a research summary needs careful qualifications; a personal message can be warm or uneven; a literary piece may need imagery, repetition, or rhythm.
- Preserve bluntness, humor, personal asides, legitimate uncertainty, and strong opinions that belong to the writer. Do not invent lived experience, feelings, anecdotes, or opinions to make text seem human.
- Avoid overcorrection. Arabic nominal sentences, passive voice, emphasis, parallelism, metaphor, and repetition can be effective. Change them for an identifiable problem, not because an English style rule dislikes their shape.

## Core decisions

1. **Keep the information.** Preserve who did what, to whom, when, under what conditions, with what uncertainty. Never add invented metrics, mechanisms, examples presented as facts, or sources to replace vague prose.
2. **Remove portable filler.** If a sentence fits nearly any product, country, or topic unchanged, replace it with an available subject-specific fact or delete it. If the requested claim needs evidence that is missing, ask or qualify it; do not fill the gap with praise.
3. **Start where the content starts.** Remove ceremonial introductions unless the genre needs them. Preserve a story or personal opening that earns its space.
4. **Choose the ordinary precise expression.** Prefer the term the audience understands. Keep necessary technical vocabulary and explain it when useful. Do not make Arabic artificially grand or replace familiar loanwords with obscure coinages.
5. **Let sentences follow the thought.** Split tangled clauses; retain clear long sentences. Do not enforce a word-count ceiling, identical paragraph lengths, or a sequence of clipped fragments.
6. **Preserve logical relations.** Removing a connector must not erase a cause, concession, contrast, condition, or sequence. Shorter is not automatically clearer.
7. **Use structure for the reader.** Lists suit parallel items and instructions; headings suit actual sections. Avoid decorating short answers with an introduction, several tiny sections, and a recap.

## Arabic patterns to inspect

These are editorial watch patterns, not proven AI fingerprints or unconditional banned strings. The examples illustrate decisions; do not insert their facts into another draft.

### 1. Ceremonial openings and delayed meaning

Inspect «في عالمنا اليوم»، «في ظل التطور المتسارع»، «لا يخفى على أحد»، «مما لا شك فيه»، «من الجدير بالذكر»، «لا يمكن إنكار أن».

Delete the preamble when the sentence works without it. Keep a real time frame or condition when it changes the claim. For example, «في ظل انقطاع الكهرباء، توقفت المضخات» supplies a relevant circumstance.

### 2. Inflated praise and abstract promises

Inspect «نقلة نوعية»، «حل ثوري ومتكامل»، «آفاق واعدة»، «الارتقاء بتجربة المستخدم»، «إطلاق العنان للإمكانات»، «تعزيز الكفاءة والفعالية»، «ركيزة أساسية»، «دور محوري».

Ask what changed or what the thing does. State the available feature, outcome, mechanism, or limitation. Do not automatically substitute another abstract verb such as «يعزّز» or «يسهم».

### 3. Administrative verb padding and noun chains

Prefer «أرسل الفريق التقرير» over «قام الفريق بعملية إرسال التقرير». Inspect repeated «يتم»، «تم»، «يقوم بـ»، «القيام بعملية»، and chains of «عملية تنفيذ إجراءات تحسين…».

Preserve aspect and agency. «تم البناء» can mean construction was completed; «قام من مقعده» describes standing up. If the actor is unknown or irrelevant, natural passive Arabic such as «أُجّل الاجتماع» is fine. Do not invent a subject to force active voice. Keep useful technical nouns such as «إدارة المخاطر».

### 4. Translationese and unnecessary scaffolding

Rebuild unnatural source-language phrasing, redundant pronouns, and connector chains. «أنا أعتقد أن هذا هو الخيار الذي يمكنه أن يساعدنا» may become «أعتقد أن هذا الخيار يساعدنا» when the extra emphasis is not intended.

Do not insert «هو» into every nominal sentence. Keep it when it distinguishes or emphasizes the subject. Avoid literal metaphors such as «نقل المشروع إلى المستوى التالي» when a concrete next step is available. Keep established terminology and natural borrowings.

### 5. Stacked transitions without a real relation

Inspect repeated «علاوة على ذلك»، «بالإضافة إلى ذلك»، «وفي هذا السياق»، «ومن هذا المنطلق»، «وعليه»، «حيث إن»، «الأمر الذي» at paragraph starts or between every clause.

Use a connector when it names the actual relation; otherwise join directly or start a new sentence. Do not remove Arabic «و» mechanically or replace every occurrence with a period. Do not use «وبالتالي» to manufacture causation.

### 6. Synonym piles and empty three-part lists

Inspect «يسهم في تطوير وتحسين وتعزيز…» and «بكل سهولة ويسر وسلاسة». Keep distinctions that matter; collapse words that perform the same job. Preserve useful enumeration, deliberate rhetorical repetition, and fixed expressions that fit the voice.

Use the same technical term for the same thing. Do not cycle through «النظام»، «المنصة»، «الحل» just to avoid repeating a noun if readers may infer different referents.

### 7. Commentary that substitutes for explanation

Inspect «مما يعكس التزامنا الراسخ»، «وهو ما يؤكد أهمية»، «وهنا تكمن الأهمية»، «هذه النقطة أعمق مما تبدو».

Remove an unsupported interpretation. If the draft contains a real consequence, state it. If interpretation is the user's task, provide the reasoning rather than deleting analysis indiscriminately.

### 8. Fake discovery, drama, and contrast

Inspect «ما لا يخبرك به أحد»، «السر الذي يغفل عنه الجميع»، «المفاجأة؟»، «الحقيقة الصادمة»، «الأمر ليس س، بل ص»، and dramatic colon reveals.

State the actual claim directly unless the contrast corrects a plausible misunderstanding. Keep meaningful negation: «الخدمة مجانية للأفراد، لكنها مدفوعة للشركات» expresses an essential distinction. A real question, interview, FAQ, or teaching dialogue need not lose its question-and-answer structure.

### 9. Unanchored authority and exaggerated certainty

Inspect «أثبتت الدراسات»، «أجمع الخبراء»، «تؤكد الأبحاث» without a source, and sweeping «دائمًا»، «بلا شك»، «الأفضل على الإطلاق».

Retain source attribution and uncertainty. Ask for a missing source when it is necessary. Do not convert «قد يساعد» into «يضمن» or attach a citation that supports only a neighboring claim. Opinion is allowed when presented as opinion.

### 10. Manufactured warmth and stock endings

Do not prepend routine answers with exaggerated praise of the question or add canned offers and motivational slogans. Warmth should fit the relationship and task.

Inspect «وفي الختام»، «نستنتج مما سبق»، and final paragraphs that repeat the answer. End at the last useful detail or requested next step. Keep summaries in long reports, executive summaries, or any format that needs them. Preserve a natural greeting or sign-off in correspondence.

## Arabic mechanics and mixed-language text

- Correct errors in spelling, agreement, reference, and punctuation according to the selected register. Do not apply MSA case or grammar expectations to dialect writing.
- In ordinary Arabic prose use Arabic punctuation where appropriate: «،»، «؛»، «؟». Keep punctuation attached to the preceding word, with normal spacing afterward. Preserve syntax inside code, URLs, formulas, and exact identifiers.
- Use diacritics selectively to resolve ambiguity in ordinary prose. Retain full vocalization when requested or required by the text's educational, literary, or religious purpose. Do not strip marks from quotations or alter quoted wording silently.
- Keep numerals, units, dates, names, and technical terms consistent with the requested locale or existing document. Do not assume one numeral system is required for all Arabic readers.
- Preserve English product names and code tokens when needed. For a technical audience, introduce an Arabic term with its English equivalent once if helpful; do not repeat both in every sentence.
- For rendered artifacts, set Arabic prose direction appropriately and check embedded Latin text and numbers. Never reverse characters by hand or insert decorative tatweel to imitate natural Arabic. This is a presentation check, not a reason to modify unrelated application code.
- Avoid decorative bold, excessive exclamation marks, repetitive ellipses, and dashes used to prop up every sentence. No arbitrary quota is needed; use the punctuation the sentence requires.

## Examples and review

Read [Arabic editing examples](#arabic-editing-examples) when choosing among repairs or preserving legitimate Arabic rhetoric. Before returning substantive Arabic output, silently use the relevant checks in [Arabic output review](#arabic-output-review); a one-line reply needs only a proportionate quick pass. Fix concrete issues without repeatedly polishing away character.

For source provenance and limits of the research, read [Research basis and limits](#research-basis-and-limits) when explaining, maintaining, or extending the skill. The phrase watchlist and examples are editorial heuristics, not a statistically validated inventory of Arabic AI vocabulary. No browsing is required merely to apply this skill; research factual claims when the underlying task calls for it.

## Arabic editing examples

These examples were written for this skill. They are not quotations from the research or evidence that a phrase was produced by AI. Repair the actual problem; do not apply replacements mechanically.

### Fresh Arabic output from an English prompt

Request: “Write an Arabic notice. Our library will close on Thursday for maintenance and reopen Friday.”

Output:

> تُغلق المكتبة يوم الخميس للصيانة، وتفتح أبوابها مجددًا يوم الجمعة.

No draft request, ceremonial introduction, invented opening time, or change report is needed.

### Empty opening with known facts

Draft:

> في ظل التطور المتسارع الذي يشهده عالمنا اليوم، يسرنا أن نقدم لكم ميزة مبتكرة تتيح حفظ المسودات تلقائيًا كل دقيقة.

Edit:

> تحفظ الميزة الجديدة المسودات تلقائيًا كل دقيقة.

The feature and interval already exist in the draft. Delete the general opening and unsupported praise.

### Vague benefit without supporting details

Draft:

> يساعد التطبيق في إدارة المهام، ويُحدث نقلة نوعية تعزّز الكفاءة والفعالية بصورة غير مسبوقة.

Edit:

> يساعد التطبيق في إدارة المهام.

Do not invent reminders, productivity percentages, or a time saving. If specific benefits are required for the assignment, ask which functions or results support them.

### Administrative padding

Draft:

> قام الفريق بإجراء مراجعة للطلبات، ثم قام بإرسال الردود إلى أصحابها.

Edit:

> راجع الفريق الطلبات، ثم أرسل الردود إلى أصحابها.

The sequence and known actor remain intact. In contrast, preserve «اكتمل بناء الجسر» when completion is the point; do not reduce it to a statement that construction merely happened.

### Repeated transitions

Draft:

> يحفظ التطبيق المسودات تلقائيًا. علاوة على ذلك، يتيح استعادتها. وفي هذا السياق، يمكن مشاركة المسودة مع الفريق.

Edit:

> يحفظ التطبيق المسودات تلقائيًا ويتيح استعادتها ومشاركتها مع الفريق.

The functions are parallel. No causal or temporal link has been invented.

### Keep uncertainty

Draft:

> من المهم الإشارة إلى أن هذا التعديل قد يقلّل وقت الانتظار، لكننا لم نختبره بعد.

Edit:

> قد يقلّل هذا التعديل وقت الانتظار، لكننا لم نختبره بعد.

The qualification is essential. «سيقلّل» and «يضمن» would change the claim.

### Preserve the dialect and personality

Egyptian draft:

> بصراحة، أنا جرّبت التطبيق يومين ومش فاهم ليه لازم أعمل حساب عشان أكتب ملاحظة.

Decision: Keep it as written unless the user requests a different register. «بصراحة» and «مش فاهم» fit the voice. Converting it to «لم يتضح لي سبب اشتراط إنشاء حساب» would remove its character.

### Keep useful contrast and nominal sentences

> الخدمة مجانية للأفراد، لكنها مدفوعة للشركات.

> المشكلة في موعد التسليم، لا في جودة العمل.

Decision: Keep both when they express the intended distinction. Do not remove the pricing condition or turn every nominal sentence into a verbal one.

### Keep a meaningful cause and an unknown actor

> تأخّر القطار، لذلك فاتني الاجتماع.

> أُجّل الاجتماع إلى الأحد.

Decision: «لذلك» conveys causation; the passive sentence does not require an invented organizer.

### Preserve intentional rhetoric in the right genre

Line in a requested speech:

> نريد مدرسة تفتح أبوابها للجميع، ومكتبة تفتح عقولنا على الأسئلة.

Decision: The parallelism and metaphor can serve the speech. Do not replace them with administrative prose merely because they are polished.

### Audit without claiming authorship

Passage:

> لا شك أن منصتنا الرائدة تمثل نقلة نوعية تفتح آفاقًا غير مسبوقة.

Possible audit:

> «لا شك»: يقين لا يسنده النص. احذف التوكيد أو قدّم ما يبرّره.
>
> «منصتنا الرائدة… آفاقًا غير مسبوقة»: مديح عام لا يوضح ما تقدمه المنصة. اذكر وظيفة أو نتيجة موثّقة.

Do not add “90% AI-generated,” invent features, or rewrite the entire passage when the user requested only an audit.

## Arabic output review

This checklist was authored for this adaptation; the original attachment's referenced `eval.md` was not supplied.

Use a proportionate silent review before delivery. Fix actual failures without forcing every text into the same style. Do not output the checklist unless requested.

### Acceptance checks

- **Task and mode:** Did the response fulfill the actual writing, editing, translation, summary, or audit request? An English prompt requesting Arabic must produce Arabic without asking for a draft. Copy-only output must contain no editing report.
- **Meaning:** Are facts, conditions, quantities, dates, attribution, agency, and uncertainty preserved? Did any specific detail appear without support? An illustrative hypothetical must remain identifiable as such.
- **Voice:** Is the requested register or dialect consistent? Were natural humor, bluntness, emphasis, and useful personal asides preserved? Was any personal experience invented?
- **Arabic phrasing:** Does the text read naturally in the chosen Arabic variety? Are translated scaffolding, tangled noun chains, ambiguous references, or unnecessary verb padding repaired?
- **Information density:** Does each passage add content, evidence, necessary context, voice, or a useful action? Have vague praise, empty interpretation, and redundant transition chains been removed?
- **Logic:** Are meaningful contrast, causation, sequence, negation, and qualifications intact? Have natural nominal sentences, passive voice, or deliberate rhetorical repetition been changed without a reason?
- **Presentation:** Do punctuation, diacritics, terminology, numerals, and embedded Latin strings fit the task? If the artifact is rendered, is mixed-direction text readable?
- **Ending:** Does the ending do useful work? Is a recap present only when the length, genre, or user request calls for one?
- **Audit integrity:** Are findings supported by actual quotations and concrete editorial problems, without an authorship verdict or detector probability?

### Behavioral regression cases for future revisions

Use these as practical probes when changing the skill. Equivalent natural wording is acceptable; these are not exact-string tests.

1. English prompt: “Write a short Arabic notice: the library closes Thursday for maintenance and reopens Friday.” Expect an Arabic notice containing both days and the reason, no invented times, no request for a draft, and no change report.
2. Arabic copy-only edit: «عدّل النص فقط: قام الفريق بإرسال التقرير يوم الاثنين.» Expect a direct Arabic sentence retaining the actor, report, and day, with no commentary.
3. Egyptian edit: «بصراحة، أنا جرّبت التطبيق يومين ومش فاهم ليه لازم أعمل حساب عشان أكتب ملاحظة.» Expect preservation of dialect, frustration, and meaning; no forced formalization.
4. Unsupported marketing: «منصتنا تحدث نقلة نوعية غير مسبوقة في إدارة المهام.» Expect removal or questioning of unsubstantiated claims; no invented features or percentages.
5. Qualifying clause: «قد يفيد هذا التعديل، لكننا لم نختبره بعد.» Expect preservation of both uncertainty and the lack of testing.
6. Legitimate contrast: «الخدمة مجانية للأفراد، لكنها مدفوعة للشركات.» Expect retention of the pricing distinction.
7. Unknown actor: «أُجّل الاجتماع إلى الأحد.» Expect no invented organizer and no forced active construction.
8. Literary request with deliberate parallelism: expect genre-sensitive preservation instead of mechanical deletion of all metaphor and repeated structure.
9. Audit-only request: expect quoted problems and brief repair directions, not a full rewrite or a percentage of AI authorship.
10. Mixed output with `API`, an exact code identifier, and Arabic explanations: expect natural Arabic around unchanged tokens; no conversion of executable syntax to Arabic punctuation.

A grammatical, specific Arabic passage may need no changes. Keeping it is a valid outcome.

## Research basis and limits

Researched on 6 September 2026. This is an adaptation of the user-provided “No AI slop.md” for Arabic output, including new writing. It is not a translation of that file or an authorship-classification system.

### Sources that informed the adaptation

#### Arabic concision and rhetorical context

[Al Jazeera Media Institute, دليل الإيجاز في الكتابة الصحافية (2020)](https://institute.aljazeera.net/sites/default/files/2020/دليل%20الإيجاز%20في%20الكتابة%20الصحافية%20-%20Web.pdf), especially printed pages 2–4, 7–9.

The guide treats concision as preserving meaning with less excess and distinguishes unnecessary expansion from useful explanation or emphasis. Its scope is journalism.

Application: inspect what a phrase contributes, preserve deliberate rhetoric where the genre warrants it, and avoid a blanket ban on repetition. The skill extends these editorial judgments to other genres; that extension is our design choice, not a claim that the guide prescribes one style for all Arabic.

#### Natural Arabic rather than transferred syntax

[World Bank, Translation Style Guide: Arabic, version 1.0](https://www.monabaker.org/wp-content/uploads/2014/09/Translation_Style_Guide_Arabic.pdf), printed page 3; a copy of the institution-authored guide hosted by Mona Baker.

The guide rejects word-for-word translation and transferred word order, emphasizing accuracy, consistency, and readability. It allows nominal sentences where they avoid ambiguity.

Application: reconstruct idiomatic Arabic and keep necessary terminology. Do not import the guide's institutional restriction to formal Arabic into personal writing or dialect requests. Its house preference for verbal sentences is not a universal grammar rule.

#### Script, numerals, and mixed direction

[W3C, Arabic & Persian Layout Requirements, Group Draft Note, 2 October 2025](https://www.w3.org/TR/2025/DNOTE-alreq-20251002/), sections 2.4.1 and 3.

This draft describes Arabic directionality, left-to-right number runs and embedded Latin text, and regional variation in numeral practices. It concerns layout, not literary quality, and is a work in progress rather than an endorsed W3C standard.

Application: preserve numeral conventions and check mixed-direction presentation when delivering rendered Arabic artifacts. Do not treat one region's formatting as universal.

#### Why style is not proof of AI authorship

[AI text detectors and the misclassification of slightly polished Arabic text, Journal of Big Data (2026)](https://doi.org/10.1186/s40537-026-01492-8), abstract and discussion.

The study reports misclassification of human-written Arabic after slight AI polishing. Its additional controlled analysis found no consistent detector response to individual stylistic changes; that experiment had a limited sample.

Application: flag inspectable writing problems, not a supposed author. Do not promise detector avoidance or use a detector score as the acceptance criterion.

[Ezzini et al., AbjadGenEval, ACL Anthology (2026)](https://aclanthology.org/2026.abjadnlp-1.68/), abstract.

This shared task benchmarks AI-text detection in Arabic-script languages and reports cross-domain generalization challenges.

Application: do not transfer benchmark performance to an arbitrary caption, personal message, or dialect passage.

### What the evidence does not establish

None of these sources establishes a universal blacklist of Arabic “AI words.” The watchlist, before-and-after examples, MSA fallback, and output-mode choices are editorial design decisions informed by the original skill and the user's requested scope. They must be evaluated in context.

The original attachment refers to `eval.md` but does not include it. The embedded checklist was newly authored for this adaptation.

Microsoft's official Arabic style-guide link was located, but its PDF could not be retrieved through the available browsing path. Its contents are not relied on here.
