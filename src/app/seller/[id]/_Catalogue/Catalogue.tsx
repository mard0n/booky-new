"use client";

import React from "react";
import BookCard from "~/app/explore/_components/BookCard";
import { api } from "~/trpc/react";

interface CatalogueProps {
  sellerId: string;
}

// type SellerListingsWithSeller =
//   inferRouterOutputs<AppRouter>["book"]["getSellerListingsByBookId"];

const Catalogue: React.FunctionComponent<CatalogueProps> = ({ sellerId }) => {
  const { data: books } = api.book.getBooksBySellerId.useQuery({
    id: sellerId,
  });
  
  if (!books?.length) {
    return (
      <div className="text-muted-foreground">
        Bu kitob uchun sotuvchilar yoki kutubxonalar topilmadi.
      </div>
    );
  }

  return (
    <div>
      {books.map((book) => {
        return <BookCard key={book.id} book={book} />
      })}
    </div>
  );
};

export default Catalogue;
