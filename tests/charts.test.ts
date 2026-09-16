import { describe, expect, test } from "bun:test";
import { initChartHover } from "../js/charts.js";

function chartFixture(data) {
  const children = [];
  const listeners = new Map();
  const attributes = new Map([
    ["data-oc-hover", data],
    ["data-oc-hover-unit", "events"],
  ]);
  const band = {
    dataset: {},
    getAttribute: (name) => attributes.get(name),
    getBoundingClientRect: () => ({ left: 20, width: 300 }),
    append: (...elements) => children.push(...elements),
    addEventListener: (name, listener) => listeners.set(name, listener),
  };
  const document = {
    querySelectorAll: () => [band],
    createElement: () => ({ hidden: false, style: {}, textContent: "" }),
  };
  return { attributes, band, children, document, listeners };
}

function withChart(data, run) {
  const fixture = chartFixture(data);
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", { configurable: true, value: fixture.document });
  try {
    run(fixture);
  } finally {
    if (previous) Object.defineProperty(globalThis, "document", previous);
    else delete globalThis.document;
  }
}

describe("chart hover", () => {
  test("shows the matching period and numeric string value, and binds only once", () => {
    withChart('[["Monday",1200],["Tuesday","3400"]]', ({ document, children, listeners }) => {
      initChartHover(document);
      initChartHover(document);
      expect(children).toHaveLength(2);
      const [cursor, tip] = children;
      listeners.get("mousemove")({ clientX: 20 });
      expect(tip.textContent).toBe("Monday · 1,200 events");
      expect(tip.hidden).toBe(false);
      expect(cursor.style.left).toBe("75.0px");
      listeners.get("mousemove")({ clientX: 320 });
      expect(tip.textContent).toBe("Tuesday · 3,400 events");
      expect(cursor.style.left).toBe("225.0px");
      listeners.get("mouseleave")();
      expect(tip.hidden).toBe(true);
      expect(cursor.hidden).toBe(true);
    });
  });

  for (const data of [
    "{",
    "null",
    "[]",
    "[null]",
    "[42]",
    '["Monday"]',
    '[[]]',
    '[["Monday"]]',
    '[["Monday",1],null]',
    '[[{"toString":null},1]]',
    '[["Monday",{"toString":null}]]',
  ]) {
    test(`ignores invalid data and allows initialization after correction: ${data}`, () => {
      withChart(data, ({ attributes, band, document, children, listeners }) => {
        expect(() => initChartHover(document)).not.toThrow();
        expect(children).toHaveLength(0);
        expect(listeners.size).toBe(0);
        expect(band.dataset.ocHoverBound).not.toBe("true");

        attributes.set("data-oc-hover", '[["Monday",1200],["Tuesday",3400]]');
        initChartHover(document);
        expect(children).toHaveLength(2);
        expect(band.dataset.ocHoverBound).toBe("true");
        listeners.get("mousemove")({ clientX: 250 });
        expect(children[1].textContent).toBe("Tuesday · 3,400 events");
      });
    });
  }
});
