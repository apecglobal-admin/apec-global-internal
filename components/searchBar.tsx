"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string; // controlled value
  onChange?: (value: string) => void;
  delay?: number; // debounce delay
}

export default function SearchBar({
  placeholder,
  value: controlledValue,
  onChange,
  delay = 300,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");

  // Chọn giá trị hiển thị: nếu có controlledValue thì ưu tiên
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (!value) return;
    const handler = setTimeout(() => {
      onChange?.(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onChange?.("");
  };

  return (
    <div className="flex-1 flex items-center gap-2 rounded-full bg-blue-gradiant-main px-4 py-2 text-sm text-white inset-shadow-sm inset-shadow-black/50 relative">
      <Search size={18} className="text-black" />
      <input
        value={value}
        onChange={handleInputChange}
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-black placeholder:text-black/60 focus:outline-none capitalize"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 bg-box-shadow bg-red-300 rounded-2xl p-1 text-black/60 hover:text-black"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
