import { db } from "@/db";
import { users } from "@/db/schema";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
	const validatedFields = RegisterFormSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, email, password } = validatedFields.data;
	const hashedPassword = await hash(password, 10);

	const data = await db
		.insert(users)
		.values({
			name,
			email,
			password: hashedPassword,
		})
		.returning({ id: users.id });

	const user = data[0];

	if (!user) {
		return {
			message: "an error occurred while creating your account",
		};
	}

	createSession(user.id.toString());
	redirect("/dashboard");
}

export async function login(formData: FormData) {
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email, password } = validatedFields.data;
	const data = await db.select().from(users).where(eq(users.email, email));
	const user = data[0];
	if (!user) {
		return {
			message: "invalid credentials, please try again",
		};
	}
	const passwordMatches = await compare(password, user.password);
	if (!passwordMatches) {
		return {
			message: "invalid credentials, please try again",
		};
	}

	createSession(user.id.toString());
	redirect("/dashboard");
}

export async function logout() {
	await deleteSession();
	redirect("/login");
}
