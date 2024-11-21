import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export const verifySession = cache(async () => {
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (!session?.userID) {
		redirect("/login");
	}

	// HACK: this cannot possibly be the right way to do this
	const idString = session.userID;
	if (typeof idString !== "string") {
		redirect("/login");
	}
	const id = parseInt(idString);

	return { isAuth: true, userID: id };
});

export const getUser = cache(async () => {
	const session = await verifySession();
	if (!session?.isAuth) return null;

	try {
		const data = await db.query.users.findMany({
			where: eq(users.id, session.userID),
			columns: {
				id: true,
				name: true,
				email: true,
			},
		});

		const user = data[0];

		return user;
	} catch (err) {
		console.error("failed to fetch user: ", err);
		return null;
	}
});
