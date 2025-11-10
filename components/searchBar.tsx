"use client";

import { Search } from "lucide-react";

export default function SearchBar({...props}) {
  const {placeHoder} = props;
  return (
    <div className="flex-1 flex items-center gap-2 rounded-full bg-gray-300 px-4 py-2 text-sm text-white inset-shadow-sm inset-shadow-black/50">
      <Search size={18} className="text-black" />
      <input
        type="text"
        placeholder={placeHoder}
        className="w-full bg-transparent text-sm text-black placeholder:text-black focus:outline-none"
      />
    </div>
  );
}
