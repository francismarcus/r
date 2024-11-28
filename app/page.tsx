import { db } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";

async function UserList() {
	const users = await db.query.flaggedTransactions.findMany();
	const uniqueUsers = [...new Set(users.map((u) => u.userId))];
	return uniqueUsers.map((u) => (
		<Link
			className="h-10 hover:bg-gray-700 rounded-md px-4 items-center flex"
			key={u}
			href={`/${u}`}
		>
			{u}
		</Link>
	));
}

export default async function Landing() {

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="w-full h-full flex flex-col gap-4 px-72 py-24">
				<UserList />
			</div>
		</Suspense>
	);
}
