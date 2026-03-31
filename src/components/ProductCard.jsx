import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "../store/favoritesStore";

export default function ProductCard({ product }) {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const favoriteItems = useFavoritesStore((state) => state.items);

  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  const price = product?.price ?? 0;
  const oldPrice = product?.old_price ?? product?.oldPrice ?? null;
  const image =
    product?.image || "https://via.placeholder.com/400x500?text=No+Image";
  const name = product?.name || "Mahsulot";

  return (
    <Link
      to={`/product/${product.id}`}
      className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200 transition hover:-translate-y-0.5 dark:bg-zinc-900 dark:ring-zinc-800"
    >
      <div className="relative">
        <img src={image} alt={name} className="h-52 w-full object-cover" />

        {product?.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black backdrop-blur dark:bg-black/70 dark:text-white">
            {product.badge}
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur ${
            isFavorite
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white/90 text-black dark:bg-black/70 dark:text-white"
          }`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="space-y-2 p-3">
        <h3 className="text-sm font-semibold">{name}</h3>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold">
            {price.toLocaleString()} so‘m
          </span>
        </div>

        {oldPrice && (
          <p className="text-xs text-zinc-400 line-through">
            {oldPrice.toLocaleString()} so‘m
          </p>
        )}
      </div>
    </Link>
  );
}