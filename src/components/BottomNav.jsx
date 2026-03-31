import { NavLink } from "react-router-dom";
import { House, Grid2x2, ShoppingCart, Heart, User } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useFavoritesStore } from "../store/favoritesStore";

export default function BottomNav() {
  const cartItems = useCartStore((state) => state.items);
  const favoriteItems = useFavoritesStore((state) => state.items);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favoriteItems.length;

  const navItems = [
    { to: "/", icon: House, label: "Home", badge: 0 },
    { to: "/catalog", icon: Grid2x2, label: "Katalog", badge: 0 },
    { to: "/cart", icon: ShoppingCart, label: "Savat", badge: cartCount },
    { to: "/favorites", icon: Heart, label: "Saqlangan", badge: favoriteCount },
    { to: "/profile", icon: User, label: "Profil", badge: 0 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-md justify-around py-3">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 text-[11px] ${
                isActive
                  ? "text-black dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              }`
            }
          >
            <div className="relative">
              <Icon size={20} />
              {badge > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white dark:bg-white dark:text-black">
                  {badge}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}