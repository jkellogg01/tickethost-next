import { db } from "@/db";
import { users } from "@/db/schema";
import { RegisterFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import { hash } from "bcrypt";
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

	createSession(user.id);
	redirect("/dashboard");
}
