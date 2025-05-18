import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserBySupabaseId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.supabaseUserId, input.id),
    });
  }),
}); 