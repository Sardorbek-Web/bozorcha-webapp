import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAdminStore((state) => state.login);

  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const ok = login(password);

    if (ok) {
      navigate("/admin");
    } else {
      setErrorText("Parol noto‘g‘ri");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 text-black dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto max-w-md pt-10">
        <div className="rounded-[28px] bg-gradient-to-br from-zinc-900 to-zinc-700 p-5 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-black">
          <p className="text-sm opacity-80">Bozorcha Admin</p>
          <h1 className="mt-2 text-2xl font-bold">Admin kirish</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <label className="mb-2 block text-sm font-medium">Admin parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting"
              className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
            />
          </div>

          {errorText && <p className="text-sm text-red-500">{errorText}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-black py-4 text-sm font-semibold text-white dark:bg-white dark:text-black"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}