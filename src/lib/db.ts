import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
export const getPrismaClient = () => {
    if (process.env.NODE_ENV === "production") {
        // In production, we create one PrismaClient instance each time.
        prisma = new PrismaClient();
    } else {
        // In development, we create a PrismaClient only once.
        // This prevents new instances from being created on each request.
        if (!prisma) {
            prisma = new PrismaClient();
        }
    }

    return prisma;
}

export default getPrismaClient;