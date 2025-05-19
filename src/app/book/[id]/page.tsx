import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import * as Tabs from "@radix-ui/react-tabs";
import ShowMoreText from "./_Reviews/_components/ShowMoreText";
import Rating from "~/components/rating";

import Reviews from "./_Reviews/Reviews";
import Sellers from "./_Sellers/Sellers";
import SellerListingsOverview from "./_SellerListingsOverview/SellerListingsOverview";

export default async function BookPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const book = await api.book.getById({ id: id });
  if (!book) return notFound();

  return (
    <>
      <section className="container mx-auto my-10 flex flex-col items-center gap-5 px-8 lg:flex-row lg:items-start">
        <BookCover src={book.coverImageUrl} alt={book.title} />
        <div className="mb-6 flex max-w-3xl flex-col items-center lg:items-start">
          <h1 className="mb-1 text-2xl font-bold">{book.title}</h1>
          <div className="text-muted-foreground mb-2">{book.author}</div>
          {book.averageRating ? (
            <div className="mb-6">
              <Rating rating={book.averageRating} size="lg" showNumber={true} />
            </div>
          ) : null}
          <ShowMoreText className="text-muted-foreground text-md mb-6 font-light">
            <>
              <div className="mb-5">
                {book.description ?? "No description."}
              </div>
              <dl className="grid grid-cols-[150px_1fr] gap-1">
                <dt>ISBN</dt>
                <dd>{book.isbn10 ?? "-"}</dd>
                <dt>ISBN 13</dt>
                <dd>{book.isbn13 ?? "-"}</dd>
                <dt>Pages</dt>
                <dd>{book.pageCount ?? "-"}</dd>
                <dt>Publisher</dt>
                <dd>{book.publisher ?? "-"}</dd>
                <dt>Release date</dt>
                <dd>
                  {book.publicationDate
                    ? new Date(book.publicationDate).toLocaleDateString()
                    : "-"}
                </dd>
                <dt>Genres</dt>
                <dd>{book.genres?.join(", ") ?? "-"}</dd>
              </dl>
            </>
          </ShowMoreText>
        </div>
        <SellerListingsOverview bookId={book.id} />
      </section>
      <section className="container mx-auto my-10 flex gap-5 px-8">
        <div className="hidden lg:invisible lg:block">
          <BookCover src={book.coverImageUrl} alt={book.title} />
        </div>
        <Tabs.Root defaultValue="reviews" className="w-full max-w-3xl">
          <Tabs.List className="mb-4 flex justify-around border-b">
            <Tabs.Trigger
              value="reviews"
              className="data-[state=active]:border-primary px-4 py-2 focus:outline-none data-[state=active]:border-b-2"
            >
              Reviews
            </Tabs.Trigger>
            <Tabs.Trigger
              value="get"
              className="data-[state=active]:border-primary px-4 py-2 focus:outline-none data-[state=active]:border-b-2"
            >
              Get the book
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

function BookCover({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="bg-muted flex aspect-[1/1.51] h-full w-[200px] shrink-0 items-center justify-center overflow-hidden rounded lg:w-[200px] xl:w-[250px] 2xl:w-[300px]">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-muted-foreground">No cover</span>
      )}
    </div>
  );
}
