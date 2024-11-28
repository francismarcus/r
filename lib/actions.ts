"server-only";

import { db } from "@/lib/db";
import {
	flaggedTransactions,
	transactions,
	type InsertFlaggedTransaction,
	type InsertTransaction,
} from "@/lib/db/schema";

export async function logTransaction(transaction: InsertTransaction) {
	return await db
		.insert(transactions)
		.values(transaction)
		.returning({ id: transactions.id });
}

export async function flagTransaction(transaction: InsertFlaggedTransaction) {
	return await db
		.insert(flaggedTransactions)
		.values(transaction)
		.returning({ id: flaggedTransactions.id });
}
