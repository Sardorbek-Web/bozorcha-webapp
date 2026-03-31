import { create } from "zustand";

function getInitialFavorites() {
  const saved = localStorage.getItem("bozorcha-favorites");
  return saved ? JSON.parse(saved) : [];
}

export const useFavoritesStore = create((set, get) => ({
  items: getInitialFavorites(),

  saveFavorites: (items) => {
    localStorage.setItem("bozorcha-favorites", JSON.stringify(items));
    set({ items });
  },

  toggleFavorite: (product) => {
    const items = get().items;
    const exists = items.some((item) => item.id === product.id);

    if (exists) {
      const updatedItems = items.filter((item) => item.id !== product.id);
      get().saveFavorites(updatedItems);
    } else {
      const updatedItems = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          old_price: product.old_price ?? null,
          image: product.image,
          badge: product.badge ?? "",
          category: product.category ?? "",
        },
      ];
      get().saveFavorites(updatedItems);
    }
  },

  isFavorite: (id) => {
    return get().items.some((item) => item.id === id);
  },

  removeFavorite: (id) => {
    const updatedItems = get().items.filter((item) => item.id !== id);
    get().saveFavorites(updatedItems);
  },

  clearFavorites: () => {
    get().saveFavorites([]);
  },
}));