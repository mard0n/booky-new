import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import * as Tabs from "@radix-ui/react-tabs";
import Rating from "~/components/rating";

import Reviews from "./_Reviews/Reviews";
import Sellers from "./_Sellers/Sellers";
// import SellerListingsOverview from "./_SellerListingsOverview/SellerListingsOverview";
import SaveButton from "~/components/SaveButton";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await api.book.getById({ id: id });
  if (!book) return notFound();

  const sellerListings = await api.book.getSellerListingsByBookId({
    id: book.id,
  });
  // const { data: sellerListings } = api.book.getSellerListingsByBookId.useQuery({
  //   id: bookId,
  // });

  return (
    <>
      <section className="container mx-auto my-10 flex flex-col items-center gap-5 px-8 lg:flex-row lg:items-start">
        <BookCover src={book.coverImageUrl} alt={book.title} bookId={book.id} />
        <div className="mb-6 flex max-w-3xl flex-col items-center lg:items-start">
          <h1 className="font-libre mb-1 text-3xl">{book.title}</h1>
          <div className="mb-2 text-gray-500">{book.author}</div>
          {book.averageRating ? (
            <div className="mb-6">
              <Rating rating={book.averageRating} size="lg" showNumber={true} />
            </div>
          ) : null}
          <div className="text-gray-500">
            <div className="mb-5">{book.description ?? "Tavsif yo'q."}</div>
            <dl className="grid grid-cols-[150px_1fr] gap-1 text-gray-400/80">
              <dt>Nashr sanasi</dt>
              <dd>{book.publicationDate ?? "-"}</dd>
              <dt>Janrlar</dt>
              <dd>{book.genres?.join(", ") ?? "-"}</dd>
            </dl>
          </div>
        </div>
        {/* <SellerListingsOverview bookId={book.id} /> */}
      </section>
      <section className="container mx-auto my-10 flex gap-5 px-8">
        <div className="hidden lg:invisible lg:block">
          <BookCover
            src={book.coverImageUrl}
            alt={book.title}
            bookId={book.id}
          />
        </div>
        <Tabs.Root defaultValue="reviews" className="w-full max-w-3xl">
          <Tabs.List className="mb-4 flex justify-around border-b">
            <Tabs.Trigger
              value="reviews"
              className="data-[state=active]:border-primary hover:text-primary/80 cursor-pointer px-4 py-2 focus:outline-none data-[state=active]:border-b-2"
            >
              Fikrlar
            </Tabs.Trigger>
            <Tabs.Trigger
              value="get"
              className="data-[state=active]:border-primary hover:text-primary/80 cursor-pointer px-4 py-2 focus:outline-none data-[state=active]:border-b-2"
            >
              Kitobni olish ({sellerListings.length})
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="reviews" className="py-4">
            <Reviews bookId={book.id} />
          </Tabs.Content>
          <Tabs.Content value="get" className="py-4">
            <Sellers bookId={book.id} />
          </Tabs.Content>
        </Tabs.Root>
      </section>
    </>
  );
}

function BookCover({
  src,
  alt,
  bookId,
}: {
  src: string | null;
  alt: string;
  bookId: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted flex aspect-[1/1.51] h-full w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-xl lg:w-[200px] xl:w-[250px] 2xl:w-[300px]">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="text-muted-foreground">Muqova yo&apos;q</span>
        )}
      </div>
      <SaveButton bookId={bookId} />
    </div>
  );
}
