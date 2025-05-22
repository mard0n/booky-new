import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getUserBySupabaseId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.supabaseUserId, input.id),
    });
  }),
  updateProfile: publicProcedure.input(z.object({
    supabaseUserId: z.string(),
    name: z.string().optional(),
    location: z.string().optional(),
    avatarUrl: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    const { supabaseUserId, name, location, avatarUrl } = input;
    const [updatedUser] = await ctx.db.update(users)
      .set({
        name,
        location,
        avatarUrl,
      })
      .where(eq(users.supabaseUserId, supabaseUserId))
      .returning();
    return updatedUser;
  }),
}); 