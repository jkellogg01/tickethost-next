import { pgTable as table } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { bands } from "./band";

export const shows = table("show", {
	id: pg.serial().primaryKey(),
	bandID: pg.integer("band_id").references(() => bands.id),
	// TODO: wtf kind of data should we be actually storing about shows?
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
});
