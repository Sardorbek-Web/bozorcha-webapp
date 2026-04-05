import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { updateUserProfile } from "../lib/users";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const telegramUser = useUserStore((state) => state.telegramUser);
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const [form, setForm] = useState({
    phone: "",
    language: "uz",
    theme: "light",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    setForm({
      phone: profile?.phone || "",
      language: profile?.language || "uz",
      theme: profile?.theme || "light",
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!telegramUser?.id) {
      setErrorText("Telegram foydalanuvchi topilmadi");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");
      setSuccessText("");

      const updated = await updateUserProfile(telegramUser.id, {
        phone: form.phone,
        language: form.language,
        theme: form.theme,
      });

      setProfile(updated);
      applyTheme(form.theme);
      setSuccessText("Profil muvaffaqiyatli saqlandi");

      setTimeout(() => {
        navigate("/profile");
      }, 700);
    } catch (error) {
      console.error(error);
      setErrorText("Profilni saqlab bo‘lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 pb-28">
      <div>
        <h1 className="text-2xl font-bold">Profilni tahrirlash</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Telefon, til va ko‘rinishni yangilang
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Telefon raqam
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Til</label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              >
                <option value="uz">O‘zbek</option>
                <option value="ru">Русский</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Ko‘rinish</label>
              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 outline-none dark:border-zinc-800"
              >
                <option value="light">Light mode</option>
                <option value="dark">Dark mode</option>
              </select>
            </div>
          </div>
        </div>

        {errorText && <p className="text-sm text-red-500">{errorText}</p>}
        {successText && <p className="text-sm text-green-600">{successText}</p>}

        <div className="fixed bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}