import { api, HydrateClient } from "~/trpc/server";
import Footer from "../components/Footer";
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
          <h1 className="pb-4 text-center font-libre text-5xl">
            Kitoblar olamiga qadam qo&apos;ying
          </h1>
          <p className="text-center text-[21px] font-extralight text-muted-foreground mb-25">Izlang, fikr-mulohazalarni kuzating va yaqin kutubxona / do&apos;konlardan sotib oling</p>
          <div className="grid w-full max-w-5xl grid-cols-4 justify-center pb-[450px]">
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
        <section className="flex flex-col items-center pt-16 pb-32">
          <h1 className="mb-14 pb-2 text-center font-libre text-5xl">
            Bizning faoliyatimiz <br /> kengaymoqda
          </h1>
          <div className="grid grid-cols-2 gap-10 container mx-auto max-w-5xl">
            <div className="relative bg-muted row-span-2 aspect-square w-full h-[500px]">
              <img src="/newcities.png" alt="" className="w-full h-full object-cover" />
              <span className="absolute text-md bottom-[16px] right-[16px] uppercase font-bold">3 ta shaxar</span>
            </div>
            <div className="relative bg-muted aspect-square w-full h-[240px]">
              <img src="/weboflibs.png" alt="" className="absolute bottom-0 left-0 w-full object-contain" />
              <span className="absolute text-md top-[16px] left-[16px] uppercase font-bold ">
                150+ kutubxona va kitob do&apos;konlari
              </span>
            </div>
            <div className="relative bg-muted aspect-square w-full h-[220px]">
            <img src="/books.png" alt="" className="absolute bottom-0 left-0 w-full object-contain" />
              <span className="absolute text-md bottom-[16px] left-1/2 -translate-x-1/2 uppercase font-bold">15,000+ kitoblar</span>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </HydrateClient>
  );
}
