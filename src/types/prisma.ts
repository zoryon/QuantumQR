import { PrismaClient } from "@prisma/client";

export type PrismaModel = keyof {
    [K in keyof PrismaClient as PrismaClient[K] extends { findMany: any } ? K : never]: any;
};