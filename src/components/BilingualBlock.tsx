import type { ElementType } from "react";
import { usePreferences } from "../app/preferences";
import type { BilingualText } from "../content";
export function BilingualBlock({
  text,
  className = "",
  heading,
  id,
  inline = false,
}: {
  text: BilingualText;
  className?: string;
  heading?: "h1" | "h2" | "h3";
  id?: string;
  inline?: boolean;
}) {
  const { locale } = usePreferences();
  const Primary: ElementType = heading || (inline ? "span" : "p");
  const Wrapper = inline ? "span" : "div";
  return (
    <Wrapper
      className={`bilingual ${inline ? "inline-pair" : ""} ${heading ? "heading-pair" : ""} ${className}`}
      data-content-id={text.id}
    >
      <Primary
        id={id}
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="primary-language"
      >
        {text[locale]}
      </Primary>
    </Wrapper>
  );
}
