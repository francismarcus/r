import { logTransaction } from "@/lib/actions";
import { insertTransactionSchema } from "@/lib/db";

import { inngest } from "@/lib/inngest/client";
import { z } from "zod";

const schema = insertTransactionSchema
	.pick({
		userId: true,
		amount: true,
		timestamp: true,
		type: true,
	})
	.extend({
		timestamp: z.preprocess((val) => {
			return new Date(z.string().parse(val));
		}, z.date()),
	});

export const POST = async (request: Request) => {
	try {
		const transaction = schema.safeParse(await request.json());

		if (!transaction.success) {
			return new Response(transaction.error.message, { status: 400 });
		}

		const result = await logTransaction(transaction.data);

		await inngest.send({
			name: "transaction/logged",
			data: { id: result[0].id, ...transaction.data },
		});

		return new Response("OK", { status: 200 });
	} catch (error) {
		return new Response("Server error", { status: 500 });
	}
};
