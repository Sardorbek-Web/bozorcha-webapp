import { create } from "zustand";

function getInitialAdmin() {
  return localStorage.getItem("bozorcha-admin-auth") === "true";
}

export const useAdminStore = create((set) => ({
  isAdmin: getInitialAdmin(),

  login: (password) => {
    const correctPassword = "bozorcha123";

    if (password === correctPassword) {
      localStorage.setItem("bozorcha-admin-auth", "true");
      set({ isAdmin: true });
      return true;
    }

    return false;
  },

  logout: () => {
    localStorage.removeItem("bozorcha-admin-auth");
    set({ isAdmin: false });
  },
}));