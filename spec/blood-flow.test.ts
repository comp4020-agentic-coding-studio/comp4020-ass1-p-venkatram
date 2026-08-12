import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// This week's spec: "the visitor does something that changes what they see".
// The core interaction is picking a stage (click, or scroll one into view),
// which sets [data-testid="diagram"]'s data-active-stage and reveals that
// stage's flow path. jsdom doesn't run scroll or IntersectionObserver, so
// this only asserts the static contract the interaction depends on; the
// live behaviour (captions updating, blood cells animating) is checked by
// hand in the browser at both marking viewports.
const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;

const STAGE_IDS = ["1", "2", "3", "4", "5", "6"];

describe("blood flow explainer", () => {
  it("has a diagram with a default active stage", () => {
    const diagram = doc.querySelector('[data-testid="diagram"]');
    expect(diagram).toBeTruthy();
    expect(diagram?.getAttribute("data-active-stage")).toBe("1");
  });

  it("has a live caption region describing the active stage", () => {
    const caption = doc.querySelector('[data-testid="caption"]');
    expect(caption?.getAttribute("role")).toBe("status");
    expect(caption?.textContent?.trim()).not.toBe("");
  });

  it("gives every stage a real, focusable button the visitor can click", () => {
    for (const id of STAGE_IDS) {
      const section = doc.querySelector(`[data-testid="stage-${id}"]`);
      expect(section, `stage ${id} section is missing`).toBeTruthy();

      const button = section?.querySelector(`button[data-stage-target="${id}"]`);
      expect(button, `stage ${id} has no button wired to data-stage-target`).toBeTruthy();
    }
  });

  it("has one flow path per stage, ready to be revealed", () => {
    for (const id of STAGE_IDS) {
      const flow = doc.querySelector(`#flow-${id}`);
      expect(flow, `#flow-${id} is missing from the diagram`).toBeTruthy();
      expect(flow?.querySelector("path[d]")).toBeTruthy();
    }
  });
});
