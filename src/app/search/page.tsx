import { createClient } from "~/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import SaveButton from "~/components/SaveButton";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q: query } = await searchParams;
  const supabase = await createClient();

  const { data: results } = await supabase
    .from("books")
    .select("id, title, author, cover_image_url")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        &quot;{query}&quot; uchun qidiruv natijalari
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results?.map((book) => (
          <div
            key={book.id}
            className="flex gap-4 rounded-lg border p-4"
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
            <div className="flex flex-col justify-between gap-2">
              <Link key={book.id} href={`/book/${book.id}`}>
                <div>
                  <h2 className="font-semibold">{book.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {book.author}
                  </p>
                </div>
              </Link>
              <div className="w-30">
                <SaveButton bookId={book.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
