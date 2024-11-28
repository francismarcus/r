import { flagTransaction } from "../actions";
import type { Transaction } from "../db";

const FREQUENT_SMALL_TRANSACTIONS_N = 6;
const FREQUENT_SMALL_TRANSACTION_AMOUNT = 100;

/*
	Transactions needs to be no older than 1 hour
*/
export async function checkFrequentSmallTransactions({
	transactions,
	transactionId,
	userId,
}: {
	transactions: Transaction[];
	transactionId: number;
	userId: number;
}) {
	if (transactions.length > FREQUENT_SMALL_TRANSACTIONS_N) {
		const smallTransactions = transactions.filter(
			(t) => t.amount < FREQUENT_SMALL_TRANSACTION_AMOUNT,
		);

		if (smallTransactions.length > FREQUENT_SMALL_TRANSACTIONS_N) {
			const reason = "Frequent Small Transactions";
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
	}

	return {
		flagged: false,
	};
}
