import { pgTable as table } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";

export const users = table("account", {
	id: pg.serial().primaryKey(),
	email: pg.text().unique().notNull(),
	password: pg.text().notNull(),
	name: pg.text().notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("created_at").notNull().defaultNow(),
});

export const bands = table("band", {
	id: pg.serial().primaryKey(),
	name: pg.text().notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
});

export const userBands = table(
	"account_band",
	{
		accountID: pg.integer("account_id").references(() => users.id),
		bandID: pg.integer("band_id").references(() => bands.id),
		admin: pg.boolean().notNull().default(false),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [pg.primaryKey({ columns: [table.accountID, table.bandID] })],
);

export const shows = table("show", {
	id: pg.serial().primaryKey(),
	bandID: pg.integer("band_id").references(() => bands.id),
	// TODO: wtf kind of data should we be actually storing about shows?
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
});
