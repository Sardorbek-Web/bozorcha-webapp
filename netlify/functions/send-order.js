export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing env variables" }),
      };
    }

    const {
      orderNumber,
      customerFullName,
      customerPhone,
      customerAddress,
      paymentMethod,
      total,
      items = [],
    } = body;

    const itemsText = items
      .map(
        (item, index) =>
          `${index + 1}) ${item.name} — ${item.quantity} dona${
            item.size ? ` • ${item.size}` : ""
          } — ${(Number(item.price) * Number(item.quantity)).toLocaleString()} so‘m`
      )
      .join("\n");

    const text =
      `🛍 Yangi buyurtma\n\n` +
      `📦 Buyurtma: ${orderNumber}\n` +
      `👤 Mijoz: ${customerFullName}\n` +
      `📞 Telefon: ${customerPhone}\n` +
      `📍 Manzil: ${customerAddress}\n` +
      `💳 To‘lov: ${paymentMethod}\n` +
      `💰 Jami: ${Number(total || 0).toLocaleString()} so‘m\n\n` +
      `🧾 Mahsulotlar:\n${itemsText}`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}