import { describe, expect, test } from "vitest";

import { nairaInWords } from "@/lib/amount-in-words";

describe("nairaInWords", () => {
  test("converts kobo to the amount in words", () => {
    expect(nairaInWords(48_600_000)).toBe(
      "Four Hundred and Eighty-Six Thousand Naira Only",
    );
  });

  test("handles hundreds of thousands", () => {
    expect(nairaInWords(45_000_000)).toBe(
      "Four Hundred and Fifty Thousand Naira Only",
    );
  });

  test("handles zero", () => {
    expect(nairaInWords(0)).toBe("Zero Naira Only");
  });

  test("handles millions", () => {
    expect(nairaInWords(1_250_000_00)).toBe(
      "One Million Two Hundred and Fifty Thousand Naira Only",
    );
  });
});
