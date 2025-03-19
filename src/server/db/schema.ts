// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { config } from "dotenv";
import {
  index,
  pgTableCreator,
  serial,
  varchar,
  boolean,
  text,
  uuid,
  doublePrecision,
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
  phoneNumber: text("phoneNumber"),
  address: text("address"),
  promotions: boolean("promotions"),
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
});

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
  code: text("code").unique().primaryKey().notNull(),
  discount: doublePrecision("discount").notNull(),
});


export const confirmed_bookings = createTable("confirmed_bookings",{
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
  cardId: uuid("cardId").references(()=> creditCards.id,{
    onDelete: "cascade",
  })
});