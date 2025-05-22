import { api } from "~/trpc/server";
import BookCategorySection from "./_components/BookCategorySection";
import Banner from "./_components/banner";

export default async function Explore() {
  // Fetch real data from tRPC
  const [popular, fiction, nonfiction, fantasy] = await Promise.all([
    api.book.getPopular(),
    api.book.getByCategory({ category: "Fiction" }),
    api.book.getByCategory({ category: "Non-fiction" }),
    api.book.getByCategory({ category: "Fantasy" }),
  ]);

  return (
    <div className="container mx-auto my-10">
      <Banner />
      <BookCategorySection title="Popular now" books={popular} />
      <BookCategorySection title="Fiction" books={fiction} />
      <BookCategorySection title="Nonfiction" books={nonfiction} />
      <BookCategorySection title="Fantasy" books={fantasy} />
    </div>
  );
}
