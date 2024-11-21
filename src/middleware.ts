import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const authRoutes = ["/dashboard"];
const guestRoutes = ["/", "/register", "/login"];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isAuthRoute = authRoutes.includes(path);
	const isGuestRoute = guestRoutes.includes(path);

	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (isAuthRoute && !session?.userID) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	if (
		isGuestRoute &&
		session?.userID &&
		!req.nextUrl.pathname.startsWith("/dashboard")
	) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}
