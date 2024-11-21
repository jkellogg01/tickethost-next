import { z } from "zod";

const passwordStrict = z
	.string()
	.min(8, { message: "Be at least 8 characters long" })
	.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
	.regex(/[0-9]/, { message: "Contain at least one number." })
	.regex(/[^a-zA-Z0-9]/, {
		message: "Contain at least one special character.",
	});

const passwordPermissive = z
	.string()
	.min(6, { message: "Be at least 6 characters long" });

export const RegisterFormSchema = z.object({
	name: z.string().min(2).trim(),
	email: z.string().email().trim(),
	password: (process.env.NODE_ENV === "production"
		? passwordStrict
		: passwordPermissive
	).trim(),
});

export const LoginFormSchema = z.object({
	email: z.string().email().trim(),
	password: z.string().trim(),
});
