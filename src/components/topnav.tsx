import { logout } from "@/actions/auth";
import Link from "next/link";

export default function TopNav({
	session,
}: { session?: "auth" | "guest" | "blank" }) {
	return (
		<>
			<div className="h-16 border-b border-white/85 content-end">
				<nav className="flex flex-row justify-between items-baseline container mx-auto pb-2">
					<Link href="/" className="text-3xl font-semibold">
						TicketHost
					</Link>
					<TopNavAuthCluster session={session} />
				</nav>
			</div>
		</>
	);
}

function TopNavAuthCluster({
	session = "blank",
}: { session?: "auth" | "guest" | "blank" }) {
	switch (session) {
		case "blank":
			return null;
		case "auth":
			return <button onClick={logout}>Log Out</button>;
		case "guest":
			return (
				<div className="flex flex-row gap-2">
					<Link href="/register" className="text-lg font-semibold">
						Sign Up
					</Link>
					<Link href="/login" className="text-lg font-semibold">
						Log In
					</Link>
				</div>
			);
	}
}
