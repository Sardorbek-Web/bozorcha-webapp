import { supabase } from "./supabase";

function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BZ-${random}`;
}

export async function createOrderWithItems({ customer, items, total }) {
  const orderNumber = generateOrderNumber();

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        order_number: orderNumber,
        customer_full_name: customer.fullName,
        customer_phone: customer.phone,
        customer_address: customer.address,
        payment_method: customer.paymentMethod,
        comment: customer.comment || "",
        total,
      },
    ])
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderItemsPayload = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    product_image: item.image || "",
    size: item.size || "",
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    throw itemsError;
  }

  return orderData;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrderItems(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}