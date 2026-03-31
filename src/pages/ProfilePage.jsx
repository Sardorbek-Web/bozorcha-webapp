import {
  User,
  Package,
  MapPin,
  Heart,
  Globe,
  Moon,
  MessageCircle,
} from "lucide-react";
import ProfileMenuItem from "../components/ProfileMenuItem";

export default function ProfilePage() {
  return (
    <div className="space-y-4 p-4 pb-28">
      <div className="rounded-[28px] bg-gradient-to-br from-zinc-900 to-zinc-700 p-5 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-black">
        <p className="text-sm opacity-80">Bozorcha profili</p>
        <h1 className="mt-2 text-2xl font-bold">Ali Valiyev</h1>
        <p className="mt-1 text-sm opacity-80">+998 90 123 45 67</p>
      </div>

      <div className="space-y-3">
        <ProfileMenuItem
          icon={Package}
          title="Buyurtmalarim"
          subtitle="Faol va oldingi buyurtmalar"
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
        />
        <ProfileMenuItem
          icon={Globe}
          title="Til"
          subtitle="O‘zbek / Русский"
        />
        <ProfileMenuItem
          icon={Moon}
          title="Ko‘rinish"
          subtitle="Dark / Light mode"
        />
        <ProfileMenuItem
          icon={MessageCircle}
          title="Admin bilan bog‘lanish"
          subtitle="@bozorcha_support"
        />
        <ProfileMenuItem
          icon={User}
          title="Shaxsiy ma’lumotlar"
          subtitle="Ism va telefon raqam"
        />
      </div>
    </div>
  );
}