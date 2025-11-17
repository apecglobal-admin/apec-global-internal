"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  delay?: number; // tuỳ chọn — default = 300ms
}

export default function SearchBar({
  placeholder,
  onChange,
  delay = 300,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange?.(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, onChange]);

  return (
    <div className="flex-1 flex items-center gap-2 rounded-full bg-blue-gradiant-main px-4 py-2 text-sm text-white inset-shadow-sm inset-shadow-black/50">
      <Search size={18} className="text-black" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-black placeholder:text-black focus:outline-none"
      />
    </div>
  );
}
