import { describe, expect, it } from "vitest";
import * as contracts from "../src/index.js";

describe("contracts package boundary", () => {
  it("exposes only concrete cross-application contracts", () => {
    expect(Object.keys(contracts)).toEqual([]);
  });
});
