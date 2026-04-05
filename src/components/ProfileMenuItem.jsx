import { ChevronRight } from "lucide-react";

export default function ProfileMenuItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
          <Icon size={18} />
        </div>

        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <ChevronRight size={18} className="text-zinc-400" />
    </button>
  );
}