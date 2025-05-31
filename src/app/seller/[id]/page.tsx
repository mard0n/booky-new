import { Facebook, Globe, Instagram, Send } from "lucide-react";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import Catalogue from "./_Catalogue/Catalogue";

export default async function Seller({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = await api.seller.getSellerById({ id });
  if (!seller) return notFound();

  return (
    <>
      <section className="relative bg-black/50">
        {seller.imageUrl && <img src={seller.imageUrl} alt="bg-image" className="absolute top-0 left-0 w-full h-full -z-10 object-cover " />}
        <div className="container mx-auto py-40 text-center z-10 text-white">
          <h1 className="mx-auto max-w-2xl text-2xl">{seller.name}</h1>
          <p className="mx-auto max-w-2xl">{seller.location}</p>
          <div className="mt-4">
            <span>{seller.phoneNumber}</span>{" "}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {seller.websiteUrl && (
              <a
                href={seller.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Globe className="h-6 w-6" />
              </a>
            )}
            {seller.instagram && (
              <a
                href={`https://instagram.com/${seller.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {seller.facebook && (
              <a
                href={`https://facebook.com/${seller.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Facebook className="h-6 w-6" />
              </a>
            )}
            {seller.telegram && (
              <a
                href={`https://t.me/${seller.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Send className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </section>
      <section className="container mx-auto my-10">
        <Catalogue sellerId={seller.id} />
      </section>
    </>
  );
}
