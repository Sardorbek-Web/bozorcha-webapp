import { supabase } from "./supabase";

export async function uploadImage(file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}