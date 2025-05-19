"use client";

import React from "react";
import Rating from "~/components/rating";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Review, User } from "~/server/db/schema";
import ShowMoreText from "./ShowMoreText";

interface ReviewBlockProps {
  review: Review;
  reviewer: User;
}

const ReviewBlock: React.FunctionComponent<ReviewBlockProps> = ({
  review,
  reviewer
}) => {
  return (
    <div key={review.id}>
      <div className="mb-4 flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={reviewer.avatarUrl ?? undefined}
            alt={reviewer.name ?? ""}
          />
          <AvatarFallback>{reviewer.name?.at(0)}</AvatarFallback>
        </Avatar>
        <div className="">{reviewer.name ?? reviewer.email}</div>
      </div>
      <div className="mb-2 flex items-center gap-4">
        <Rating rating={review.rating} size="md" />
        <span className="text-xl font-bold">{review.title}</span>
      </div>
      <div className="mb-2 text-sm text-gray-400">
        {new Date(review.createdAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
      <ShowMoreText>
        <div className="mb-2">{review.content}</div>
      </ShowMoreText>
    </div>
  );
};

export default ReviewBlock;
