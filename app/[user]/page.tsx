import { getFlaggedTransactions } from "@/lib/queries";
import { Suspense } from "react";

async function TransactionList({ user }: { user: number }) {
	const flagged = await getFlaggedTransactions(user);

	return (
		<div className="w-full h-full flex flex-col gap-4 px-72 py-24">
			{flagged.map((f) => (
				<div key={f.id} className="flex flex-col border rounded-md p-4 gap-2">
					<p className="text-muted-foreground">
						{" "}
						{new Date(f.transaction.timestamp).toLocaleString()}
					</p>
					<div className="flex flex-row justify-between">
						<p>${f.transaction.amount}</p>
						<p className="text-muted-foreground">
							{f.transaction.type.charAt(0).toUpperCase() +
								f.transaction.type.slice(1)}
						</p>
					</div>
					<p>{f.reason}</p>
				</div>
			))}
		</div>
	);
}

export default async function Landing({
	params,
}: { params: { user: number } }) {
	const { user } = await params;

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<span>{user}</span>
			<TransactionList user={user} />
		</Suspense>
	);
}
