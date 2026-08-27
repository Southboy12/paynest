// @vitest-environment node

import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";

describe("database connection", () => {
  it("runs a real query against PostgreSQL", async () => {
    const result = await prisma.$queryRaw<[{ ok: number }]>`SELECT 1 AS ok`;
    expect(result).toHaveLength(1);
    expect(result[0].ok).toBe(1);
  });

  it("reads the Company table created by the initial migration", async () => {
    const count = await prisma.company.count();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
