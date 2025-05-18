import { pgTable, unique, uuid, text, foreignKey, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const sellerType = pgEnum("seller_type", ['LIBRARY', 'STORE', 'ONLINE_RETAILER'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	avatarUrl: text("avatar_url"),
	supabaseUserId: text("supabase_user_id").notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_supabase_user_id_unique").on(table.supabaseUserId),
]);

export const bookEntries = pgTable("book_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	addedAt: timestamp("added_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	bookId: uuid("book_id").notNull(),
	shelfId: uuid("shelf_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "book_entries_book_id_books_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.shelfId],
			foreignColumns: [shelves.id],
			name: "book_entries_shelf_id_shelves_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "book_entries_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const books = pgTable("books", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	author: text().notNull(),
	isbn10: text(),
	isbn13: text(),
	description: text(),
	coverImageUrl: text("cover_image_url"),
	publicationDate: timestamp("publication_date", { withTimezone: true, mode: 'string' }),
	publisher: text(),
	pageCount: integer("page_count"),
	genres: text().array(),
	averageRating: real("average_rating"),
}, (table) => [
	unique("books_isbn10_unique").on(table.isbn10),
	unique("books_isbn13_unique").on(table.isbn13),
]);

export const shelves = pgTable("shelves", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "shelves_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const reviews = pgTable("reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rating: integer().notNull(),
	title: text(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	userId: uuid("user_id").notNull(),
	bookId: uuid("book_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "reviews_book_id_books_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reviews_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const sellerListings = pgTable("seller_listings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	bookId: uuid("book_id").notNull(),
	sellerName: text("seller_name").notNull(),
	sellerType: sellerType("seller_type").notNull(),
	location: text(),
	price: real(),
	currency: text(),
	availability: text(),
	websiteUrl: text("website_url"),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "seller_listings_book_id_books_id_fk"
		}).onDelete("cascade"),
]);
