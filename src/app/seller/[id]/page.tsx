import { Facebook, Globe, Instagram, Send } from "lucide-react";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import Catalogue from "./_Catalogue/Catalogue";

export default async function Seller({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = await api.seller.getSellerById({ id });
  console.log("seller", seller);
  if (!seller) return notFound();

  return (
    <>
      <section className="container mx-auto my-10 text-center">
        <h1 className="mx-auto max-w-2xl text-2xl">{seller.name}</h1>
        <p className="mx-auto max-w-2xl">{seller.location}</p>
        <div>
          <span>{seller.phoneNumber}</span>{" "}
        </div>
        <div className="flex justify-center gap-1">
          {seller.websiteUrl && (
            <a
              href={seller.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
          {seller.instagram && (
            <a
              href={`https://instagram.com/${seller.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
          {seller.facebook && (
            <a
              href={`https://facebook.com/${seller.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Facebook className="h-4 w-4" />
            </a>
          )}
          {seller.telegram && (
            <a
              href={`https://t.me/${seller.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Send className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>
      <section className="container mx-auto my-10">
        <Catalogue sellerId={seller.id} />
      </section>
    </>
  );
}
