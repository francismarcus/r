import { getFlaggedTransactions } from "@/lib/queries";
import { z } from "zod";

const paramsSchema = z.object({
	user: z.preprocess((val) => {
		return Number.parseInt(z.string().parse(val));
	}, z.number()),
});

type Params = z.infer<typeof paramsSchema>;
export const GET = async (
	request: Request,
	{ params }: { params: Promise<Params> },
) => {
	try {
		const parameters = paramsSchema.safeParse(await params);

		if (!parameters.success) {
			return new Response(parameters.error.message, { status: 400 });
		}

		const transactions = await getFlaggedTransactions(parameters.data.user);

		return new Response(JSON.stringify(transactions), { status: 200 });
	} catch (error) {
		return new Response("Server error", { status: 500 });
	}
};
