import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import { getProductById } from "../lib/products";
import { useCartStore } from "../store/cartStore";
import { useFavoritesStore } from "../store/favoritesStore";

export default function ProductPage() {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const favoriteItems = useFavoritesStore((state) => state.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        setErrorText("Mahsulot topilmadi");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="p-4">Yuklanmoqda...</div>;
  }

  if (errorText || !product) {
    return <div className="p-4">{errorText || "Mahsulot topilmadi"}</div>;
  }

  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  const sizes =
    product.category === "Oyoqkiyim"
      ? ["39", "40", "41", "42"]
      : ["S", "M", "L", "XL"];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    alert("Mahsulot savatga qo‘shildi");
  };

  return (
    <div className="p-4 pb-28">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-80 w-full rounded-3xl object-cover"
        />

        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute right-3 top-3 rounded-full p-3 backdrop-blur ${
            isFavorite
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white/90 text-black dark:bg-black/70 dark:text-white"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">
            {product.price.toLocaleString()} so‘m
          </span>

          {product.old_price && (
            <span className="text-sm text-zinc-400 line-through">
              {product.old_price.toLocaleString()} so‘m
            </span>
          )}
        </div>

        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {product.description || "Premium sifatli mahsulot."}
        </p>

        <div className="space-y-2">
          <p className="font-semibold">Razmer</p>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  selectedSize === size
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Yetkazib berish 10–12 ish kuni ichida
        </p>

        <div className="fixed bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-2xl bg-black py-4 text-sm font-semibold text-white dark:bg-white dark:text-black"
          >
            Savatga qo‘shish
          </button>
        </div>
      </div>
    </div>
  );
}