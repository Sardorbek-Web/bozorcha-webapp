import { create } from "zustand";

function getInitialOrders() {
  const saved = localStorage.getItem("bozorcha-orders");
  return saved ? JSON.parse(saved) : [];
}

function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BZ-${random}`;
}

export const useOrdersStore = create((set, get) => ({
  orders: getInitialOrders(),

  saveOrders: (orders) => {
    localStorage.setItem("bozorcha-orders", JSON.stringify(orders));
    set({ orders });
  },

  createOrder: ({ customer, items, total }) => {
    const currentOrders = get().orders;

    const newOrder = {
      id: Date.now(),
      orderNumber: generateOrderNumber(),
      status: "Qabul qilindi",
      total,
      items,
      customer,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...currentOrders];
    get().saveOrders(updatedOrders);

    return newOrder;
  },
}));