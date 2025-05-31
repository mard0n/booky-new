import { api } from "~/trpc/server";
import BookCategorySection from "./_components/BookCategorySection";
import Banner from "./_components/banner";

export default async function Explore() {
  // Fetch real data from tRPC
  const [popular, classic, adventures, philosophical, drama, selfHelp, nonfiction, psychology, biography, history, fantasy] = await Promise.all([
    api.book.getPopular(),
    api.book.getByCategory({ category: "Classic" }),
    api.book.getByCategory({ category: "Adventures" }),
    api.book.getByCategory({ category: "Philosophical prose" }),
    api.book.getByCategory({ category: "Drama" }),
    api.book.getByCategory({ category: "Self-development" }),
    api.book.getByCategory({ category: "Non-fiction literature" }),
    api.book.getByCategory({ category: "Psychology" }),
    api.book.getByCategory({ category: "Biography" }),
    api.book.getByCategory({ category: "History" }),
    api.book.getByCategory({ category: "Fantasy" }),
  ]);

  return (
    <div className="container mx-auto my-10">
      <Banner />
      <BookCategorySection title="Hozirda ommabop" books={popular} />
      <BookCategorySection title="Klassika" books={classic} />
      <BookCategorySection title="Sarguzasht" books={adventures} />
      <BookCategorySection title="Falsafiy nasr" books={philosophical} />
      <BookCategorySection title="Drama" books={drama} />
      <BookCategorySection title="O‘zini rivojlantirish" books={selfHelp} />
      {/* <BookCategorySection title="Nobadiiy adabiyot" books={nonfiction} /> */}
      <BookCategorySection title="Biografiya" books={biography} />
      <BookCategorySection title="Psixologik roman" books={psychology} />
      <BookCategorySection title="Tarixiy" books={history} />
      <BookCategorySection title="Fantastika" books={fantasy} />
    </div>
  );
}
