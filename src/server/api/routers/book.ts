import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { books, genreTypeEnum, reviews, bookEntries, shelves, users } from "~/server/db/schema";
import { z } from "zod";
import { sql, eq, asc, inArray, and } from "drizzle-orm";

export const bookRouter = createTRPCRouter({
  getPopular: publicProcedure.query(async ({ ctx }) => {
    // Example: get top 10 books by averageRating
    return ctx.db.query.books.findMany({
      orderBy: (books, { desc }) => [desc(books.averageRating)],
      limit: 20,
      columns: {
        id: true,
        title: true,
        author: true,
        isbn10: true,
        isbn13: true,
        description: true,
        coverImageUrl: true,
        publicationDate: true,
        publisher: true,
        pageCount: true,
        genres: true,
        averageRating: true,
      },
    });
  }),
  getByCategory: publicProcedure.input(z.object({ category: z.enum(genreTypeEnum.enumValues) })).query(async ({ ctx, input }) => {
    // Filter by genres column (enum, not array)
    return ctx.db.query.books.findMany({
      where: sql`${books.genres} @> ARRAY[${input.category}]::genre_type[]`,
      limit: 20,
      columns: {
        id: true,
        title: true,
        author: true,
        isbn10: true,
        isbn13: true,
        description: true,
        coverImageUrl: true,
        publicationDate: true,
        publisher: true,
        pageCount: true,
        genres: true,
        averageRating: true,
      },
    });
  }),
  getById: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    return ctx.db.query.books.findFirst({
      where: (books, { eq }) => eq(books.id, input.id),
      columns: {
        id: true,
        title: true,
        author: true,
        isbn10: true,
        isbn13: true,
        description: true,
        coverImageUrl: true,
        publicationDate: true,
        publisher: true,
        pageCount: true,
        genres: true,
        averageRating: true,
      },
    });
  }),
  getReviewsByBookId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    return ctx.db.query.reviews.findMany({
      where: (reviews, { eq }) => eq(reviews.bookId, input.id),
      with: {
        user: {
          columns: {
            name: true,
            avatarUrl: true,
            email: true,
            id: true,
            supabaseUserId: true,
          },
        },
      },
    });
  }),
  getShelvesByBookId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    // Find all shelves (with user info) that contain this book
    return ctx.db.query.bookEntries.findMany({
      where: (bookEntries, { eq }) => eq(bookEntries.bookId, input.id),
      with: {
        shelf: true,
        user: true,
      },
    });
  }),
  getSellerListingsByBookId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    return ctx.db.query.sellerListings.findMany({
      where: (sellerListings, { eq }) => eq(sellerListings.bookId, input.id),
      orderBy: (sellerListings, { asc }) => [
        asc(sql`CASE ${sellerListings.transactionType}
          WHEN 'Free' THEN 1
          WHEN 'Borrow' THEN 2
          WHEN 'Buy' THEN 3
          ELSE 4
        END`),
      ],
      columns: {
        id: true,
        price: true,
        currency: true,
        available: true,
        transactionType: true,
        productLink: true
      },
      with: {
        seller: {
          columns: {
            id: true,
            name: true,
            type: true,
            location: true,
            locationLink: true,
            websiteUrl: true,
            telegram: true,
            instagram: true,
            phoneNumber: true,
            facebook: true,
            imageUrl: true,
          },
        },
      },
    });
  }),
  getBooksBySellerId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    return ctx.db.query.books.findMany({
      with: {
        sellerListings: {
          where: (sellerListings, { eq }) => eq(sellerListings.sellerId, input.id),
        },
      },
      columns: {
        id: true,
        title: true,
        author: true,
        isbn10: true,
        isbn13: true,
        description: true,
        coverImageUrl: true,
        publicationDate: true,
        publisher: true,
        pageCount: true,
        genres: true,
        averageRating: true,
      },
    });
  }),
  
  createReview: publicProcedure
    .input(z.object({
      bookId: z.string().uuid(),
      rating: z.number().int().min(1).max(5),
      title: z.string().optional(),
      content: z.string().min(1),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [newReview] = await ctx.db.insert(reviews).values({
        bookId: input.bookId,
        rating: input.rating,
        title: input.title,
        content: input.content,
        userId: input.userId,
      }).returning();
      return newReview;
    }),
  updateReview: publicProcedure
    .input(z.object({
      reviewId: z.string().uuid(),
      rating: z.number().int().min(1).max(5).optional(),
      title: z.string().optional(),
      content: z.string().min(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [updatedReview] = await ctx.db.update(reviews)
        .set({
          rating: input.rating,
          title: input.title,
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, input.reviewId))
        .returning();
      return updatedReview;
    }),
  deleteReview: publicProcedure
    .input(z.object({
      reviewId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(reviews)
        .where(eq(reviews.id, input.reviewId));
      return { success: true };
    }),
  addToLibrary: publicProcedure
    .input(z.object({
      bookId: z.string().uuid(),
      supabaseUserId: z.string(),
      shelfName: z.string().optional().default("My reading list"),
    }))
    .mutation(async ({ ctx, input }) => {
      // Look up the internal user by supabaseUserId
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.supabaseUserId, input.supabaseUserId),
      });
      if (!user) {
        throw new Error("Not authenticated");
      }
      // Find or create the shelf
      let shelf = await ctx.db.query.shelves.findFirst({
        where: (shelves, { eq, and }) =>
          and(eq(shelves.userId, user.id), eq(shelves.name, input.shelfName)),
      });
      if (!shelf) {
        [shelf] = await ctx.db.insert(shelves).values({
          userId: user.id,
          name: input.shelfName,
        }).returning();
      }
      if (!shelf) {
        throw new Error("Could not create or find shelf");
      }
      // Check if the book is already on this shelf
      const existing = await ctx.db.query.bookEntries.findFirst({
        where: (bookEntries, { eq, and }) =>
          and(
            eq(bookEntries.userId, user.id),
            eq(bookEntries.bookId, input.bookId),
            eq(bookEntries.shelfId, shelf.id)
          ),
      });
      if (existing) return existing;
      // Add the book to the shelf
      const [entry] = await ctx.db.insert(bookEntries).values({
        userId: user.id,
        bookId: input.bookId,
        shelfId: shelf.id,
      }).returning();
      return entry;
    }),
  getUserShelvesWithBook: publicProcedure
    .input(z.object({ supabaseUserId: z.string(), bookId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.supabaseUserId, input.supabaseUserId),
      });
      if (!user) throw new Error("Not authenticated");
      // Get all shelves for the user
      const shelves = await ctx.db.query.shelves.findMany({
        where: (shelves, { eq }) => eq(shelves.userId, user.id),
      });
      // Get all bookEntries for this book/user
      const bookEntries = await ctx.db.query.bookEntries.findMany({
        where: (bookEntries, { eq, and }) =>
          and(eq(bookEntries.userId, user.id), eq(bookEntries.bookId, input.bookId)),
      });
      const shelfIdsWithBook = new Set(bookEntries.map(be => be.shelfId));
      return {
        shelves: shelves.map(shelf => ({
          id: shelf.id,
          name: shelf.name,
          hasBook: shelfIdsWithBook.has(shelf.id),
        })),
      };
    }),
  setBookShelves: publicProcedure
    .input(z.object({
      supabaseUserId: z.string(),
      bookId: z.string().uuid(),
      shelfIds: z.array(z.string().uuid()),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.supabaseUserId, input.supabaseUserId),
      });
      if (!user) throw new Error("Not authenticated");
      // Get all current bookEntries for this book/user
      const currentEntries = await ctx.db.query.bookEntries.findMany({
        where: (bookEntries, { eq, and }) =>
          and(eq(bookEntries.userId, user.id), eq(bookEntries.bookId, input.bookId)),
      });
      const currentShelfIds = new Set(currentEntries.map(be => be.shelfId));
      const newShelfIds = new Set(input.shelfIds);
      // Remove from shelves not in newShelfIds
      const toRemove = currentEntries.filter(be => !newShelfIds.has(be.shelfId));
      if (toRemove.length > 0) {
        await ctx.db.delete(bookEntries).where(
          and(
            eq(bookEntries.userId, user.id),
            eq(bookEntries.bookId, input.bookId),
            inArray(bookEntries.shelfId, toRemove.map(be => be.shelfId))
          )
        );
      }
      // Add to shelves not in currentShelfIds
      const toAdd = input.shelfIds.filter(sid => !currentShelfIds.has(sid));
      if (toAdd.length > 0) {
        await ctx.db.insert(bookEntries).values(
          toAdd.map(shelfId => ({
            userId: user.id,
            bookId: input.bookId,
            shelfId,
          }))
        );
      }
      return { shelfIds: input.shelfIds };
    }),
  createShelf: publicProcedure
    .input(z.object({ supabaseUserId: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.supabaseUserId, input.supabaseUserId),
      });
      if (!user) throw new Error("Not authenticated");
      // Check if shelf with this name already exists for user
      let shelf = await ctx.db.query.shelves.findFirst({
        where: (shelves, { eq, and }) => and(eq(shelves.userId, user.id), eq(shelves.name, input.name)),
      });
      if (shelf) return { shelf };
      [shelf] = await ctx.db.insert(shelves).values({ userId: user.id, name: input.name }).returning();
      return { shelf };
    }),
}); 