// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { config } from "dotenv";
import { unique } from "drizzle-orm/pg-core";
import {
  index,
  pgTableCreator,
  serial,
  varchar,
  boolean,
  text,
  uuid,
  doublePrecision,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `e_cinema_site_${name}`);

export const movies = createTable("movies", {
  id: serial("id").primaryKey(), // Auto-incrementing integer ID
  name: text("name").notNull(), // Movie title
  url: text("url").notNull(), // Poster URL
  category: text("category").notNull(), // e.g., "currently_running", "coming_soon"
  genre: text("genre").notNull(), // e.g., "action", "comedy"
  cast: jsonb("cast").notNull().default("[]"), // Array of cast members as JSON
  director: text("director").notNull(), // Director name
  producer: text("producer").notNull(), // Producer name
  synopsis: text("synopsis").notNull(), // Movie synopsis
  trailerUrl: text("trailer_url").notNull(), // Trailer URL (matches API field)
  imdb: integer("imdb").notNull(), // IMDb rating (0-10)
  mpaa: text("mpaa").notNull(), // MPAA rating (e.g., "PG-13")
  //showdate: jsonb("showdate").notNull(), // Array of { date: string, times: string[] }
  //showtime: jsonb("showtime").notNull(), // Array of string[] (times per date)
  reviews: jsonb("reviews").default(null), // Optional array of reviews as JSON
});

// Type inference for TypeScript
export type Movie = typeof movies.$inferSelect; // For selecting movies
export type NewMovie = typeof movies.$inferInsert; // For inserting movies
export type Showtime = typeof showtimes.$inferInsert

export const users = createTable("users", {
  userID: varchar("userID", { length: 256 }).primaryKey(),
  isAdmin: boolean("isAdmin").default(false),
  phoneNumber: text("phoneNumber"),
  address: text("address"),
  promotions: boolean("promotions"),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  status: text("status"),
});

export const creditCards = createTable("credit_cards", {
  id: uuid("id").defaultRandom().unique().primaryKey(),
  userID: varchar("userID", { length: 256 })
    .notNull()
    .references(() => users.userID, { onDelete: "cascade" }),
  cardNumber: text("cardNumber").notNull(),
  cardName: text("cardName").notNull(),
  cardType: text("cardType").notNull(),
  exp: text("exp").notNull(),
  cvv: text("cvv").notNull(),
  address: text("address").notNull(),
});

export const showtimes = createTable("showtimes", {
  id: serial("id").unique().primaryKey(),
  movieId: serial("movieId")
    .notNull()
    .references(() => movies.id, { onDelete: "cascade" }),
  pricesId: serial("pricesId").references(() => prices.id, {
    onDelete: "cascade",
  }),
  time: text("time").notNull(),
  date: text("date").notNull(),
  archived: boolean("archived").default(false),
}, (table) => ({
  uniqueComposite: unique().on(table.time, table.movieId, table.date)
}));

export const seats = createTable("seats", {
  id: serial("id").notNull().unique().primaryKey(),
  movieId: serial("movieId").references(() => movies.id, {
    onDelete: "cascade",
  }),
  showtimeId: serial("showtimeId").references(() => showtimes.id, {
    onDelete: "cascade",
  }),
  userId: varchar("userId", { length: 256 }).references(() => users.userID, {
    onDelete: "cascade",
  }),
  seat: text("seat").notNull(),
});

export const prices = createTable("prices", {
  id: serial("id").unique().primaryKey(),
  childPrice: doublePrecision("childPrice").notNull(),
  adultPrice: doublePrecision("adultPrice").notNull(),
  seniorPrice: doublePrecision("seniorPrice").notNull(),
});

export const promotions = createTable("promotions", {
  code: text("code").notNull(),
  discount: doublePrecision("discount").notNull(),
  id: serial("id").primaryKey(),
});

export const confirmed_bookings = createTable("confirmed_bookings", {
  id: uuid("id").defaultRandom().unique().primaryKey(),
  movieId: serial("movieId").references(() => movies.id, {
    onDelete: "cascade",
  }),
  showtimeId: serial("showtimeId").references(() => showtimes.id, {
    onDelete: "cascade",
  }),
  userId: varchar("userId", { length: 256 }).references(() => users.userID, {
    onDelete: "cascade",
  }),
  cardId: uuid("cardId").references(() => creditCards.id, {
    onDelete: "cascade",
  }),
});
