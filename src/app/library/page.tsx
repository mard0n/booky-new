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
          <h2 className="mb-4 text-lg font-bold">Add Review</h2>
          <div className="mb-4">(Review form goes here for book {bookId})</div>
          <button
            className="bg-primary mt-2 rounded px-4 py-2 text-white"
            onClick={() => onOpenChange(false)}
          >
            Close
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

  // useEffect(() => {
  //   // Add a small delay to ensure the input is rendered
  //   if (editingShelfId) {
  //     setTimeout(() => {
  //       editInputRef.current?.focus();
  //       // Select all text in the input
  //       editInputRef.current?.select();
  //     }, 0);
  //   }
  // }, [editingShelfId]);

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
          Title
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
              No cover
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
          Author
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
          Rating
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
      header: "Shelves",
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
          Date Added
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
                Add to Shelf
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReviewBookId(row.original.id)}
              >
                Add review
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/book/${row.original.id}`}>Go to book page</Link>
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
                Remove from all Shelves
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
      });
      setNewShelfName("");
      setIsAddShelfModalOpen(false);
    }
  };

  const handleRenameShelf = (shelfId: string) => {
    if (editingShelfName.trim()) {
      renameShelf.mutate({
        supabaseUserId: supabaseUserId!,
        shelfId,
        newName: editingShelfName.trim(),
      });
      setEditingShelfId(null);
      setEditingShelfName("");
      setIsRenameDialogOpen(false);
    }
  };

  const handleDeleteShelf = (shelfId: string) => {
    deleteShelf.mutate({
      supabaseUserId: supabaseUserId!,
      shelfId,
    });
    setIsDeleteDialogOpen(false);
    setShelfToDelete(null);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-muted/40 w-64 border-r py-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Shelves</h2>
          <Button size="sm" variant="secondary" onClick={() => setIsAddShelfModalOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {shelvesQuery.isLoading ? (
          <div className="text-muted-foreground">Loading shelves...</div>
        ) : shelves.length === 0 ? (
          <div className="text-muted-foreground">No shelves yet.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            <li>
              <button
                className={`w-full rounded px-2 py-1 text-left ${!selectedShelf ? "bg-primary text-white" : "hover:bg-accent"}`}
                onClick={() => setSelectedShelf(null)}
              >
                All books
              </button>
            </li>
            {shelves.map((shelf) => (
              <li key={shelf.id} className="flex items-center justify-between gap-2">
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
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setShelfToDelete(shelf.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      Delete
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
              <Dialog.Title className="mb-4 text-lg font-bold">
                Rename Shelf
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
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    editingShelfId && handleRenameShelf(editingShelfId)
                  }
                >
                  Rename
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
              <Dialog.Title className="mb-4 text-lg font-bold">
                Delete Shelf
              </Dialog.Title>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete this shelf? This will remove all
                books from this shelf.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    shelfToDelete && handleDeleteShelf(shelfToDelete)
                  }
                >
                  Delete
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
              <Dialog.Title className="mb-4 text-lg font-bold">
                Add New Shelf
              </Dialog.Title>
              <Input
                placeholder="Shelf Name"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
              />
              <div className="mt-4">
                <Button onClick={handleAddShelf}>Add</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="mb-4 text-2xl font-bold">My Library</h1>
        {selectedRows.size > 0 && (
          <div className="bg-muted mb-4 flex items-center gap-4 rounded p-2 px-4">
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedRows(new Set())}
            >
              ✕
            </button>
            <span>{selectedRows.size} selected</span>
            <button
              className="bg-primary rounded px-2 py-1 text-white"
              onClick={() => setBulkAddToShelfOpen(true)}
            >
              Add {selectedRows.size} books to Shelf
            </button>
            <button
              className="bg-destructive rounded px-2 py-1 text-white"
              onClick={handleBulkRemove}
            >
              Remove from all Shelves
            </button>
          </div>
        )}
        {booksQuery.isLoading ? (
          <div className="text-muted-foreground">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="text-muted-foreground">No books in this shelf.</div>
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
