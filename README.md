# Setup
- Add DATABASE_URL in .env to a Postgres, check `env.example`
- Install deps with bun `bun install`
- Push schema to database `npx drizzle-kit push`
- Run inngest `npx inngest-cli@latest dev`
- Run server `bun dev`
 
*Both inngest and server needs to be running*

# Assumptions

- The log transactions endpoint does not need to return wether the transaction is suspicious or not and can thus be done in the background.
- IDs are numbers
- Amount is integer and not float
- Transaction type are unlikely to change (additional ones added / removed)

  
---

The code for the endpoints can be found in `app/api/flagged-transactions` and `app/api/transaction`

The flagged-transactions endpoint returns a list with a joined transaction object:

```
{
	id: 11,
	transactionId: 19,
	reason: "Frequent Small Transactions",
	userId: 2,
	timestamp: "2024-11-28T16:07:57.610Z",
		transaction: {
		id: 19,
		userId: 2,
		amount: 50,
		timestamp: "2024-11-28T16:07:55.614Z",
		type: "deposit",
	},
}
```
It's available at `/api/flagged-transactions/{id}`

The transaction logged endpoint is available at `/api/transaction` and takes a JSON body with the following shape:
```
{
	userId: number,
	amount: number,
	timestamp: datetime,
	type: "deposit" | "withdrawal" | "transfer"
}
```

The following JSON should work to create a transaction: 
```
{"id":21,"userId":7,"amount":15000,"timestamp":"2024-11-28T18:12:27.204Z","type":"deposit"}
```

You can then visit http://localhost:3000/api/flagged-transactions/7 to see the flagged transactions for that user.

---
Once transactions have been logged, you can navigate 
[to the app](http://localhost:3000)
 and see the flagged transactions for each user in the list by clicking on the IDs.


*PS: There's alot of unnecessary packages in the repo, just ignore!*
