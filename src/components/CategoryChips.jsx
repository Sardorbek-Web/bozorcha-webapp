export default function CategoryChips({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect?.(null)}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
          selected === null
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white"
        }`}
      >
        Barchasi
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect?.(category.name)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            selected === category.name
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}