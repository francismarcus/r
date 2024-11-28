import {
	integer,
	pgTable,
	serial,
	text,
	index,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const transactionEnum = pgEnum("transaction_type", [
	"deposit",
	"withdrawal",
	"transfer",
]);

export const transactionTypes = z.enum(transactionEnum.enumValues).enum;
export const transactions = pgTable(
	"transactions",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").notNull(),
		amount: integer("amount").notNull(),
		timestamp: timestamp("timestamp").notNull(),
		type: transactionEnum("type").notNull(),
	},
	(t) => ({
		userIdx: index("user_idx").on(t.userId),
		imestampIdx: index("transaction_timestamp_idx").on(t.timestamp),
	}),
);

export type Transaction = typeof transactions.$inferSelect;

export const flaggedTransactions = pgTable(
	"flagged_transactions",
	{
		id: serial("id").primaryKey(),
		transactionId: integer("transaction_id").notNull(),
		reason: text("reason").notNull(),
		userId: integer("user_id").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => ({
		transactionIdx: index("transaction_idx").on(t.transactionId),
		userIdIdx: index("flagged_user_idx").on(t.userId),
		timestampIdx: index("flagged_timestamp_idx").on(t.timestamp),
	}),
);

export const transactionsRelations = relations(transactions, ({ many }) => ({
	flaggedTransactions: many(flaggedTransactions),
}));

export const flaggedTransactionsRelations = relations(
	flaggedTransactions,
	({ one }) => ({
		transaction: one(transactions, {
			fields: [flaggedTransactions.transactionId],
			references: [transactions.id],
		}),
	}),
);

export const insertFlaggedTransactionSchema =
	createInsertSchema(flaggedTransactions);
export type InsertFlaggedTransaction = z.infer<
	typeof insertFlaggedTransactionSchema
>;

export const insertTransactionSchema = createInsertSchema(transactions).omit({
	id: true,
});
export const selectTransactionSchema = createSelectSchema(transactions);

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
