import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
import { useCartStore } from "../store/cartStore";

export default function CartPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-4 p-4 pb-32">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Savat</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tanlangan mahsulotlar
          </p>
        </div>

        {items.length > 0 && (
          <button onClick={clearCart} className="text-sm text-red-500">
            Tozalash
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          Savat hozircha bo‘sh
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemCard
                key={`${item.id}-${item.size || "nosize"}`}
                item={item}
                onIncrease={() => increaseQuantity(item.id, item.size)}
                onDecrease={() => decreaseQuantity(item.id, item.size)}
                onRemove={() => removeFromCart(item.id, item.size)}
              />
            ))}
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Jami
              </span>
              <span className="text-lg font-bold">
                {total.toLocaleString()} so‘m
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Yetkazib berish 10–12 ish kuni ichida.
            </p>
          </div>

          <div className="fixed bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full rounded-2xl bg-black py-4 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Buyurtma berish
            </button>
          </div>
        </>
      )}
    </div>
  );
}