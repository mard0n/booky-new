"use client";

import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { ContactModal } from "./_components/ContactModal";

interface SellersProps {
  bookId: string;
}

type SellerListingsWithSeller =
  inferRouterOutputs<AppRouter>["book"]["getSellerListingsByBookId"];

const Sellers: React.FunctionComponent<SellersProps> = ({ bookId }) => {
  const { data: sellerListings } = api.book.getSellerListingsByBookId.useQuery({
    id: bookId,
  });

  if (!sellerListings?.length) {
    return (
      <div className="text-muted-foreground">
        Bu kitob uchun sotuvchilar yoki kutubxonalar topilmadi.
      </div>
    );
  }

  const Cta = ({
    sellerListing,
  }: {
    sellerListing: SellerListingsWithSeller[number];
  }) => {
    switch (sellerListing.transactionType) {
      case "Free":
        return <Button>Bepul olish</Button>;

      case "Borrow":
        return <Button>Ijaraga olish</Button>;

      case "Buy":
        return (
          <Button>
            {sellerListing.currency}
            {sellerListing.price} ga sotib olish
          </Button>
        );
      default:
        return <Button>Olish</Button>;
    }
  };

  const DefaultSellerImage = ({
    sellerListing,
  }: {
    sellerListing: SellerListingsWithSeller[number];
  }) => {
    switch (sellerListing.seller.type) {
      case "Library":
        return (
          <img
            className="object-cover h-full w-full"
            src="/1614898058-library-academic.svg"
            alt="seller"
          />
        );

      case "Seller":
        return (
          <img
            className="object-cover h-full w-full"
            src="/1614898058-library-academic.svg"
            alt="seller"
          />
        );

      default:
        break;
    }
  };

  return sellerListings.map((sellerListing) => {
    return (
      <Card
        key={sellerListing.id}
        className="relative flex flex-row overflow-hidden"
      >
        <CardContent className="flex gap-4">
          <div className="flex flex-col justify-between">
            <div>
              <Link href={`/seller/${sellerListing.seller.id}`} className="block">
                <h3 className="mb-2 text-xl">{sellerListing.seller.name}</h3>
              </Link>
              <a
                href={sellerListing.seller.locationLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="mb-4">{sellerListing.seller.location}</p>
              </a>
            </div>

            <div className="mt-6 flex flex-col">
              {sellerListing.available ? (
                <div className="flex gap-4">
                  <a
                    href={sellerListing.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Cta sellerListing={sellerListing} />
                  </a>
                  <ContactModal sellerListing={sellerListing} />
                </div>
              ) : (
                <ContactModal sellerListing={sellerListing} />
              )}
            </div>
          </div>
          <div className="aspect-square w-2/5">
            {sellerListing.seller.imageUrl ? (
              <img
                className="object-cover h-full w-full"
                src={sellerListing.seller.imageUrl}
                alt="seller"
              />
            ) : (
              <DefaultSellerImage sellerListing={sellerListing} />
            )}
          </div>
        </CardContent>
      </Card>
    );
  });
};

export default Sellers;
