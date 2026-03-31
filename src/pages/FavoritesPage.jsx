import ProductCard from "../components/ProductCard";
import { useFavoritesStore } from "../store/favoritesStore";

export default function FavoritesPage() {
  const items = useFavoritesStore((state) => state.items);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  return (
    <div className="space-y-4 p-4 pb-28">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Yoqtirganlar</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Saqlangan mahsulotlar
          </p>
        </div>

        {items.length > 0 && (
          <button onClick={clearFavorites} className="text-sm text-red-500">
            Tozalash
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          Hozircha saqlangan mahsulot yo‘q
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}