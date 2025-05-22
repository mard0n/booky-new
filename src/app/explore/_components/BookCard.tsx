"use client";

import Link from "next/link";
import * as React from "react";
import Rating from "~/components/rating";
import type { Book } from "~/server/db/schema";

interface BookCardProps {
  book: Book;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
}

export function BookCard({ book, onDragStart }: BookCardProps) {
  const { coverImageUrl, title, id, author } = book;
  return (
    <div
      className="bg-card w-50 flex-shrink-0 cursor-pointer rounded-lg border p-2 shadow"
      draggable
      onDragStart={onDragStart}
    >
      <Link href={`/book/${id}`} className="block">
        <div className="bg-muted mb-2 flex h-72 w-full items-center justify-center overflow-hidden rounded">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">Muqovasiz</span>
          )}
        </div>
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="text-muted-foreground truncate text-xs">{author}</div>
        {book.averageRating ? (
          <div className="mt-1 flex gap-0.5">
            <Rating rating={book.averageRating} size="sm" />
          </div>
        ) : null}
      </Link>
    </div>
  );
}
export default BookCard;
