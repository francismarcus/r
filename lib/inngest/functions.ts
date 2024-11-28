import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { gte } from "drizzle-orm";
import { checkHighVolume } from "../suspicious-activity/high-volume";
import { checkRapidTransfers } from "../suspicious-activity/rapid-transfers";
import { subHours } from "../utils";
import { checkFrequentSmallTransactions } from "../suspicious-activity/frequent-small-transactions";

export const transactionLogged = inngest.createFunction(
	{ id: "transaction-logged" },
	{ event: "transaction/logged" },
	async ({ event }) => {
		const { id, userId, amount, timestamp } = event.data;

		const highVolume = await checkHighVolume({
			amount,
			transactionId: id,
			userId,
		});

		if (highVolume.flagged) {
			return highVolume;
		}

		const oneHourAgo = subHours(timestamp, 1);

		const transactions = await db.query.transactions.findMany({
			where: (t, { eq, and }) =>
				and(eq(t.userId, userId), gte(t.timestamp, oneHourAgo)),
			orderBy: (t, { desc }) => [desc(t.timestamp)],
		});

		const frequentSmallTransactions = await checkFrequentSmallTransactions({
			transactions,
			transactionId: id,
			userId,
		});

		if (frequentSmallTransactions.flagged) {
			return frequentSmallTransactions;
		}

		const rapidTransfers = await checkRapidTransfers({
			transactions,
			transactionId: id,
			userId,
			timestamp,
		});

		if (rapidTransfers.flagged) {
			return rapidTransfers;
		}

		return {
			flagged: false,
		};
	},
);
