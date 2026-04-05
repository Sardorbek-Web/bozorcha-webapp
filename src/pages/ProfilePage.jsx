import {
  User,
  Package,
  MapPin,
  Heart,
  Globe,
  Moon,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileMenuItem from "../components/ProfileMenuItem";
import { useUserStore } from "../store/userStore";

export default function ProfilePage() {
  const navigate = useNavigate();

  const telegramUser = useUserStore((state) => state.telegramUser);
  const profile = useUserStore((state) => state.profile);

  const firstName = profile?.first_name || telegramUser?.first_name || "";
  const lastName = profile?.last_name || telegramUser?.last_name || "";
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Foydalanuvchi";

  const username = profile?.username || telegramUser?.username || "";
  const phone = profile?.phone || "Telefon kiritilmagan";
  const language = profile?.language || "uz";
  const theme = profile?.theme || "light";

  return (
    <div className="space-y-4 p-4 pb-28">
      <div className="rounded-[28px] bg-gradient-to-br from-zinc-900 to-zinc-700 p-5 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-black">
        <p className="text-sm opacity-80">Bozorcha profili</p>
        <h1 className="mt-2 text-2xl font-bold">{fullName}</h1>
        <p className="mt-1 text-sm opacity-80">
          {username ? `@${username}` : phone}
        </p>
      </div>

      <div className="space-y-3">
        <ProfileMenuItem
          icon={Package}
          title="Buyurtmalarim"
          subtitle="Faol va oldingi buyurtmalar"
          onClick={() => navigate("/orders")}
        />
        <ProfileMenuItem
          icon={MapPin}
          title="Manzillar"
          subtitle="Yetkazib berish manzillari"
        />
        <ProfileMenuItem
          icon={Heart}
          title="Sevimlilar"
          subtitle="Saqlangan mahsulotlar"
          onClick={() => navigate("/favorites")}
        />
        <ProfileMenuItem
          icon={Globe}
          title="Til"
          subtitle={language === "ru" ? "Русский" : "O‘zbek"}
          onClick={() => navigate("/profile/edit")}
        />
        <ProfileMenuItem
          icon={Moon}
          title="Ko‘rinish"
          subtitle={theme === "dark" ? "Dark mode" : "Light mode"}
          onClick={() => navigate("/profile/edit")}
        />
        <ProfileMenuItem
          icon={MessageCircle}
          title="Admin bilan bog‘lanish"
          subtitle="@bozorcha_support"
        />
        <ProfileMenuItem
          icon={User}
          title="Shaxsiy ma’lumotlar"
          subtitle={phone}
          onClick={() => navigate("/profile/edit")}
        />
      </div>
    </div>
  );
}