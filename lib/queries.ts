"server-only";
import { db } from "./db";

export async function getFlaggedTransactions(userId: number) {
	return await db.query.flaggedTransactions.findMany({
		where: (t, { eq }) => eq(t.userId, userId),
		orderBy: (t, { desc }) => [desc(t.timestamp)],
		with: {
			transaction: true,
		},
	});
}
