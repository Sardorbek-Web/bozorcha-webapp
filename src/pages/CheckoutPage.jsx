import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useUserStore } from "../store/userStore";
import { createOrderWithItems } from "../lib/orders";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const telegramUser = useUserStore((state) => state.telegramUser);
  const profile = useUserStore((state) => state.profile);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const [form, setForm] = useState({
    fullName:
      [profile?.first_name || telegramUser?.first_name, profile?.last_name || telegramUser?.last_name]
        .filter(Boolean)
        .join(" ") || "",
    phone: profile?.phone || "",
    address: "",
    paymentMethod: "Yetkazilganda to‘lov",
    comment: "",
  });

  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorText("Savat bo‘sh");
      return;
    }

    if (!telegramUser?.id) {
      setErrorText("Telegram foydalanuvchi topilmadi");
      return;
    }

    if (!form.fullName.trim()) {
      setErrorText("Ism va familiyani kiriting");
      return;
    }

    if (!form.phone.trim()) {
      setErrorText("Telefon raqamini kiriting");
      return;
    }

    if (!form.address.trim()) {
      setErrorText("Manzilni kiriting");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");

      const newOrder = await createOrderWithItems({
        telegramId: telegramUser.id,
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          paymentMethod: form.paymentMethod,
          comment: form.comment,
        },
        items,
        total,
      });
      await notifyTelegramAboutOrder({
        orderNumber: newOrder.order_number,
        customerFullName: form.fullName,
        customerPhone: form.phone,
        customerAddress: form.address,
        paymentMethod: form.paymentMethod,
        total,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size || "",
          price: item.price,
        })),
      });

      clearCart();

      navigate("/orders", {
        state: { orderNumber: newOrder.order_number },
      });
    } catch (error) {
      console.error(error);
      setErrorText("Buyurtmani saqlab bo‘lmadi");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="space-y-4 p-4 pb-28">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          Savatda mahsulot yo‘q
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 pb-32">
      <div>
        <h1 className="text-2xl font-bold">Buyurtma berish</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ma’lumotlaringizni kiriting
        </p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size || "nosize"}`}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {item.quantity} dona {item.size ? `• ${item.size}` : ""}
                </p>
              </div>
              <p className="font-semibold">
                {(item.price * item.quantity).toLocaleString()} so‘m
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Jami</span>
            <span className="text-lg font-bold">{total.toLocaleString()} so‘m</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Ism va familiya
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Masalan: Ali Valiyev"
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Telefon raqam
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Manzil</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Viloyat, tuman, ko‘cha, uy"
                rows="3"
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">To‘lov usuli</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              >
                <option>Yetkazilganda to‘lov</option>
                <option>Karta orqali to‘lov</option>
                <option>50% oldindan to‘lov</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Izoh</label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Qo‘shimcha izoh"
                rows="3"
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              />
            </div>
          </div>
        </div>

        {errorText && <p className="text-sm text-red-500">{errorText}</p>}

        <div className="fixed bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {loading ? "Saqlanmoqda..." : "Buyurtmani tasdiqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}