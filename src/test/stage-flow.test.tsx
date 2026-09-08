import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PreferenceProvider } from "../app/preferences";
import { StageFlow, type Stage } from "../components/StageFlow";
import { pair } from "../content";

const stages: Stage[] = [
  { id: "one", label: pair("one", "One", "الأولى"), description: pair("one-body", "First detail", "التفصيل الأول") },
  { id: "two", label: pair("two", "Two", "الثانية"), description: pair("two-body", "Second detail", "التفصيل الثاني") },
  { id: "three", label: pair("three", "Three", "الثالثة") },
];

describe("StageFlow", () => {
  it("selects one active detail with click and keyboard navigation", () => {
    render(
      <PreferenceProvider>
        <StageFlow mode="active-rail" stages={stages} />
      </PreferenceProvider>,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("First detail")).toBeInTheDocument();
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Second detail")).toBeInTheDocument();
    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByText("Three").length).toBeGreaterThan(0);
    fireEvent.keyDown(tabs[2], { key: "Home" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("keeps the operational story ordered and non-interactive", () => {
    render(
      <PreferenceProvider>
        <StageFlow mode="operational-story" stages={stages} />
      </PreferenceProvider>,
    );
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      expect.stringContaining("One"),
      expect.stringContaining("Two"),
      expect.stringContaining("Three"),
    ]);
  });

  it("supports a compact circular-style rail without a detail panel", () => {
    render(
      <PreferenceProvider>
        <StageFlow mode="active-rail" stages={stages} markerStyle="circle" showPanel={false} />
      </PreferenceProvider>,
    );
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-pressed", "true");
  });
});
