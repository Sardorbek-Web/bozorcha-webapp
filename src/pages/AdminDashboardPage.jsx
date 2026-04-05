const STATUS_STYLES = {
  "Qabul qilindi":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",

  "Tayyorlanmoqda":
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",

  "Jo‘natildi":
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",

  "Yetkazildi":
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",

  "Bekor qilindi":
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";
import {
  getAllOrders,
  getOrderItems,
  updateOrderStatus,
} from "../lib/adminOrders";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../lib/adminProducts";
import { uploadImage } from "../lib/upload";

const STATUSES = [
  "Qabul qilindi",
  "Tayyorlanmoqda",
  "Jo‘natildi",
  "Yetkazildi",
  "Bekor qilindi",
];

const emptyProduct = {
  name: "",
  price: "",
  old_price: "",
  category: "",
  image: "",
  description: "",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const logout = useAdminStore((state) => state.logout);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }

    loadOrders();
    loadProducts();
  }, [isAdmin, navigate]);

  async function loadOrders() {
    try {
      setLoadingOrders(true);
      setErrorText("");

      const ordersData = await getAllOrders();

      const fullOrders = await Promise.all(
        (ordersData || []).map(async (order) => {
          const items = await getOrderItems(order.id);
          return { ...order, items: items || [] };
        })
      );

      setOrders(fullOrders);
    } catch (error) {
      console.error(error);
      setErrorText("Buyurtmalarni yuklab bo‘lmadi");
    } finally {
      setLoadingOrders(false);
    }
  }

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      setErrorText("Mahsulotlarni yuklab bo‘lmadi");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Statusni yangilab bo‘lmadi");
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const url = await uploadImage(file);

      setNewProduct((prev) => ({
        ...prev,
        image: url,
      }));

      alert("Rasm yuklandi ✅");
    } catch (error) {
      console.error(error);
      alert("Rasm yuklashda xatolik yuz berdi ❌");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProduct(e) {
    e.preventDefault();

    if (!newProduct.name.trim()) {
      alert("Mahsulot nomini kiriting");
      return;
    }

    if (!newProduct.price) {
      alert("Narxni kiriting");
      return;
    }

    if (!newProduct.category.trim()) {
      alert("Kategoriyani kiriting");
      return;
    }

    const payload = {
      name: newProduct.name,
      price: Number(newProduct.price),
      old_price: newProduct.old_price ? Number(newProduct.old_price) : null,
      category: newProduct.category,
      image: newProduct.image,
      description: newProduct.description,
    };

    try {
      if (editingProductId) {
        const updated = await updateProduct(editingProductId, payload);

        setProducts((prev) =>
          prev.map((item) => (item.id === editingProductId ? updated : item))
        );

        alert("Mahsulot yangilandi ✅");
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
        alert("Mahsulot qo‘shildi ✅");
      }

      setNewProduct(emptyProduct);
      setEditingProductId(null);
    } catch (error) {
      console.error(error);
      alert("Mahsulotni saqlab bo‘lmadi ❌");
    }
  }

  function handleEditProduct(product) {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name || "",
      price: product.price || "",
      old_price: product.old_price || "",
      category: product.category || "",
      image: product.image || "",
      description: product.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteProduct(productId) {
    const ok = window.confirm("Mahsulotni o‘chirmoqchimisiz?");
    if (!ok) return;

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((item) => item.id !== productId));

      if (editingProductId === productId) {
        setEditingProductId(null);
        setNewProduct(emptyProduct);
      }

      alert("Mahsulot o‘chirildi ✅");
    } catch (error) {
      console.error(error);
      alert("Mahsulotni o‘chirib bo‘lmadi ❌");
    }
  }

  function handleCancelEdit() {
    setEditingProductId(null);
    setNewProduct(emptyProduct);
  }

  function handleLogout() {
    logout();
    navigate("/admin-login");
  }

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Yetkazildi"
  ).length;
  const totalRevenue = orders
    .filter((order) => order.status === "Yetkazildi")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <div className="min-h-screen bg-white p-4 text-black dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto max-w-5xl space-y-4 pb-10">
        <div className="flex flex-col gap-4 rounded-[28px] bg-gradient-to-br from-zinc-900 to-zinc-700 p-5 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-black md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm opacity-80">Bozorcha Admin</p>
            <h1 className="mt-2 text-2xl font-bold">Admin dashboard</h1>
            <p className="mt-1 text-sm opacity-80">
              Buyurtmalar va mahsulotlarni boshqarish
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black dark:bg-black dark:text-white"
          >
            Chiqish
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Jami buyurtmalar
            </p>
            <h3 className="mt-2 text-2xl font-bold">{totalOrders}</h3>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Jami mahsulotlar
            </p>
            <h3 className="mt-2 text-2xl font-bold">{totalProducts}</h3>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Yetkazilgan
            </p>
            <h3 className="mt-2 text-2xl font-bold">{deliveredOrders}</h3>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Tushum
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              {totalRevenue.toLocaleString()} so‘m
            </h3>
          </div>
        </div>

        <form
          onSubmit={handleSaveProduct}
          className="space-y-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {editingProductId
                ? "✏️ Mahsulotni tahrirlash"
                : "➕ Yangi mahsulot qo‘shish"}
            </h2>

            {editingProductId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-sm text-zinc-500"
              >
                Bekor qilish
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Mahsulot nomi"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
          />

          <input
            type="number"
            placeholder="Narx"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
          />

          <input
            type="number"
            placeholder="Eski narx (ixtiyoriy)"
            value={newProduct.old_price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, old_price: e.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
          />

          <input
            type="text"
            placeholder="Kategoriya"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Rasm yuklash</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />

            {uploading && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Yuklanmoqda...
              </p>
            )}

            {newProduct.image && (
              <img
                src={newProduct.image}
                alt="Preview"
                className="h-40 w-full rounded-2xl object-cover"
              />
            )}
          </div>

          <input
            type="text"
            placeholder="Yoki rasm URL kiriting"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
          />

          <textarea
            placeholder="Tavsif"
            rows="4"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
          />

          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {editingProductId ? "Yangilash" : "Mahsulot qo‘shish"}
          </button>
        </form>

        <div className="space-y-3">
          <h2 className="text-xl font-bold">🛍 Mahsulotlar</h2>

          {loadingProducts && (
            <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              Mahsulotlar yuklanmoqda...
            </div>
          )}

          {!loadingProducts && products.length === 0 && (
            <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              Hozircha mahsulotlar yo‘q
            </div>
          )}

          {!loadingProducts && products.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mb-3 h-44 w-full rounded-2xl object-cover"
                    />
                  )}

                  <h3 className="text-lg font-bold">{product.name}</h3>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {product.category}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {Number(product.price || 0).toLocaleString()} so‘m
                    </span>

                    {product.old_price && (
                      <span className="text-sm text-zinc-400 line-through">
                        {Number(product.old_price).toLocaleString()} so‘m
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold dark:bg-zinc-800"
                    >
                      Tahrirlash
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 rounded-2xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950"
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <h2 className="text-xl font-bold">📦 Buyurtmalar</h2>
        </div>

        {loadingOrders && (
          <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Buyurtmalar yuklanmoqda...
          </div>
        )}

        {errorText && <p className="text-sm text-red-500">{errorText}</p>}

        {!loadingOrders && !errorText && orders.length === 0 && (
          <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Hozircha buyurtmalar yo‘q
          </div>
        )}

        {!loadingOrders && !errorText && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{order.order_number}</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {order.customer_full_name}
                    </p>
                  </div>

                  {/* 🔥 STATUS BLOCK */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] ||
                        "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                    >
                      {order.status}
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="rounded-xl border border-zinc-200 bg-transparent px-2 py-1 text-xs outline-none dark:border-zinc-800"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Telefon
                    </p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      To‘lov usuli
                    </p>
                    <p className="font-medium">{order.payment_method}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Manzil
                    </p>
                    <p className="font-medium">{order.customer_address}</p>
                  </div>

                  {order.comment && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Izoh
                      </p>
                      <p className="font-medium">{order.comment}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Jami summa
                    </p>
                    <p className="text-lg font-bold">
                      {Number(order.total).toLocaleString()} so‘m
                    </p>
                  </div>
                </div>

                {/* 🔥 ORDER ITEMS */}
                <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                    Mahsulotlar
                  </p>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50"
                      >
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {item.quantity} dona{" "}
                            {item.size ? `• ${item.size}` : ""}
                          </p>
                        </div>

                        <p className="font-semibold">
                          {(
                            Number(item.price) * Number(item.quantity)
                          ).toLocaleString()}{" "}
                          so‘m
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
    </div>
  );
}