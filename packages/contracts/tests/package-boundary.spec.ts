import { describe, expect, it } from "vitest";
import * as contracts from "../src/index.js";

describe("contracts package boundary", () => {
  it("does not expose speculative domain contracts", () => {
    expect(Object.keys(contracts)).toEqual([]);
  });
});
