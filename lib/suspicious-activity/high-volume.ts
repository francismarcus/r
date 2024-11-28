import { flagTransaction } from "../actions";

const HIGH_VOLUME_AMOUNT = 10000;

export async function checkHighVolume({
	amount,
	transactionId,
	userId,
}: {
	amount: number;
	transactionId: number;
	userId: number;
}) {
	if (amount > HIGH_VOLUME_AMOUNT) {
		const reason = "High Volume";
		await flagTransaction({
			transactionId,
			reason,
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
