import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ value = "", onChange = () => {} }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
        <Search size={18} className="text-zinc-500" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mahsulot qidirish..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>

      <button
        type="button"
        className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-900"
      >
        <SlidersHorizontal size={18} />
      </button>
    </div>
  );
}