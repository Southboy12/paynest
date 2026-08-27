import { realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/db";

export const ADMIN_ROLE = "super_admin";

const ADMIN_NAME = "Super Admin";

export type SeedCredentials = {
  email: string;
  password: string;
};

export function readSeedCredentials(
  env: NodeJS.ProcessEnv = process.env,
): SeedCredentials {
  const email = env.SEED_ADMIN_EMAIL?.trim();
  const password = env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    const missing = [
      !email ? "SEED_ADMIN_EMAIL" : null,
      !password ? "SEED_ADMIN_PASSWORD" : null,
    ].filter((name): name is string => name !== null);
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Add them to your .env file (see .env.example) and run " +
        "'npx prisma db seed' again.",
    );
  }

  return { email, password };
}

export type EnsureAdminResult = {
  email: string;
  userId: string;
  created: boolean;
};

export async function ensureAdminUser(
  email: string,
  password: string,
): Promise<EnsureAdminResult> {
  const address = email?.trim() ?? "";
  if (!address || !password) {
    throw new Error(
      "ensureAdminUser requires a non-empty email and password.",
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: address } });
  if (existing) {
    if (existing.role !== ADMIN_ROLE) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: ADMIN_ROLE },
      });
    }
    return { email: address, userId: existing.id, created: false };
  }

  // Sign up through better-auth so the password is hashed exactly the way
  // the login flow verifies it (Argon2, configured in src/lib/auth.ts).
  const { user } = await auth.api.signUpEmail({
    body: { name: ADMIN_NAME, email: address, password },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { role: ADMIN_ROLE },
  });

  // sign-up also opens a session; a seed run should not leave one behind.
  await prisma.session.deleteMany({ where: { userId: user.id } });

  return { email: address, userId: user.id, created: true };
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  try {
    const envPath = fileURLToPath(new URL("../.env", import.meta.url));
    process.loadEnvFile(path.resolve(envPath));
  } catch {
    // .env is optional: the Prisma CLI or the shell may provide the vars.
  }

  try {
    const { email, password } = readSeedCredentials();
    const result = await ensureAdminUser(email, password);
    if (result.created) {
      console.log(
        `Seeded super_admin user ${result.email} (id: ${result.userId}).`,
      );
    } else {
      console.log(
        `Super admin ${result.email} already exists; nothing was created ` +
          `(id: ${result.userId}).`,
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (isDirectRun()) {
  void main();
}
