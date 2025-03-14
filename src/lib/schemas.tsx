import { z } from "zod";

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

export const cardDetailsFormSchema = z.object({
    name: z.string().min(2).max(25),
    firstName: z.string().min(2).max(25),
    lastName: z.string().min(2).max(25),
    email: z.string().email(),
    phoneNumber: z.string().min(10).max(15),
    address: z.string().min(5).max(50),
    websiteUrl: z.string().url()
});

export const editVCardFormSchema = z.object({
    id: z.number(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    websiteUrl: z.string().url("Invalid URL format").optional(),
    address: z.string().optional(),
});

export type CardDetailsFormValues = z.infer<typeof cardDetailsFormSchema>;
export type EditVCardFormValues = z.infer<typeof editVCardFormSchema>;