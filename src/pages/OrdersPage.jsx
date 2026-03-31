import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getOrders, getOrderItems } from "../lib/orders";

export default function OrdersPage() {
  const location = useLocation();
  const newOrderNumber = location.state?.orderNumber;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setErrorText("");

      const ordersData = await getOrders();

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const items = await getOrderItems(order.id);
          return { ...order, items: items || [] };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error(error);
      setErrorText("Buyurtmalarni yuklab bo‘lmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 p-4 pb-28">
      <div>
        <h1 className="text-2xl font-bold">Buyurtmalarim</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Buyurtmalar holati
        </p>
      </div>

      {newOrderNumber && (
        <div className="rounded-3xl bg-green-100 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Buyurtma muvaffaqiyatli qabul qilindi: <b>{newOrderNumber}</b>
        </div>
      )}

      {loading && (
        <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          Yuklanmoqda...
        </div>
      )}

      {errorText && <p className="text-sm text-red-500">{errorText}</p>}

      {!loading && !errorText && orders.length === 0 && (
        <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          Hozircha buyurtmalar yo‘q
        </div>
      )}

      {!loading && !errorText && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{order.order_number}</h3>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">
                  {order.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Mijoz
              </p>
              <p className="text-sm font-medium">{order.customer_full_name}</p>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Telefon
              </p>
              <p className="text-sm font-medium">{order.customer_phone}</p>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Manzil
              </p>
              <p className="text-sm font-medium">{order.customer_address}</p>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                To‘lov usuli
              </p>
              <p className="text-sm font-medium">{order.payment_method}</p>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Jami summa
              </p>
              <p className="text-lg font-bold">
                {order.total.toLocaleString()} so‘m
              </p>

              <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Mahsulotlar
                </p>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.product_name}</p>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}