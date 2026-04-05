import { supabase } from "./supabase";

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateProduct(productId, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
  return true;
}