import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { books, genreTypeEnum, reviews } from "~/server/db/schema";
import { z } from "zod";
import { sql, eq } from "drizzle-orm";

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
      columns: {
        id: true,
        sellerName: true,
        sellerType: true,
        location: true,
        price: true,
        currency: true,
        availability: true,
        websiteUrl: true,
        notes: true,
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
}); 