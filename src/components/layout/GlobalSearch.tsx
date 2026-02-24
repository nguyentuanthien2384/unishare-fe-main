"use client";
import { useRef, useEffect } from "react";
import { useSearchStore } from "@/store/search.store";
import { useDebounce } from "@/hooks/useDebounce";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function GlobalSearch() {
  const globalSearch = useSearchStore((state) => state.search);
  const setGlobalSearch = useSearchStore((state) => state.setSearch);

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(globalSearch, 300);

  useEffect(() => {
    setGlobalSearch(debouncedSearch);
  }, [debouncedSearch, setGlobalSearch]);

  useEffect(() => {
    if (globalSearch === "" && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [globalSearch]);

  return (
    <div className="relative flex-1 max-w-lg mx-4">
      <input
        ref={inputRef}
        type="text"
        defaultValue={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
        placeholder="Tìm tài liệu theo tiêu đề..."
        className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-full bg-gray-50"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );
}
