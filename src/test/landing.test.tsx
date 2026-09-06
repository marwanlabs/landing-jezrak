import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BilingualBlock } from "../components/BilingualBlock";
import {
  PreferenceProvider,
  readLocale,
  readTheme,
  usePreferences,
} from "../app/preferences";
import { ThemeControl } from "../components/Header";
import { Disclosure } from "../components/Disclosure";
import { sections, copy, pair, type BilingualText } from "../content";
import { validateConfig } from "../../scripts/config-rules";
function Switch() {
  const { setLocale } = usePreferences();
  return <button onClick={() => setLocale("ar")}>Arabic</button>;
}
describe("bilingual content", () => {
  it("has unique IDs and nonempty paired copy throughout substantive content", () => {
    const blocks: BilingualText[] = [];
    for (const s of sections.filter(
      (s) => !["header", "footer"].includes(s.id),
    )) {
      blocks.push(s.heading, s.body);
      if (s.eyebrow.en) blocks.push(s.eyebrow);
      if (s.id !== "features") blocks.push(...s.details);
      if (s.groups)
        blocks.push(...s.groups.flatMap((g) => [g.name, g.inventory]));
    }
    expect(new Set(blocks.map((b) => b.id)).size).toBe(blocks.length);
    for (const block of blocks) {
      expect(block.en.trim(), block.id).not.toBe("");
      expect(block.ar.trim(), block.id).not.toBe("");
      expect(block.ar, block.id).toMatch(/[\u0600-\u06ff]/);
    }
    expect(sections.find((s) => s.id === "features")?.groups).toHaveLength(17);
  });
  it("renders only the selected language while preserving the heading ID", async () => {
    const { container } = render(
      <PreferenceProvider>
        <Switch />
        <BilingualBlock
          heading="h2"
          id="stable-heading"
          text={pair("test", "Connected", "مترابط")}
        />
      </PreferenceProvider>,
    );
    expect(screen.getByRole("heading", { name: "Connected" })).toHaveAttribute(
      "dir",
      "ltr",
    );
    expect(container.querySelector(".bilingual")?.children).toHaveLength(1);
    expect(screen.queryByText("مترابط")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Arabic" }));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "مترابط" })).toHaveAttribute(
        "id",
        "stable-heading",
      ),
    );
    expect(container.querySelector(".bilingual")?.children[0]).toHaveAttribute(
      "lang",
      "ar",
    );
    expect(container.querySelector(".bilingual")?.children).toHaveLength(1);
    expect(screen.queryByText("Connected")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });
  it("persists all three theme choices", async () => {
    render(
      <PreferenceProvider>
        <ThemeControl />
      </PreferenceProvider>,
    );
    for (const theme of ["dark", "light", "system"]) {
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: theme },
      });
      await waitFor(() =>
        expect(localStorage.getItem("jizrak.theme")).toBe(theme),
      );
    }
  });
  it("exposes independent native disclosure state", async () => {
    render(
      <Disclosure id="details-test" label={copy.detail}>
        <p>Detail content</p>
      </Disclosure>,
    );
    const summary = screen.getByText(copy.detail.en).closest("summary")!;
    expect(summary).toHaveAttribute("aria-controls", "details-test-panel");
    const details = summary.parentElement as HTMLDetailsElement;
    details.open = true;
    fireEvent(details, new Event("toggle"));
    await waitFor(() =>
      expect(summary).toHaveAttribute("aria-expanded", "true"),
    );
    expect(screen.getByText("Detail content")).toBeInTheDocument();
  });
});
describe("preferences", () => {
  it("applies valid stored choice before browser language", () => {
    expect(readLocale("en", "ar-EG")).toBe("en");
    expect(readLocale("ar", "en-US")).toBe("ar");
    expect(readLocale("invalid", "ar-EG")).toBe("ar");
    expect(readLocale(null, "fr")).toBe("en");
  });
  it("ignores invalid theme preferences", () => {
    expect(readTheme("invalid")).toBe("system");
    expect(readTheme(null)).toBe("system");
  });
});
describe("production URL validation", () => {
  const valid = {
    VITE_SITE_URL: "https://jizrak.example",
    VITE_START_BUSINESS_URL: "/start",
    VITE_DEMO_URL: "https://demo.jizrak.example/",
    VITE_SIGN_IN_URL: "/sign-in",
  };
  it("reports every missing production destination", () => {
    expect(() => validateConfig({})).toThrow(
      /VITE_SITE_URL[\s\S]*VITE_START_BUSINESS_URL[\s\S]*VITE_DEMO_URL[\s\S]*VITE_SIGN_IN_URL/,
    );
  });
  it("accepts HTTPS URLs and same-origin paths", () =>
    expect(() => validateConfig(valid)).not.toThrow());
  it.each([
    "#start",
    "//example.com",
    "http://example.com",
    "javascript:alert(1)",
    "https://user:pass@example.com",
    "/\\evil.com",
    "/with space",
  ])("rejects invalid or unsafe CTA %s", (url) =>
    expect(() =>
      validateConfig({ ...valid, VITE_START_BUSINESS_URL: url }),
    ).toThrow(/VITE_START_BUSINESS_URL/),
  );
  it.each([
    "https://example.com/path",
    "https://example.com/?q=1",
    "https://example.com/#a",
  ])("rejects non-origin canonical %s", (url) =>
    expect(() => validateConfig({ ...valid, VITE_SITE_URL: url })).toThrow(
      /VITE_SITE_URL/,
    ),
  );
  it("permits missing values in development only", () =>
    expect(() => validateConfig({}, false)).not.toThrow());
});
