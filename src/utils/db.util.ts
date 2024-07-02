import { PrismaClient } from "@prisma/client";
import { isProd } from "./env.util";

if (!(global as any)["prisma"])
  (global as any)["prisma"] = new PrismaClient(
    isProd() ? undefined : { log: ["error", "info", "query", "warn"] }
  );
export const prisma = (global as any)["prisma"] as PrismaClient;
export const connectDb = async () => prisma.$connect();
export const disconnectDb = async () => prisma.$disconnect();
