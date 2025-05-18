import React from "react";
import type { Book } from "~/server/db/schema";

interface RatingProps {
  rating: number;
  showNumber?: boolean;
  // showDetails?: boolean;
  size: "sm" | "md" | "lg";
}

const Rating: React.FunctionComponent<RatingProps> = ({
  rating,
  size,
  showNumber,
  // showDetails,
}) => {
  const textSize =
    size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg";
  return (
    <>
      <div className={`${textSize} `}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={
              n <= (rating ?? 0)
                ? "text-yellow-400"
                : "text-muted-foreground"
            }
          >
            ★
          </span>
        ))}
        {showNumber ? <span className="ml-3">{rating}</span> : null}
      </div>
      {/* {showDetails ? (
        <div>
          <div className="mb-2 text-lg font-bold">{totalRatings} ratings</div>
          <div className="mb-4 space-y-2">
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = ratingCounts[star - 1]!;
              const percent = totalRatings
                ? Math.round((count / totalRatings) * 100)
                : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-16 font-bold">{star} stars</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-24 text-right">
                    {count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null} */}
    </>
  );
};

export default Rating;
