'use client'

import React,
{
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from "react";

import { Search, X, ChevronDown } from "lucide-react";

interface SearchFilterItem {
  id: number | string;
  [key: string]: any;
}

interface SearchFilterProps<T extends SearchFilterItem> {
  data: T[];
  onFilter?: (searchValue: string) => void;
  onSelect?: (selectedItem: T | T[] | null) => void;
  value?: T | T[] | null;
  multi?: boolean;
  placeholder?: string;
  displayField?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  isSearch?: boolean;
}

function FilterableSelector<T extends SearchFilterItem>({
  data,
  onFilter,
  onSelect,
  value,
  multi = false,
  placeholder = "Tìm kiếm...",
  displayField = "name",
  emptyMessage = "Không tìm thấy kết quả",
  isLoading = false,
  isSearch = true,
}: SearchFilterProps<T>) {

  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ───── helpers memoized ─────

  const getDisplayText = useCallback((item: T) => {
    const val = item[displayField];
    if (typeof val === "string" || typeof val === "number") return String(val);
    return String(item.id);
  }, [displayField]);

  const selectedArray = useMemo(() => {
    if (!multi) return [];
    return Array.isArray(value) ? value : [];
  }, [value, multi]);

  const isSelected = useCallback((item: T) => {
    if (multi) {
      return selectedArray.some(v => v.id === item.id);
    }
    return (value as T)?.id === item.id;
  }, [multi, selectedArray, value]);

  const displayText = useMemo(() => {

    if (multi) {

      if (!selectedArray.length) return placeholder;

      if (selectedArray.length <= 2) {
        return selectedArray.map(getDisplayText).join(", ");
      }

      return `${selectedArray.length} items selected`;
    }

    return value ? getDisplayText(value as T) : placeholder;

  }, [multi, selectedArray, value, placeholder, getDisplayText]);

  // ───── debounce filter (no rerender logic) ─────

  const handleSearchChange = useCallback((v: string) => {

    setSearchValue(v);

    if (!onFilter) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onFilter(v);
    }, 300);

  }, [onFilter]);

  // ───── focus input ─────

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
      setHighlightedIndex(0);
    }
  }, [open]);

  // ───── click outside ─────

  useEffect(() => {

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  // ───── scroll highlighted ─────

  useEffect(() => {

    if (!open || !listRef.current) return;

    const item =
      listRef.current.children[highlightedIndex] as HTMLElement;

    item?.scrollIntoView({ block: "nearest" });

  }, [highlightedIndex, open]);

  // ───── select item ─────

  const handleSelect = useCallback((item: T) => {

    if (multi) {

      let newSelected: T[];

      if (selectedArray.some(v => v.id === item.id)) {
        newSelected =
          selectedArray.filter(v => v.id !== item.id);
      } else {
        newSelected = [...selectedArray, item];
      }

      onSelect?.(newSelected);

    } else {

      onSelect?.(item);
      setOpen(false);

    }

    setSearchValue("");

  }, [multi, selectedArray, onSelect]);

  // ───── clear selection ─────

  const handleClearSelection = useCallback((e: React.MouseEvent) => {

    e.stopPropagation();

    if (multi) {
      onSelect?.([]);
    } else {
      onSelect?.(null);
    }

  }, [multi, onSelect]);

  // ───── keyboard navigation ─────

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {

    if (!open) {
      if (["Enter", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {

      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(v => Math.min(v + 1, data.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(v => Math.max(v - 1, 0));
        break;

      case "Enter":
        e.preventDefault();
        if (data[highlightedIndex]) {
          handleSelect(data[highlightedIndex]);
        }
        break;

      case "Escape":
        setOpen(false);
        break;
    }

  }, [open, data, highlightedIndex, handleSelect]);

  // ───── render ─────

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="group w-full flex items-center justify-between
        bg-slate-900 border border-slate-700 rounded-lg
        px-3 py-2.5 text-sm text-white"
      >
        <span className="text-xs">
          {displayText}
        </span>

        <span className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              onClick={handleClearSelection}
              className="text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </span>
          )}

          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform
            ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full
        bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
          {isSearch && (
            <div className="p-2 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(e) =>
                    handleSearchChange(e.target.value)
                  }
                  placeholder={placeholder}
                  className="w-full pl-9 pr-8 py-2
                  bg-slate-900 border border-slate-700
                  rounded-md text-sm text-white"
                />
              </div>
            </div>
          )}
          <ul
            ref={listRef}
            className="overflow-y-auto py-1"
            style={{ maxHeight: 180 }}
          >
            {data.map((item, index) => {
              const selected = isSelected(item);
              return (

                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() =>
                    setHighlightedIndex(index)
                  }
                  className={`flex items-center px-3 py-2 text-sm cursor-pointer
                  ${index === highlightedIndex
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700"}
                  `}
                >
                  <span className="w-5 flex-shrink-0">

                    {selected && (
                      <svg
                        className="h-4 w-4 text-slate-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293l-8 8-4-4"
                        />
                      </svg>
                    )}
                  </span>
                  {getDisplayText(item)}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterableSelector;