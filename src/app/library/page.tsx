"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "~/trpc/react";
import { supabase } from "~/lib/supabaseClient";
import SaveToShelvesModal from "~/components/SaveToShelvesModal";
import { DataTable } from "~/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";
import { type Column } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface BookRow {
  id: string;
  title: string;
  author: string;
  averageRating?: number;
  coverImageUrl?: string | null;
  shelves: string[];
  addedAt: string;
}

function ReviewModal({
  open,
  onOpenChange,
  bookId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}) {
  // Scaffold: You can implement review form logic here
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-bold">Fikr qo&apos;shish</h2>
          <div className="mb-4">
            (Fikr formasi bu yerda {bookId} kitobi uchun)
          </div>
          <button
            className="bg-primary mt-2 rounded px-4 py-2 text-white"
            onClick={() => onOpenChange(false)}
          >
            Yopish
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function LibraryPage() {
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [addToShelfBookId, setAddToShelfBookId] = useState<string | null>(null);
  const [reviewBookId, setReviewBookId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkAddToShelfOpen, setBulkAddToShelfOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);
  const [editingShelfId, setEditingShelfId] = useState<string | null>(null);
  const [editingShelfName, setEditingShelfName] = useState("");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shelfToDelete, setShelfToDelete] = useState<string | null>(null);

  const setBookShelves = api.book.setBookShelves.useMutation();
  const createShelf = api.book.createShelf.useMutation();
  const renameShelf = api.book.renameShelf.useMutation();
  const deleteShelf = api.book.deleteShelf.useMutation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSupabaseUserId(user.id);
    });
  }, []);

  const shelvesQuery = api.book.getUserShelves.useQuery(
    { supabaseUserId: supabaseUserId ?? "" },
    { enabled: !!supabaseUserId },
  );
  const booksQuery = api.book.getBooksInLibrary.useQuery(
    {
      supabaseUserId: supabaseUserId ?? "",
      shelfId: selectedShelf ?? undefined,
    },
    { enabled: !!supabaseUserId },
  );

  const shelves = shelvesQuery.data?.shelves ?? [];
  const books: BookRow[] = booksQuery.data?.books ?? [];

  // DataTable columns
  const columns = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={selectedRows.size === books.length && books.length > 0}
          onChange={(e) => {
            if (e.target.checked)
              setSelectedRows(new Set(books.map((b) => b.id)));
            else setSelectedRows(new Set());
          }}
        />
      ),
      cell: ({ row }: { row: { original: BookRow } }) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.original.id)}
          onChange={(e) => {
            const newSet = new Set(selectedRows);
            if (e.target.checked) newSet.add(row.original.id);
            else newSet.delete(row.original.id);
            setSelectedRows(newSet);
          }}
        />
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }: { column: Column<BookRow> }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Sarlavha
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </button>
      ),
      cell: ({ row }: { row: { original: BookRow } }) => (
        <div className="flex items-center gap-3">
          {row.original.coverImageUrl ? (
            <img
              src={row.original.coverImageUrl}
              alt={row.original.title}
              className="h-14 w-10 rounded border object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-14 w-10 items-center justify-center rounded border text-xs">
              Muqova yo&apos;q
            </div>
          )}
          <span>{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: ({ column }: { column: Column<BookRow> }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Muallif
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </button>
      ),
    },
    {
      accessorKey: "averageRating",
      header: ({ column }: { column: Column<BookRow> }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Baho
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </button>
      ),
    },
    {
      accessorKey: "shelves",
      header: "Javonlar",
      cell: ({ row }: { row: { original: BookRow } }) =>
        row.original.shelves.join(", "),
    },
    {
      accessorKey: "addedAt",
      header: ({ column }: { column: Column<BookRow> }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Qo&apos;shilgan sana
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </button>
      ),
      cell: ({ row }: { row: { original: BookRow } }) =>
        new Date(row.original.addedAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: { original: BookRow } }) => (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-accent rounded border bg-white px-2 py-1">
                ⋮
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setAddToShelfBookId(row.original.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="inline-block size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Javonga qo&apos;shish
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReviewBookId(row.original.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="inline-block size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                Fikr qo&apos;shish
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/book/${row.original.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="inline-block size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                  Kitob sahifasiga o&apos;tish
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  setBookShelves.mutate({
                    supabaseUserId: supabaseUserId!,
                    bookId: row.original.id,
                    shelfIds: [],
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="inline-block size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                Javonlardan olib tashlash
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href={`/author/${encodeURIComponent(row.original.author)}`}>Go to author page</Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Modals for this row */}
          {addToShelfBookId === row.original.id && (
            <SaveToShelvesModal
              bookId={row.original.id}
              open={true}
              onOpenChange={(open) => {
                if (!open) setAddToShelfBookId(null);
              }}
            />
          )}
          {reviewBookId === row.original.id && (
            <ReviewModal
              bookId={row.original.id}
              open={true}
              onOpenChange={(open) => {
                if (!open) setReviewBookId(null);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  // Bulk actions
  function handleBulkRemove() {
    selectedRows.forEach((bookId) => {
      setBookShelves.mutate({
        supabaseUserId: supabaseUserId!,
        bookId,
        shelfIds: [],
      });
    });
    setSelectedRows(new Set());
  }

  const handleAddShelf = () => {
    if (newShelfName.trim()) {
      createShelf.mutate({
        supabaseUserId: supabaseUserId!,
        name: newShelfName.trim(),
      }, {
        onSuccess: () => {
          shelvesQuery.refetch();
          setNewShelfName("");
          setIsAddShelfModalOpen(false);
        }
      });
    }
  };

  const handleRenameShelf = (shelfId: string) => {
    if (editingShelfName.trim()) {
      renameShelf.mutate({
        supabaseUserId: supabaseUserId!,
        shelfId,
        newName: editingShelfName.trim(),
      }, {
        onSuccess: () => {
          shelvesQuery.refetch();
          booksQuery.refetch();
          setEditingShelfId(null);
          setEditingShelfName("");
          setIsRenameDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteShelf = (shelfId: string) => {
    deleteShelf.mutate({
      supabaseUserId: supabaseUserId!,
      shelfId,
    }, {
      onSuccess: () => {
        shelvesQuery.refetch();
        booksQuery.refetch();
        setIsDeleteDialogOpen(false);
        setShelfToDelete(null);
      }
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-muted/40 w-64 border-r px-5 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Javonlar</h2>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddShelfModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {shelvesQuery.isLoading ? (
          <div className="text-muted-foreground">Javonlar yuklanmoqda...</div>
        ) : shelves.length === 0 ? (
          <div className="text-muted-foreground">Hali javonlar yo&apos;q.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            <li>
              <button
                className={`w-full rounded px-2 py-1 text-left ${!selectedShelf ? "bg-primary text-white" : "hover:bg-accent"}`}
                onClick={() => setSelectedShelf(null)}
              >
                Barcha kitoblar
              </button>
            </li>
            {shelves.map((shelf) => (
              <li
                key={shelf.id}
                className="flex items-center justify-between gap-2"
              >
                <button
                  className={`w-full rounded px-2 py-1 text-left ${selectedShelf === shelf.id ? "bg-primary text-white" : "hover:bg-accent"}`}
                  onClick={() => setSelectedShelf(shelf.id)}
                >
                  {shelf.name}
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:bg-accent rounded border bg-white px-2 py-1">
                      ⋮
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingShelfId(shelf.id);
                        setEditingShelfName(shelf.name);
                        setIsRenameDialogOpen(true);
                      }}
                    >
                      Qayta nomlash
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setShelfToDelete(shelf.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      O&apos;chirish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        )}

        {/* Rename Shelf Dialog */}
        <Dialog.Root
          open={isRenameDialogOpen}
          onOpenChange={setIsRenameDialogOpen}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <Dialog.Title className="mb-4 text-lg font-semibold">
                Javonni qayta nomlash
              </Dialog.Title>
              <Input
                value={editingShelfName}
                onChange={(e) => setEditingShelfName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  editingShelfId &&
                  handleRenameShelf(editingShelfId)
                }
                autoFocus
                className="mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRenameDialogOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={() =>
                    editingShelfId && handleRenameShelf(editingShelfId)
                  }
                >
                  Qayta nomlash
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Shelf Dialog */}
        <Dialog.Root
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <Dialog.Title className="mb-4 text-lg font-semibold">
                Javonni o&apos;chirish
              </Dialog.Title>
              <p className="text-muted-foreground mb-4">
                Bu javonni o&apos;chirishni xohlaysizmi? Bu javondagi barcha
                kitoblarni olib tashlaydi.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    shelfToDelete && handleDeleteShelf(shelfToDelete)
                  }
                >
                  O&apos;chirish
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Add Shelf Dialog */}
        <Dialog.Root
          open={isAddShelfModalOpen}
          onOpenChange={setIsAddShelfModalOpen}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <Dialog.Title className="mb-4 text-lg font-semibold">
                Yangi javon qo&apos;shish
              </Dialog.Title>
              <Input
                placeholder="Javon nomi"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
              />
              <div className="mt-4">
                <Button onClick={handleAddShelf}>Qo&apos;shish</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="mb-4 text-2xl font-medium">Mening kutubxonam</h1>
        {selectedRows.size > 0 && (
          <div className="bg-muted mb-4 flex items-center gap-4 rounded p-4 px-4">
            <button
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setSelectedRows(new Set())}
            >
              ✕
            </button>
            <span>{selectedRows.size} ta tanlangan</span>
            <button
              className="bg-primary cursor-pointer rounded-none p-2 text-sm text-white"
              onClick={() => setBulkAddToShelfOpen(true)}
            >
              {selectedRows.size} ta kitobni javonga qo&apos;shish
            </button>
            <button
              className="bg-destructive cursor-pointer rounded-none p-2 text-sm text-white"
              onClick={handleBulkRemove}
            >
              Barcha javonlardan olib tashlash
            </button>
          </div>
        )}
        {booksQuery.isLoading ? (
          <div className="text-muted-foreground">Kitoblar yuklanmoqda...</div>
        ) : books.length === 0 ? (
          <div className="text-muted-foreground">
            Bu javonda kitoblar yo&apos;q.
          </div>
        ) : (
          <DataTable columns={columns} data={books} />
        )}
        {bulkAddToShelfOpen && (
          <SaveToShelvesModal
            bookId={Array.from(selectedRows).join(",")}
            open={bulkAddToShelfOpen}
            onOpenChange={(open) => {
              setBulkAddToShelfOpen(open);
              if (!open) setSelectedRows(new Set());
            }}
          />
        )}
      </main>
    </div>
  );
}
