"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex-1 flex items-center gap-2 rounded-full bg-gray-300 px-4 py-2 text-sm text-white inset-shadow-sm inset-shadow-black/50">
      <Search size={18} className="text-white" />
      <input
        type="text"
        placeholder="Tìm kiếm toàn hệ thống"
        className="w-full bg-transparent text-sm text-white placeholder:text-white focus:outline-none"
      />
    </div>
  );
}
