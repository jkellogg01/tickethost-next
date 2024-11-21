import { pgTable as table } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";

export const accounts = table("account", {
	id: pg.serial().primaryKey(),
	email: pg.text().unique().notNull(),
	password: pg.text().notNull(),
	name: pg.text().notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("created_at").notNull().defaultNow(),
});
