// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  real, // For Float type
  uniqueIndex,
  index,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { type User as AuthorizedUser } from "@supabase/supabase-js";

// Define Enum for SellerListing sellerType
export const sellerTypeEnum = pgEnum("seller_type", ["Library", "Seller"]);

// New Enum for Transaction Type
export const transactionTypeEnum = pgEnum("transaction_type", [
  "Buy",
  "Borrow",
  "Free",
]);

// User Model
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // Or .default(sql`gen_random_uuid()`) if you prefer explicit SQL
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  supabaseUserId: text("supabase_user_id").unique().notNull(), // Assuming this is critical
  location: text("location"), // nullable location field
});

export type User = typeof users.$inferSelect;
export type AuthUser = AuthorizedUser;

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  shelves: many(shelves),
  bookEntries: many(bookEntries),
}));

export const genreTypeEnum = pgEnum("genre_type", [
  "Fiction",
  "Non-fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Biography",
  "Self-Help",
  "History",
  "Historical",
  "Travel",
  "Cooking",
  "Art",
  "Music",
  "Science",
  "Technology",
  "Horror",
  "Western",
  "Crime",
  "Drama",
  "Adventure",
  "Comedy",
  "Documentary",
  "Young Adult",
  "Poetry",
  "Historical Fiction",
]);

// Book Model
export const books = pgTable(
  "books",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    isbn10: text("isbn10").unique(),
    isbn13: text("isbn13").unique(),
    description: text("description"), // TEXT type is default for text()
    coverImageUrl: text("cover_image_url"),
    publicationDate: timestamp("publication_date", { withTimezone: true }),
    publisher: text("publisher"),
    pageCount: integer("page_count"),
    genres: genreTypeEnum("genres").array().notNull(),
    averageRating: real("average_rating"), // 'real' for single precision, 'doublePrecision' for double
  },
  (table) => {
    return [
      {
        titleIndex: index("books_title_idx").on(table.title),
        authorIndex: index("books_author_idx").on(table.author),
        // If you need full-text search, you'd typically add a tsvector column
        // and an index on that, which is more involved than a simple text index.
        // For example:
        // titleAuthorTsvector: tsvector('title_author_tsvector').generatedAs(sql`to_tsvector('english', ${table.title} || ' ' || ${table.author})`).stored(),
        // and then index on titleAuthorTsvector
      },
    ];
  },
);

export type Book = typeof books.$inferSelect;

export const booksRelations = relations(books, ({ many }) => ({
  reviews: many(reviews),
  bookEntries: many(bookEntries),
  sellerListings: many(sellerListings),
}));

// Review Model
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rating: integer("rating").notNull(), // Assuming 1-5, add check constraint if needed via SQL
    title: text("title"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Added onDelete cascade
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }), // Added onDelete cascade
  },
  (table) => {
    return [
      {
        userIdBookIdUnique: uniqueIndex(
          "reviews_user_id_book_id_unique_idx",
        ).on(table.userId, table.bookId), // If a user can review a book only once
        userIdIndex: index("reviews_user_id_idx").on(table.userId),
        bookIdIndex: index("reviews_book_id_idx").on(table.bookId),
      },
    ];
  },
);

export type Review = typeof reviews.$inferSelect;

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [reviews.bookId],
    references: [books.id],
  }),
}));

// Shelf Model
export const shelves = pgTable(
  "shelves",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // e.g., "Want to Read", "Currently Reading", "Read"
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return [
      {
        userIdNameUnique: uniqueIndex("shelves_user_id_name_unique_idx").on(
          table.userId,
          table.name,
        ),
        userIdIndex: index("shelves_user_id_idx").on(table.userId),
      },
    ];
  },
);

export const shelvesRelations = relations(shelves, ({ one, many }) => ({
  user: one(users, {
    fields: [shelves.userId],
    references: [users.id],
  }),
  bookEntries: many(bookEntries),
}));

// BookEntry Model (Junction table for User's Library)
export const bookEntries = pgTable(
  "book_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    addedAt: timestamp("added_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    shelfId: uuid("shelf_id")
      .notNull()
      .references(() => shelves.id, { onDelete: "cascade" }), // Books must belong to a shelf
  },
  (table) => {
    return [
      {
        // A book can typically be on only one shelf for a given user at a time.
        // Or if a book can be on multiple shelves for the same user, this unique constraint changes.
        // The prompt "compound unique index for userId, bookId, shelfId" implies a book can only be on a specific shelf once per user.
        // However, a more common scenario is that a book can only appear once in a user's *entire* library, regardless of shelf,
        // or it can be on *one* shelf at a time.
        // Assuming a book can only be on one shelf at a time for a user (i.e., unique by userId, bookId):
        // userBookUnique: uniqueIndex('book_entries_user_id_book_id_unique_idx').on(
        //     table.userId,
        //     table.bookId
        // ),
        // If a book *can* be on multiple different shelves for the same user, then the unique constraint is indeed (userId, bookId, shelfId)
        userBookShelfUnique: uniqueIndex(
          "book_entries_user_id_book_id_shelf_id_unique_idx",
        ).on(table.userId, table.bookId, table.shelfId),
        userIdIndex: index("book_entries_user_id_idx").on(table.userId),
        bookIdIndex: index("book_entries_book_id_idx").on(table.bookId),
        shelfIdIndex: index("book_entries_shelf_id_idx").on(table.shelfId),
      },
    ];
  },
);

export const bookEntriesRelations = relations(bookEntries, ({ one }) => ({
  user: one(users, {
    fields: [bookEntries.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [bookEntries.bookId],
    references: [books.id],
  }),
  shelf: one(shelves, {
    fields: [bookEntries.shelfId],
    references: [shelves.id],
  }),
}));

// New table for Sellers
export const sellers = pgTable("sellers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: sellerTypeEnum("type").notNull(),
  location: text("location").notNull(),
  locationLink: text("location_link").notNull(),
  websiteUrl: text("website_url"),
  phoneNumber: text("phone_number"),
  instagram: text("instagram"),
  telegram: text("telegram"),
  facebook: text("facebook"),
  imageUrl: text("image_url")
});

export const sellersRelations = relations(sellers, ({ many }) => ({
  sellerListings: many(sellerListings),
}));

export type SellerListings = typeof sellerListings.$inferSelect;
export const sellerListings = pgTable("seller_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id") // Foreign key referencing the new sellers table
    .notNull()
    .references(() => sellers.id, { onDelete: "cascade" }),
  price: real("price").notNull(),
  currency: text("currency").notNull().default("UZS"),
  available: boolean("available").default(true).notNull(),
  transactionType: transactionTypeEnum("transaction_type")
    .notNull()
    .default("Buy"),
  productLink: text("productLink").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sellerListingsRelations = relations(sellerListings, ({ one }) => ({
  book: one(books, {
    fields: [sellerListings.bookId],
    references: [books.id],
  }),
  seller: one(sellers, {
    // New relation to the seller table
    fields: [sellerListings.sellerId],
    references: [sellers.id],
  }),
}));
