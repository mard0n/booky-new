"use client";

import type { Book } from "~/server/db/schema";
import BookCard from "./BookCard";

interface BookCategorySectionProps {
  title: string;
  books: Book[];
}

export default function BookCategorySection({
  title,
  books
}: BookCategorySectionProps) {
  if (books.length === 0) {
    return null;
  }
  return (
    <section className="my-8">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-auto py-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onDragStart={(e) => e.dataTransfer.setData("bookId", book.id)}
          />
        ))}
        {/* {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((i) => (
          <BookCard
            key={books[0]!.id + i}
            book={books[0]!}
            onDragStart={(e) => e.dataTransfer.setData("bookId", books[0]!.id)}
          />
        ))} */}
      </div>
    </section>
  );
}
