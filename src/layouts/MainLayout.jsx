import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-black transition-colors dark:bg-zinc-950 dark:text-white">
      <main className="mx-auto max-w-md pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}