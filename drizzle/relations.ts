import { relations } from "drizzle-orm/relations";
import { books, bookEntries, shelves, users, reviews, sellerListings } from "./schema";

export const bookEntriesRelations = relations(bookEntries, ({one}) => ({
	book: one(books, {
		fields: [bookEntries.bookId],
		references: [books.id]
	}),
	shelf: one(shelves, {
		fields: [bookEntries.shelfId],
		references: [shelves.id]
	}),
	user: one(users, {
		fields: [bookEntries.userId],
		references: [users.id]
	}),
}));

export const booksRelations = relations(books, ({many}) => ({
	bookEntries: many(bookEntries),
	reviews: many(reviews),
	sellerListings: many(sellerListings),
}));

export const shelvesRelations = relations(shelves, ({one, many}) => ({
	bookEntries: many(bookEntries),
	user: one(users, {
		fields: [shelves.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	bookEntries: many(bookEntries),
	shelves: many(shelves),
	reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	book: one(books, {
		fields: [reviews.bookId],
		references: [books.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));

export const sellerListingsRelations = relations(sellerListings, ({one}) => ({
	book: one(books, {
		fields: [sellerListings.bookId],
		references: [books.id]
	}),
}));