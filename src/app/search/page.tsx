import { createClient } from "~/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const {q: query} = await searchParams;
  const supabase = await createClient();

  const { data: results } = await supabase
    .from("books")
    .select("id, title, author, cover_image_url")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search results for &quot;{query}&quot;
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results?.map((book) => (
          <Link
            key={book.id}
            href={`/book/${book.id}`}
            className="flex gap-4 p-4 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {book.cover_image_url && (
              <Image
                src={book.cover_image_url}
                alt={book.title}
                width={100}
                height={150}
                className="rounded object-cover"
              />
            )}
            <div>
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                {book.author}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 