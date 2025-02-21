// import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

// let connection: mysql.Connection | null = null;
// export const createConnection = async () => {
//     if (!connection) {
//         connection = await mysql.createConnection({
//             host: process.env.DATABASE_HOST,
//             user: process.env.DATABASE_USER,
//             password: process.env.DATABASE_PASSWORD,
//             database: process.env.DATABASE_NAME
//         });
//     }
//     return connection;
// }


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