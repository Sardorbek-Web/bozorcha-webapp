import { create } from "zustand";

function getInitialCart() {
  const saved = localStorage.getItem("bozorcha-cart");
  return saved ? JSON.parse(saved) : [];
}

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),

  saveCart: (items) => {
    localStorage.setItem("bozorcha-cart", JSON.stringify(items));
    set({ items });
  },

  addToCart: (product, selectedSize = null) => {
    const items = get().items;

    const existing = items.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    let updatedItems;

    if (existing) {
      updatedItems = items.map((item) =>
        item.id === product.id && item.size === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedItems = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          quantity: 1,
        },
      ];
    }

    get().saveCart(updatedItems);
  },

  increaseQuantity: (id, size = null) => {
    const updatedItems = get().items.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    get().saveCart(updatedItems);
  },

  decreaseQuantity: (id, size = null) => {
    const updatedItems = get()
      .items
      .map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    get().saveCart(updatedItems);
  },

  removeFromCart: (id, size = null) => {
    const updatedItems = get().items.filter(
      (item) => !(item.id === id && item.size === size)
    );

    get().saveCart(updatedItems);
  },

  clearCart: () => {
    get().saveCart([]);
  },
}));