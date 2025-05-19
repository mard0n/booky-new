import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const sellerRouter = createTRPCRouter({
  getSellerById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.query.sellers.findFirst({
      where: (sellers, { eq }) => eq(sellers.id, input.id),
    });
  }),
}); 