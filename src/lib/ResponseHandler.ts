import { NextResponse } from "next/server";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResultType } from "@/types";
import { DuplicateEntryError } from "./custom-errors";
import { ZodError } from "zod";

export class ResponseHandler {
    static success(data: any, message: string = "Success"): NextResponse<ResultType> {
        return NextResponse.json({ success: true, message, data }, { status: 200 });
    }

    static created(data: any, message: string = "Resource created"): NextResponse<ResultType> {
        return NextResponse.json({ success: true, message, data }, { status: 201 });
    }

    static badRequest(message: string = "Invalid request", data: any = null): NextResponse<ResultType> {
        return NextResponse.json({ success: false, message, data }, { status: 400 });
    }

    static unauthorized(message: string = "Unauthorized"): NextResponse<ResultType> {
        return NextResponse.json({ success: false, message, data: null }, { status: 401 });
    }

    static forbidden(message: string = "Forbidden"): NextResponse<ResultType> {
        return NextResponse.json({ success: false, message, data: null }, { status: 403 });
    }

    static notFound(message: string = "Not found"): NextResponse<ResultType> {
        return NextResponse.json({ success: false, message, data: null }, { status: 404 });
    }

    static conflict(message: string = "Already found in the database"): NextResponse<ResultType> {
        return NextResponse.json({ success: false, message, data: null }, { status: 409 });
    }

    static internalServerError(message: string = "Internal server error"): NextResponse<ResultType> {
        return NextResponse.json({ success: false, message, data: null }, { status: 500 });
    }

    static error(error: unknown): NextResponse<ResultType> {
        console.error("API Error:", error);

        // Handle Prisma errors
        if (error instanceof PrismaClientInitializationError) {
            return this.internalServerError("Having some trouble reaching the server, please try again later"); 
        }

        if (error instanceof ZodError) {
            return this.badRequest("Validation failed", error.flatten().fieldErrors);
        }

        if (error instanceof DuplicateEntryError) {
            return this.conflict(error.message);
        }

        // Handle other Error instances
        if (error instanceof Error) {
            return this.internalServerError(error.message); 
        }

        // Fallback for unknown errors
        return this.internalServerError("Unknown error occurred, please try again later"); 
    }
}