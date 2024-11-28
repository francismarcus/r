import { EventSchemas, Inngest } from "inngest";
import { insertTransactionSchema } from "../db/schema";
import { z } from "zod";

const eventsMap = {
	"transaction/logged": {
		data: insertTransactionSchema.extend({
			id: z.number(),
		}),
	},
};

export const inngest = new Inngest({
	id: "remo",
	schemas: new EventSchemas().fromZod(eventsMap),
});
