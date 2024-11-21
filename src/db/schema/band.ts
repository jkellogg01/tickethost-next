import { pgTable as table } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { accounts } from "./account";

export const bands = table("band", {
	id: pg.serial().primaryKey(),
	name: pg.text().notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
});

export const accountBands = table("account_band", {
	accountID: pg.integer("account_id").references(() => accounts.id),
	bandID: pg.integer("band_id").references(() => bands.id),
	admin: pg.boolean().notNull().default(false),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
});
