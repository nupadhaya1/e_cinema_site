// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration


import { sql } from "drizzle-orm";
import {
 index,
 pgTableCreator,
 serial,
 varchar,
 boolean,
} from "drizzle-orm/pg-core";


/**
* This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
* database instance for multiple projects.
*
* @see https://orm.drizzle.team/docs/goodies#multi-project-schema
*/
export const createTable = pgTableCreator((name) => `e_cinema_site_${name}`);


export const movies = createTable(
 "movies",
 {
   id: serial("id").primaryKey(),
   name: varchar("name", { length: 256 }).notNull(),
   url: varchar("url", { length: 1024 }).notNull(),
   category: varchar("category", { length: 256 }).notNull(),
   cast: varchar("cast", { length: 1024 }).notNull(),
   director: varchar("director", { length: 256 }).notNull(),
   producer: varchar("producer", { length: 256 }).notNull(),
   synopsis: varchar("synopsis", { length: 4096 }).notNull(),
   trailerpicture: varchar("trailerpicture", { length: 2048 }).notNull(),
   trailervideo: varchar("trailervideo", { length: 2048 }).notNull(),
   rating: varchar("rating", { length: 256 }).notNull(),
   showdate: varchar("showdate", { length: 256 }).notNull(),
   showtime: varchar("showtime", { length: 256 }).notNull(),
   reviews: varchar("reviews", { length: 4096 }),
 },
 (example) => ({
   nameIndex: index("name_idx").on(example.name),
 }),
);


export const users = createTable("users", {
 userID: varchar("userID", { length: 256 }).primaryKey(),
 isAdmin: boolean("isAdmin").default(false),
});
