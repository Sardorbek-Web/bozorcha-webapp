import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Online shop</p>
        <h1 className="text-2xl font-bold tracking-tight">Bozorcha</h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}