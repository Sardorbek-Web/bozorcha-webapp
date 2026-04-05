import { supabase } from "./supabase";

export async function upsertTelegramUser(user) {
  if (!user?.id) return null;

  const payload = {
    telegram_id: user.id,
    username: user.username || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "telegram_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByTelegramId(telegramId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(telegramId, updates) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("telegram_id", telegramId)
    .select()
    .single();

  if (error) throw error;
  return data;
}