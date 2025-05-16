import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import getPrismaClient from "@/lib/db";
import transporter, { createSignedConfirmationToken } from "@/lib/mailer";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { ResultType } from "@/types";
import { isLoggedIn } from "@/lib/auth-helpers";

export async function POST(req: Request): Promise<NextResponse<ResultType>> {
  try {
    // Block registration if user is already logged in
    if (await isLoggedIn()) {
      return ResponseHandler.unauthorized("You are already logged in.");
    }

    const prisma = getPrismaClient();

    // Parse and validate input
    const {
      email,
      username,
      password,
      passwordConfirmation,
      hasAllowedEmails,
    } = await req.json();

    if (
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof passwordConfirmation !== "string" ||
      typeof hasAllowedEmails !== "boolean" ||
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !passwordConfirmation.trim()
    ) {
      return ResponseHandler.badRequest("Invalid parameters.");
    }

    if (username.trim().length < 2) {
      return ResponseHandler.badRequest("Username must be at least 2 characters long.");
    }

    if (password.length < 4) {
      return ResponseHandler.badRequest("Password must be at least 4 characters long.");
    }

    if (password !== passwordConfirmation) {
      return ResponseHandler.badRequest("Passwords do not match.");
    }

    // Check for existing user by email or username
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email: email.trim() }, { username: username.trim() }],
      },
    });

    if (existingUser) {
      return ResponseHandler.conflict("User already exists. Please login instead.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        email: email.trim(),
        username: username.trim(),
        password: hashedPassword,
        hasAllowedEmails: hasAllowedEmails || false,
        isEmailConfirmed: false,
      },
    });

    if (!user) {
      return ResponseHandler.error("Failed to create user.");
    }

    // Create email confirmation token and send email
    const validationToken = await createSignedConfirmationToken(user.id, "10m");
    const confirmationLink = `${process.env.WEBSITE_URL}/register/confirm?token=${validationToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Confirm Your Email",
      html: `<p>Please confirm your email by clicking <a href="${confirmationLink}">here</a>.</p>`,
    });

    return ResponseHandler.success(
      true,
      "Registration successful. Please check your email to confirm your account."
    );
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
