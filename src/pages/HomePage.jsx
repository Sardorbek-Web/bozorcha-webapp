import { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/products";
import { getCategories } from "../lib/categories";
import { getTelegramUser, initTelegramApp } from "../lib/telegram";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    initTelegramApp();

    const user = getTelegramUser();
    if (user) {
      setTgUser(user);
    }

    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setErrorText("");

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error(error);
      setErrorText("Ma’lumotlarni yuklab bo‘lmadi");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const productName = product?.name?.toLowerCase() || "";
    const productCategory = product?.category || "";

    const matchCategory = selected ? productCategory === selected : true;
    const matchSearch = productName.includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-5 p-4 pb-28">
      <Header />

      {tgUser && (
        <div className="rounded-3xl bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
          Salom, <span className="font-semibold">{tgUser.first_name}</span>
        </div>
      )}

      <SearchBar value={search} onChange={setSearch} />

      <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-zinc-900 to-zinc-700 p-5 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-black">
        <p className="text-sm opacity-80">Bozorcha premium tanlov</p>
        <h2 className="mt-2 max-w-[240px] text-2xl font-bold leading-tight">
          Yangi kolleksiya va eng sara mahsulotlar
        </h2>
        <button className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black dark:bg-black dark:text-white">
          Hozir ko‘rish
        </button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Kategoriyalar</h3>
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-zinc-500"
          >
            Barchasi
          </button>
        </div>

        <CategoryChips
          categories={categories}
          selected={selected}
          onSelect={setSelected}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Mashhur mahsulotlar</h3>
          <button className="text-sm text-zinc-500">Ko‘proq</button>
        </div>

        {loading && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Yuklanmoqda...
          </p>
        )}

        {errorText && <p className="text-sm text-red-500">{errorText}</p>}

        {!loading && !errorText && filteredProducts.length === 0 && (
          <div className="rounded-3xl bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Hech narsa topilmadi
          </div>
        )}

        {!loading && !errorText && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}