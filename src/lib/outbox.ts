import "server-only";
import { db } from "@/lib/db";
import { hubOutbox, type HubSql } from "@/lib/hub";

// Activity reports for the class hub go through the outbox: held in this app's database and
// resent until the hub has them.
export const outbox = () => hubOutbox(db() as unknown as HubSql);
