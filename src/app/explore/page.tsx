import { api } from "~/trpc/server";
import BookCategorySection from "./_components/BookCategorySection";
import Banner from "./_components/banner";

export default async function Explore() {
  // Fetch real data from tRPC
  const [popular, fiction, nonfiction, biography, selfHelp, history, historicalFiction, science, technology, adventure, drama] = await Promise.all([
    api.book.getPopular(),
    api.book.getByCategory({ category: "Fiction" }),
    api.book.getByCategory({ category: "Non-fiction" }),
    api.book.getByCategory({ category: "Biography" }),
    api.book.getByCategory({ category: "Self-Help" }),
    api.book.getByCategory({ category: "History" }),
    api.book.getByCategory({ category: "Historical Fiction" }),
    api.book.getByCategory({ category: "Science" }),
    api.book.getByCategory({ category: "Technology" }),
    api.book.getByCategory({ category: "Adventure" }),
    api.book.getByCategory({ category: "Drama" }),
  ]);

  return (
    <div className="container mx-auto my-10">
      <Banner />
      <BookCategorySection title="Hozirda ommabop" books={popular} />
      <BookCategorySection title="Badiiy adabiyot" books={fiction} />
      <BookCategorySection title="Nobadiiy adabiyot" books={nonfiction} />
      <BookCategorySection title="Biografiya" books={biography} />
      <BookCategorySection title="O‘zini rivojlantirish" books={selfHelp} />
      <BookCategorySection title="Tarixiy" books={history} />
      <BookCategorySection title="Tarixiy badiiy adabiyot" books={historicalFiction} />
      <BookCategorySection title="Fan" books={science} />
      <BookCategorySection title="Texnologiya" books={technology} />
      <BookCategorySection title="Sarguzasht" books={adventure} />
      <BookCategorySection title="Drama" books={drama} />
    </div>
  );
}
