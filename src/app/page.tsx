import { api, HydrateClient } from "~/trpc/server";
import Footer from "../components/Footer";
import Image from "next/image";

export default async function Home() {
  // Fetch popular books for covers
  const books = await api.book.getPopular();

  return (
    <HydrateClient>
      <main className="flex flex-col">
        <section className="flex flex-col items-center justify-center py-16">
          <h1 className="mb-8 text-center text-3xl font-extrabold md:text-4xl">
            Discover, discuss, and
            <br />
            get books from places near you
          </h1>
          <div className="mb-12 flex max-w-4xl flex-wrap justify-center gap-4">
            {books
              .slice(0, 14)
              .map((book, i) => (
                <div
                  key={book.id}
                  className="bg-muted flex h-36 w-24 items-center justify-center rounded-lg border shadow"
                  style={{
                    transform: `translateY(${((i % 3) - 1) * 20}px) rotate(${(i % 2 === 0 ? 1 : -1) * (5 + i)}deg)`,
                  }}
                >
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">No cover</span>
                  )}
                </div>
              ))}
          </div>
        </section>
        <section className="bg-muted/40 flex flex-col items-center py-16">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">
            We are expanding
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-card flex h-20 w-20 items-center justify-center rounded-xl border">
                {/* City illustration placeholder */}
                <span role="img" aria-label="city" className="text-3xl">
                  🏙️
                </span>
              </div>
              <span className="font-semibold">3 cities</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-card flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border">
                <Image
                  src="/1614898058-library-academic.svg"
                  alt="libraries"
                  width={80}
                  height={80}
                />
              </div>
              <span className="text-center font-semibold">
                153 libraries
                <br />
                and bookshops
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-card flex h-20 w-20 items-center justify-center rounded-xl border">
                {/* Book illustration placeholder */}
                <span role="img" aria-label="books" className="text-3xl">
                  📚
                </span>
              </div>
              <span className="font-semibold">150,00 books</span>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </HydrateClient>
  );
}
