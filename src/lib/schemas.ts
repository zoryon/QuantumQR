import { z } from "zod";

// Auth schemas
export const registerFormSchema = z.object({
    email: z.string().email(),
    username: z.string().min(2).max(25),
    password: z.string().min(5).max(60),
    passwordConfirmation: z.string().min(5).max(60),
    hasAllowedEmails: z.boolean(),  // News letters
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
});

const emailOrUsernameSchema = z.union([
    z.string().email(),
    z.string().min(2).max(25)
]);

export const loginFormSchema = z.object({
    emailOrUsername: emailOrUsernameSchema,
    password: z.string().min(5).max(60)
});

export const sendResetEmailFormSchema = z.object({
    emailOrUsername: emailOrUsernameSchema,
});

export const resetPasswordFormSchema = z.object({
    password: z.string().min(5).max(60),
    passwordConfirmation: z.string().min(5).max(60),
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
});

// QR Codes schemas
const BaseQRCodeSchema = z.object({
    name: z.string().min(2).max(25),
});

export const classicDetailsFormSchema = BaseQRCodeSchema.merge(
    z.object({
        name: z.string().min(2).max(25),
        websiteUrl: z.string().url().nullable(),
    })
);

export const cardDetailsFormSchema = BaseQRCodeSchema.merge(
    z.object({
        firstName: z.string().min(2).max(25),
        lastName: z.string().min(2).max(25),
        email: z.string().email().nullable(),
        phoneNumber: z.string().min(10).max(15).nullable(),
        address: z.string().min(5).max(50).nullable(),
        websiteUrl: z.string().url().nullable()
    })
);

export type CardDetailsFormValues = z.infer<typeof cardDetailsFormSchema>;
export type ClassicDetailsFormValues = z.infer<typeof classicDetailsFormSchema>;