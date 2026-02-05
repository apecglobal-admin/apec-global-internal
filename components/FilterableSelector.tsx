'use client'

import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchFilterItem {
  id: number | string;
  [key: string]: any;
}

interface SearchFilterProps<T extends SearchFilterItem> {
  data: T[];
  onFilter?: (searchValue: string) => void;
  onSelect?: (selectedItem: T) => void;
  value?: T | null;
  placeholder?: string;
  displayField?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  isSearch?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

function FilterableSelector<T extends SearchFilterItem>({
  data,
  onFilter,
  onSelect,
  value,
  placeholder = "Tìm kiếm...",
  displayField = "name",
  emptyMessage = "Không tìm thấy kết quả",
  isLoading = false,
  isSearch = true,
}: SearchFilterProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Debounce onFilter ──────────────────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter?.(searchValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  // ── Auto focus search input khi open ──────────────────────────────────────
  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
      setHighlightedIndex(0);
    }
  }, [open]);

  // ── Click outside => đóng dropdown ────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Reset highlight khi data đổi ──────────────────────────────────────────
  useEffect(() => {
    setHighlightedIndex(0);
  }, [data]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, data.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (data[highlightedIndex]) {
          handleSelect(data[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  // ── Scroll highlighted item into view ─────────────────────────────────────
  useEffect(() => {
    if (!open || !listRef.current) return;
    const item = listRef.current.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView?.({ block: "nearest" });
  }, [highlightedIndex, open]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getDisplayText = (item: T): string => {
    const val = item[displayField];
    if (typeof val === "string" || typeof val === "number") return String(val);
    return String(item.id);
  };

  const handleSelect = (item: T) => {
    // setSelectedItem(item);
    setOpen(false);
    setSearchValue("");
    onSelect?.(item);
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setSelectedItem(null);
    setSearchValue("");
    onSelect?.(null as any);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onKeyDown={handleKeyDown}
    >
      {/* ── Trigger Button ─────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          group w-full flex items-center justify-between
          bg-slate-900 border border-slate-700 rounded-lg
          px-3 py-2.5 text-sm sm:text-base text-white
          hover:border-slate-500 focus:outline-none
          focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 focus:ring-offset-transparent
          transition-colors duration-200
        "
      >
        {/* Left: selected text or placeholder */}
        <span className={value ? "text-white text-xs" : "text-slate-500 text-xs"}>
          {value ? getDisplayText(value) : placeholder}
        </span>

        {/* Right: clear btn or chevron */}
        <span className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClearSelection}
              onKeyDown={(e) => e.key === "Enter" && handleClearSelection(e as any)}
              aria-label="Xóa lựa chọn"
              className="
                text-slate-500 hover:text-white
                transition-colors duration-150 cursor-pointer
                p-0.5 rounded
              "
            >
              <X className="h-4 w-4" />
            </span>
          )}
          <ChevronDown
            className={`
              h-4 w-4 text-slate-500 group-hover:text-slate-300
              transition-transform duration-200
              ${open ? "rotate-180" : "rotate-0"}
            `}
          />
        </span>
      </button>

      {/* ── Dropdown Panel ───────────────────────────────────────────────── */}
      {open && (
        <div className="
          absolute z-50 mt-1 w-full
          bg-slate-800 border border-slate-700 rounded-lg shadow-lg shadow-black/30
          max-h-64 flex flex-col
          animate-in fade-in slide-in-from-top-2 duration-150
        ">
          {/* Search Input */}
          {isSearch && (
          <div className="p-2 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading}
                className="
                  w-full rounded-md
                  bg-slate-900 border border-slate-700
                  pl-9 pr-8 py-2 text-sm text-white
                  placeholder:text-slate-500
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
              />
              {searchValue && !isLoading && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Xóa tìm kiếm"
                  className="
                    absolute right-2.5 top-1/2 -translate-y-1/2
                    text-slate-500 hover:text-white
                    transition-colors duration-150
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          )}
          {/* Items List */}
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Danh sách lựa chọn"
            className="overflow-y-auto flex-1 py-1"
            style={{ maxHeight: "180px" }}
          >
            {isLoading ? (
              <li className="px-3 py-6 text-center text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  {/* Simple spinner */}
                  <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              </li>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={value?.id === item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    flex items-center px-3 py-2 text-sm cursor-pointer
                    transition-colors duration-100
                    ${index === highlightedIndex ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}
                    ${value?.id === item.id ? "font-medium" : ""}
                  `}
                >
                  {/* Checkmark nếu đã selected */}
                  <span className="w-5 flex-shrink-0">
                    {value?.id === item.id && (
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span>{getDisplayText(item)}</span>
                </li>
              ))
            ) : (
              <li className="px-3 py-6 text-center text-sm text-slate-500">
                {emptyMessage}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterableSelector;