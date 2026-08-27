import { hash, verify } from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      // Argon2id (the default algorithm of @node-rs/argon2) instead of the
      // built-in scrypt hash. Plaintext passwords are never stored or logged.
      async hash(password) {
        return hash(password);
      },
      async verify({ password, hash: storedHash }) {
        try {
          return await verify(storedHash, password);
        } catch {
          return false;
        }
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "hr_admin",
        required: true,
        input: false,
      },
    },
  },
  session: {
    // Sessions live in the database (revocable), not in stateless JWTs.
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
