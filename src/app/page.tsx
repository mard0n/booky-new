import { api, HydrateClient } from "~/trpc/server";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // Fetch popular books for covers
  const books = await api.book.getPopular();

  const bookPositions = [
    [-50, 90, 5, 1],
    [-30, 90, 0, 1],
    [-30, 90, 0, 1],
    [100, 300, -6, 1],
    [130, -250, 0, 1],
    [210, 80, 0, 1],
    [190, 40, 0, 1],
    [260, 160, 10, 1],
    [-10, -180, 15, 1],
    [10, -50, 0, 1],
    [120, 200, 0, 1],
    [10, 170, 8, 1],
    [220, -90, 0, 1],
    [140, -110, 0, 1],
    [80, 130, 0, 1],
    [-60, 60, -6, 1],
    [70, -20, -12, 1],
    [80, 30, 0, 1],
    [100, -30, 0, 1],
    [150, 50, 7, 1],
  ];
  return (
    <HydrateClient>
      <main className="flex flex-col">
        <section className="flex flex-col items-center justify-center py-20">
          <h1 className="mb-25 pb-2 text-center font-serif text-5xl font-semibold tracking-tighter">
            Yangi kitoblarni kashf eting, <br />muhokama qiling va ularni <br /> atrofingizdagi joylardan oling
          </h1>
          <div className="grid w-full max-w-5xl grid-cols-4 justify-center pb-[400px]">
            {bookPositions.map((position, index) => (
              <div key={books[index]?.id} className="relative">
                <div
                  className="bg-muted absolute flex aspect-[1/1.51] w-24 shrink-0 overflow-hidden rounded-md border shadow"
                  style={{
                    transform: `translateY(${position[0]}px) translateX(${position[1]}px) rotate(${position[2]}deg) scale(${position[3]})`,
                  }}
                >
                  {books[index]?.coverImageUrl ? (
                    <Link href={`/book/${books[index].id}`}>
                      <img
                        src={books[index].coverImageUrl}
                        alt={books[index].title}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Muqovasiz</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-muted flex flex-col items-center py-16">
          <h1 className="mb-10 pb-2 text-center font-serif text-5xl font-semibold tracking-tighter">
            Bizning faoliyatimiz kengaymoqda
          </h1>
          <div className="grid grid-cols-2 container mx-auto max-w-5xl">
            <div className="relative row-span-2 bg-card aspect-square w-full h-full">
              <span className="absolute">3 shaxar</span>
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
                150+ kutubxona
                <br />
                va kitob do&apos;konlari
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-card flex h-20 w-20 items-center justify-center rounded-xl border">
                {/* Book illustration placeholder */}
                <span role="img" aria-label="books" className="text-3xl">
                  📚
                </span>
              </div>
              <span className="font-semibold">150,000 kitoblar</span>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </HydrateClient>
  );
}
