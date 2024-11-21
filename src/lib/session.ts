import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(id: number) {
	const expiresAt = new Date(Date.now() + ONE_WEEK_MS);

	const data = await db
		.insert(sessions)
		.values({
			userID: id,
			expiresAt,
		})
		.returning({ id: sessions.id });

	const sessionID = data[0].id;

	const cookieStore = await cookies();
	cookieStore.set("session", sessionID, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function updateSession() {
	const sessionID = (await cookies()).get("session")?.value;
	if (!sessionID) {
		return;
	}

	const data = await db
		.select()
		.from(sessions)
		.where(eq(sessions.id, sessionID));

	const session = data[0];
	if (!session || session.expiresAt.valueOf() <= Date.now()) {
		return;
	}

	const expiresAt = new Date(Date.now() + ONE_WEEK_MS);

	await db
		.update(sessions)
		.set({
			updatedAt: new Date(),
			expiresAt,
		})
		.where(eq(sessions.id, sessionID));

	const cookieStore = await cookies();
	// we only store a new cookie to extend the expiration time
	cookieStore.set("session", sessionID, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function deleteSession() {
	const sessionID = (await cookies()).get("session")?.value;
	if (!sessionID) {
		return;
	}

	await db.delete(sessions).where(eq(sessions.id, sessionID));

	const cookieStore = await cookies();
	cookieStore.delete("session");
}
