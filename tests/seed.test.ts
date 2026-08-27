// @vitest-environment node
import { verify } from "@node-rs/argon2";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import {
  ADMIN_ROLE,
  ensureAdminUser,
  readSeedCredentials,
} from "../prisma/seed";

const email = `seed-admin-${Date.now()}@paynest.local`;
const password = "s3ed-Adm1n-Passw0rd!x";

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

describe("super admin seed credentials", () => {
  it("fails with a clear message when env vars are missing", () => {
    expect(() => readSeedCredentials({})).toThrow(
      /SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD/,
    );
    expect(() =>
      readSeedCredentials({ SEED_ADMIN_EMAIL: "admin@example.com" }),
    ).toThrow(/SEED_ADMIN_PASSWORD/);
    expect(() =>
      readSeedCredentials({ SEED_ADMIN_PASSWORD: "some-password" }),
    ).toThrow(/SEED_ADMIN_EMAIL/);
  });

  it("rejects empty arguments to ensureAdminUser", async () => {
    await expect(ensureAdminUser("", password)).rejects.toThrow(/non-empty/);
    await expect(ensureAdminUser(email, "")).rejects.toThrow(/non-empty/);
  });
});

describe("super admin seed", () => {
  it("creates the user with role super_admin and an Argon2 password", async () => {
    const result = await ensureAdminUser(email, password);
    expect(result.created).toBe(true);

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
    expect(user?.role).toBe(ADMIN_ROLE);
    expect(user?.role).toBe("super_admin");

    const account = await prisma.account.findFirst({
      where: { userId: result.userId, providerId: "credential" },
    });
    expect(account?.password).toBeTruthy();
    expect(account?.password).toMatch(/^\$argon2/);
    expect(account?.password).not.toContain(password);
    expect(await verify(account?.password ?? "", password)).toBe(true);
  });

  it("is a no-op on the second run", async () => {
    const before = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    const result = await ensureAdminUser(email, password);
    expect(result.created).toBe(false);
    expect(result.userId).toBe(before?.id);

    expect(await prisma.user.count({ where: { email } })).toBe(1);
    expect(
      await prisma.account.count({ where: { userId: before?.id } }),
    ).toBe(before?.accounts.length);
  });

  it("restores the super_admin role on an existing user without duplicating", async () => {
    await prisma.user.update({
      where: { email },
      data: { role: "hr_admin" },
    });

    const result = await ensureAdminUser(email, password);
    expect(result.created).toBe(false);

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user?.role).toBe("super_admin");
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });
});
