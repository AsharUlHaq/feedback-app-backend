import dotenv from "dotenv";
import { z } from "zod";
import { LoggerService } from "./logger.util";
import { zodErrorMapper } from "../common/mapper/zod-mapper";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  DATABASE_URL: z.string(),
  ACCESS_SECRET: z.string(),
  ACCESS_EXP: z.string(),
});

function envInitializer() {
  try {
    return envSchema.parse(process.env);
  } catch (err: any) {
    LoggerService(envInitializer.name.toUpperCase()).error(zodErrorMapper(err));
    process.exit(1);
  }
}

export const ENV = envInitializer();
export const isDev = () => ENV.NODE_ENV === "development";
export const isProd = () => ENV.NODE_ENV === "production";
