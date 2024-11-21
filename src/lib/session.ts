import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { SessionPayload } from "./definitions";
import { cookies } from "next/headers";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(encodedKey);
}

export async function decrypt(session: string = "") {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (err) {
		console.error("failed to verify session");
	}
}

export async function createSession(userID: string) {
	const expiresAt = new Date(Date.now() + ONE_WEEK_MS);
	const session = await encrypt({
		userID,
		expiresAt,
	});

	await cookies().then((store) => {
		store.set("session", session, {
			httpOnly: true,
			secure: true,
			expires: expiresAt,
			sameSite: "lax",
			path: "/",
		});
	});
}

export async function updateSession() {
	const session = await cookies().then((store) => {
		return store.get("session")?.value;
	});
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + ONE_WEEK_MS);
	payload.expiresAt = expires;

	await cookies().then(async (store) => {
		store.set("session", await encrypt(payload), {
			httpOnly: true,
			secure: true,
			expires: expires,
			sameSite: "lax",
			path: "/",
		});
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}
