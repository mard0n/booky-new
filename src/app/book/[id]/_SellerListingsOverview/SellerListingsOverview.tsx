"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface SellerListingsOverviewProps {
  bookId: string;
}

const SellerListingsOverview: React.FunctionComponent<
  SellerListingsOverviewProps
> = ({ bookId }) => {
  const { data: sellerListings } = api.book.getSellerListingsByBookId.useQuery({
    id: bookId,
  });

  if (!sellerListings?.length) {
    return null;
  }

  return (
    <div className="flex min-w-xs flex-col gap-4 rounded-2xl border p-4">
      <h1 className="text-lg font-semibold">Kitob bor joylar ({sellerListings.length})</h1>
      <ul className="flex flex-col gap-2">
        {sellerListings.map((sellerListing, i) => {
          if (i >= 5) {
            return null;
          }

          return (
            <li className="text-sm" key={sellerListing.id}>
              <a
                href={sellerListing.productLink ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{sellerListing.seller.name}</span>{" "}
                <span>{sellerListing.seller.location}</span>
              </a>
            </li>
          );
        })}
      </ul>

      {sellerListings.length > 5 && (
        <div>
          <Button className="mx-auto block" variant="link">
            Barchasini ko&apos;rish ({sellerListings.length})
          </Button>
        </div>
      )}
      {/* <Button className="mx-auto block" variant="link">
          Batafsil ma&apos;lumot
        </Button> */}
    </div>
  );
};

export default SellerListingsOverview;
