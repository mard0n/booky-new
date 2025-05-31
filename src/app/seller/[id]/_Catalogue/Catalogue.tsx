"use client";

import React from "react";
import BookCard from "~/app/explore/_components/BookCard";
import { api } from "~/trpc/react";

interface CatalogueProps {
  sellerId: string;
}

const Catalogue: React.FunctionComponent<CatalogueProps> = ({ sellerId }) => {
  const { data: listings, isLoading } = api.book.getBooksBySellerId.useQuery({
    sellerId,
  });

  if (isLoading) {
    return <div>Tortilmoqda...</div>;
  }

  if (!listings?.length) {
    return (
      <div className="text-muted-foreground">
        Bu sotuvchida kitoblar mavjud emas.
      </div>
    );
  }

  return (
    <div className="flex gap-10 flex-wrap justify-center">
      {listings.map((listing) => (
        <BookCard key={listing.id} book={listing.book} />
      ))}
    </div>
  );
};

export default Catalogue;
