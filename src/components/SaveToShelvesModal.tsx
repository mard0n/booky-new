"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { supabase } from "~/lib/supabaseClient";
import * as Dialog from "@radix-ui/react-dialog";

export default function SaveToShelvesModal({ bookId, open, onOpenChange }: { bookId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [shelves, setShelves] = useState<{ id: string; name: string; hasBook: boolean }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newShelfName, setNewShelfName] = useState("");
  const getShelves = api.book.getUserShelvesWithBook.useQuery(
    { supabaseUserId: supabaseUserId ?? "", bookId },
    { enabled: !!supabaseUserId && open }
  );
  const setBookShelves = api.book.setBookShelves.useMutation();
  const createShelf = api.book.createShelf?.useMutation?.(); // If you have a createShelf endpoint

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSupabaseUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (getShelves.data) {
      setShelves(getShelves.data.shelves);
      setSelected(new Set(getShelves.data.shelves.filter(s => s.hasBook).map(s => s.id)));
    }
  }, [getShelves.data]);

  function toggleShelf(shelfId: string) {
    const newSelected = new Set(selected);
    if (newSelected.has(shelfId)) newSelected.delete(shelfId);
    else newSelected.add(shelfId);
    setSelected(newSelected);
    if (supabaseUserId) {
      setBookShelves.mutate({ supabaseUserId, bookId, shelfIds: Array.from(newSelected) });
    }
  }

  async function handleCreateShelf() {
    if (!newShelfName.trim() || !supabaseUserId) return;
    // You need to implement/createShelf endpoint in backend
    const res = await createShelf.mutateAsync?.({ supabaseUserId, name: newShelfName });
    if (res?.shelf) {
      setShelves([...shelves, { id: res.shelf.id, name: res.shelf.name, hasBook: false }]);
      setNewShelfName("");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Save to</span>
            <button onClick={() => onOpenChange(false)} className="text-sm">Done</button>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            {shelves.map(shelf => (
              <label key={shelf.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(shelf.id)}
                  onChange={() => toggleShelf(shelf.id)}
                />
                <span>{shelf.name}</span>
              </label>
            ))}
          </div>
          <div className="border-t my-2" />
          <div className="flex gap-2 items-center mt-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Create shelf"
              value={newShelfName}
              onChange={e => setNewShelfName(e.target.value)}
            />
            <button onClick={handleCreateShelf} className="px-2 py-1 rounded bg-primary text-white">+</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 