import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/products";
import { getCategories } from "../lib/categories";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
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
      setErrorText("Mahsulotlarni yuklab bo‘lmadi");
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
    <div className="space-y-4 p-4 pb-28">
      <div>
        <h1 className="text-2xl font-bold">Katalog</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Barcha mahsulotlar
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <CategoryChips
        categories={categories}
        selected={selected}
        onSelect={setSelected}
      />

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
    </div>
  );
}