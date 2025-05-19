'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";


export default function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; author: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        setSuggestions(data.results);
        setSelectedIndex(-1); // Reset selection when new suggestions arrive
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex > -1 && suggestions[selectedIndex]) {
          router.push(`/books/${suggestions[selectedIndex].id}`);
          setShowSuggestions(false);
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div className="flex-1 relative" ref={searchRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a book..."
        className="w-full rounded p-2"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (query || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <div>
              {suggestions.map((book, index) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className={`block p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                    index === selectedIndex
                      ? "bg-neutral-100 dark:bg-neutral-700"
                      : ""
                  }`}
                  onClick={() => setShowSuggestions(false)}
                >
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-neutral-500">{book.author}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-neutral-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}