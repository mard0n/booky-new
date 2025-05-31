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
  const { data: sellerListings, isLoading } =
    api.book.getSellerListingsByBookId.useQuery({
      id: bookId,
    });

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Kitob haqida ma&apos;lumotlar yuklanmoqda...
      </div>
    );
  }

  if (!sellerListings?.length) {
    return (
      <div className="text-muted-foreground">
        Bu kitob uchun sotuvchilar yoki kutubxonalar topilmadi.
      </div>
    );
  }

  const LinkExternalIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="inline-block size-5 align-sub"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
        />
      </svg>
    );
  };

  const Cta = ({
    sellerListing,
  }: {
    sellerListing: SellerListingsWithSeller[number];
  }) => {
    switch (sellerListing.transactionType) {
      case "Free":
        return (
          <Button>
            Bepul olish <LinkExternalIcon />
          </Button>
        );

      case "Borrow":
        return (
          <Button>
            Ijaraga olish <LinkExternalIcon />
          </Button>
        );

      case "Buy":
        return (
          <Button>
            {sellerListing.currency}
            {sellerListing.price} ga sotib olish <LinkExternalIcon />
          </Button>
        );
      default:
        return (
          <Button>
            Olish <LinkExternalIcon />
          </Button>
        );
    }
  };

  const DefaultSellerImage = ({
    sellerListing,
  }: {
    sellerListing: SellerListingsWithSeller[number];
  }) => {
    if (!sellerListing.seller.imageUrl) {
      return (
        <img
          className="h-full w-full object-cover"
          src="/library.png"
          alt="library"
        />
      );
    } else {
      return <img src={sellerListing.seller.imageUrl} alt="seller thumbnail" />
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {sellerListings.map((sellerListing) => {
        return (
          <Card
            key={sellerListing.id}
            className="relative flex flex-row overflow-hidden rounded-none"
          >
            <CardContent className="flex gap-4">
              <div className="flex flex-col justify-between">
                <div>
                  <Link
                    href={`/seller/${sellerListing.seller.id}`}
                    className="block hover:opacity-80"
                  >
                    <h3 className="mb-2 text-xl">
                      {sellerListing.seller.name}
                    </h3>
                  </Link>
                  <a
                    href={sellerListing.seller.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800"
                  >
                    <p className="mb-4">
                      {sellerListing.seller.location} <LinkExternalIcon />
                    </p>
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
                    className="h-full w-full object-cover"
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
      })}
    </div>
  );
};

export default Sellers;
