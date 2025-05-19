import { createClient } from "~/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = searchParams.get("limit") ?? "5";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  const { data: results, error } = await supabase
    .from("books")
    .select("id, title, author, cover_image_url")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .limit(parseInt(limit));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results });
} 