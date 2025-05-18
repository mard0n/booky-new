"use client";

import React, { useEffect, useState } from "react";
import type { AuthUser } from "~/server/db/schema";
import { supabase } from "~/lib/supabaseClient";
import { api } from "~/trpc/react";
import ReviewBlock from "./ReviewBlock";
import ReviewForm from "./ReviewForm";
import { Button } from "~/components/ui/button";

// type BookReviews = inferRouterOutputs<AppRouter>["book"]["getReviewsByBookId"];

interface ReviewsProps {
  bookId: string;
}

const Reviews: React.FunctionComponent<ReviewsProps> = ({ bookId }) => {
  const { data: reviews } = api.book.getReviewsByBookId.useQuery({
    id: bookId,
  });

  console.log('reviews', reviews);
  

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const { data: userData } = api.user.getUserBySupabaseId.useQuery(
    { id: authUser?.id ?? "" },
    { enabled: !!authUser },
  );

  const user = userData ?? null;

  useEffect(() => {
    async function fetchAuthUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAuthUser(user);
    }
    fetchAuthUser();
  }, []);

  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  if (!reviews?.length) {
    return (
      <>
        <div className="mb-4 flex justify-between">
          <h2 className="mb-4 text-2xl font-bold">Ratings & Reviews</h2>
          <Button onClick={() => setIsReviewFormOpen(true)}>
            + Write a review
          </Button>
        </div>
        <div className="text-muted-foreground">No reviews yet.</div>
        <ReviewForm
          bookId={bookId}
          user={user ?? undefined}
          review={undefined}
          open={isReviewFormOpen}
          onOpenChange={setIsReviewFormOpen}
        />
      </>
    );
  }

  const userReview = user ? reviews.find((r) => r.user.id === user.id) : null;
  const otherReviews = user
    ? reviews.filter((r) => r.user.id !== user.id)
    : reviews;

  return (
    <>
      <div className="mb-8 flex flex-col gap-10">
        {userReview && (
          <div>
            <h2 className="mb-4 text-2xl font-bold">Your Review</h2>
            <ReviewBlock review={userReview} reviewer={userReview.user} />
            <Button onClick={() => setIsReviewFormOpen(true)}>Edit</Button>
          </div>
        )}
        {otherReviews.length ? (
          <div>
            <div className="mb-4 flex justify-between">
              <h2 className="mb-4 text-2xl font-bold">Ratings & Reviews</h2>
              {!userReview && (
                <Button onClick={() => setIsReviewFormOpen(true)}>
                  + Write a review
                </Button>
              )}
            </div>
            <div className="flex flex-col space-y-10 divide-y divide-gray-200">
              {otherReviews.map((r) => (
                <div key={r.id} className="pb-10">
                  <ReviewBlock review={r} reviewer={r.user} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <ReviewForm
        bookId={bookId}
        user={user ?? undefined}
        review={userReview ?? undefined}
        open={isReviewFormOpen}
        onOpenChange={setIsReviewFormOpen}
      />
    </>
  );
};

export default Reviews;
