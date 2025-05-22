"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { supabase } from "~/lib/supabaseClient";
import SaveToShelvesModal from "./SaveToShelvesModal";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

export default function SaveButton({ bookId }: { bookId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const getShelves = api.book.getUserShelvesWithBook.useQuery(
    { supabaseUserId: supabaseUserId ?? "", bookId },
    { enabled: !!supabaseUserId },
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSupabaseUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (getShelves.data) {
      setIsSaved(getShelves.data.shelves.some((s) => s.hasBook));
    }
  }, [getShelves.data]);

  const [open, setOpen] = useState(false);

  async function handleClick() {
    if (!supabaseUserId) {
      setOpen(true);
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
      <Button
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded px-3 py-2 text-white disabled:opacity-60 ${isSaved ? "bg-green-600" : "bg-primary"}`}
        onClick={handleClick}
        aria-label={
          isSaved
            ? "Kitob kutubxonangizda saqlangan"
            : "Kitobni kutubxonangizga saqlash"
        }
      >
        {isSaved ? (
          <BookmarkCheck className="h-5 w-5" />
        ) : (
          <Bookmark className="h-5 w-5" />
        )}
        {isSaved ? "Saqlandi" : "Saqlash"}
      </Button>
      <SaveToShelvesModal
        bookId={bookId}
        open={modalOpen}
        onOpenChange={handleOpenChange}
      />
      <Dialog.Root open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <Dialog.Portal>
          <Dialog.Overlay className="review-modal-overlay fixed inset-0 z-40 bg-black/40" />
          <Dialog.Content className="bg-background review-modal-content fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 shadow-lg focus:outline-none">
            <Dialog.Title className="mb-4 text-center text-xl font-semibold">
              Kitobni saqlash uchun tizimga kiring
            </Dialog.Title>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-muted-foreground">
                Iltimos, kitobni saqlash uchun tizimga kiring yoki akkaunt yarating.
              </p>
              <div className="flex gap-4">
                <Link href="/sign-in">
                  <Button variant="outline">Tizimga kirish</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Akkaunt yaratish</Button>
                </Link>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-4 right-4 text-xl"
                aria-label="Yopish"
              >
                ×
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
