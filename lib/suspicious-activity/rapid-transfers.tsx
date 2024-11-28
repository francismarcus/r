import { flagTransaction } from "../actions";
import { transactionTypes, type Transaction } from "../db";
import { subMinutes } from "../utils";

const RAPID_TRANSFERS_N = 4;
const RAPID_TRANSFERS_MINUTES_AGO = 5;
/*
    Transactions needs to be sorted by timestamp
*/
export async function checkRapidTransfers({
	transactions,
	transactionId,
	userId,
	timestamp,
}: {
	transactions: Transaction[];
	transactionId: number;
	userId: number;
	timestamp: Date;
}) {
	let rapidTransferCount = 0;
	const fiveMinutesAgo = subMinutes(timestamp, RAPID_TRANSFERS_MINUTES_AGO);

	for (const transaction of transactions) {
		if (!(transaction.timestamp >= fiveMinutesAgo)) {
			break;
		}

		if (transaction.type === transactionTypes.transfer) {
			rapidTransferCount++;
		}
	}

	if (rapidTransferCount >= RAPID_TRANSFERS_N) {
		const reason = "Rapid Transfers";
		await flagTransaction({
			reason,
			transactionId,
			userId,
		});

		return {
			flagged: true,
			reason,
		};
	}

	return {
		flagged: false,
	};
}
