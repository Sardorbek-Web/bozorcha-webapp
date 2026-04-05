import { supabase } from "./supabase";

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOrderItems(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;

  return true;
}