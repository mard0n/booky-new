import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import * as Tabs from "@radix-ui/react-tabs";
import ShowMoreText from "./_components/ShowMoreText";
import Rating from "~/components/rating";

import Reviews from "./_components/Reviews";

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

export default async function BookPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const book = await api.book.getById({ id: id });
  if (!book) return notFound();

  // Fetch data for all tabs
  // const [reviews, shelves, sellers] = await Promise.all([
  //   api.book.getReviewsByBookId({ id: id }),
  //   api.book.getShelvesByBookId({ id: id }),
  //   api.book.getSellerListingsByBookId({ id: id }),
  // ]);

  // console.log('reviews', reviews);
  


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
            {/* <Tabs.Trigger
              value="shelves"
              className="data-[state=active]:border-primary px-4 py-2 focus:outline-none data-[state=active]:border-b-2"
            >
              Shelves
            </Tabs.Trigger> */}
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
          <Tabs.Content value="shelves" className="py-4">
            {/* {shelves.length === 0 ? (
              <div className="text-muted-foreground">
                This book is not on any shelves yet.
              </div>
            ) : (
              <ul className="space-y-2">
                {shelves.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col rounded border p-2 md:flex-row md:items-center md:gap-2"
                  >
                    <span className="font-semibold">{entry.shelf.name}</span>
                    <span className="text-muted-foreground text-xs">
                      by {entry.user.name ?? entry.user.email}
                    </span>
                  </li>
                ))}
              </ul>
            )} */}
          </Tabs.Content>
          <Tabs.Content value="get" className="py-4">
            {/* {sellers.length === 0 ? (
              <div className="text-muted-foreground">
                No sellers or libraries found for this book.
              </div>
            ) : (
              <ul className="space-y-4">
                {sellers.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-col rounded border p-3 md:flex-row md:items-center md:gap-4"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{s.sellerName}</div>
                      <div className="text-muted-foreground mb-1 text-xs">
                        {s.sellerType}
                      </div>
                      {s.location && (
                        <div className="text-xs">{s.location}</div>
                      )}
                      {s.availability && (
                        <div className="text-xs">{s.availability}</div>
                      )}
                      {s.notes && (
                        <div className="text-xs italic">{s.notes}</div>
                      )}
                    </div>
                    {s.price && (
                      <div className="text-primary font-bold">
                        {s.price} {s.currency ?? ""}
                      </div>
                    )}
                    {s.websiteUrl && (
                      <a
                        href={s.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 underline"
                      >
                        Visit
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )} */}
          </Tabs.Content>
        </Tabs.Root>
      </section>
    </>
  );
}
