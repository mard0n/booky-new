"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { supabase } from "~/lib/supabaseClient";
import SaveToShelvesModal from "./SaveToShelvesModal";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function SaveButton({ bookId }: { bookId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const getShelves = api.book.getUserShelvesWithBook.useQuery(
    { supabaseUserId: supabaseUserId ?? "", bookId },
    { enabled: !!supabaseUserId }
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSupabaseUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (getShelves.data) {
      setIsSaved(getShelves.data.shelves.some(s => s.hasBook));
    }
  }, [getShelves.data]);

  async function handleClick() {
    if (!supabaseUserId) {
      window.location.href = "/sign-in";
      return;
    }
    setModalOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setModalOpen(open);
    getShelves.refetch();
  }

  return (
    <>
      <button
        className={`mt-2 w-full rounded px-3 py-1 text-white flex items-center justify-center gap-2 disabled:opacity-60 ${isSaved ? "bg-green-600" : "bg-primary"}`}
        onClick={handleClick}
        aria-label={isSaved ? "Book is saved in your library" : "Save book to your library"}
      >
        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        {isSaved ? "Saved" : "Save"}
      </button>
      <SaveToShelvesModal
        bookId={bookId}
        open={modalOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
} 