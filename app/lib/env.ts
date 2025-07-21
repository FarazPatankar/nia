import { z } from "zod";

const envSchema = z.object({
  // Pocketbase
  PB_TYPEGEN_URL: z.string(),
  PB_TYPEGEN_EMAIL: z.string().email(),
  PB_TYPEGEN_PASSWORD: z.string(),

  // Auth
  SESSION_SECRET: z.string(),
  ADMIN_PASSWORD: z.string(),

  // OURA
  OURA_PAT: z.string(),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4),
  );
  process.exit(1);
}

export const envs = env.data;
