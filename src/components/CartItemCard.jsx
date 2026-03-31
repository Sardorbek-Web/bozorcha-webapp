import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-24 rounded-2xl object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold">{item.name}</h3>
          {item.size && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Razmer: {item.size}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold">
            {item.price.toLocaleString()} so‘m
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onDecrease}
              className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-6 text-center text-sm">{item.quantity}</span>

            <button
              onClick={onIncrease}
              className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800"
            >
              <Plus size={16} />
            </button>

            <button
              onClick={onRemove}
              className="rounded-xl bg-red-100 p-2 text-red-500 dark:bg-red-950"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}