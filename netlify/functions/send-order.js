export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method not allowed",
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing BOT_TOKEN or ADMIN_CHAT_ID",
        }),
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

    const itemsText = items.length
      ? items
          .map((item, index) => {
            const lineTotal =
              Number(item.price || 0) * Number(item.quantity || 0);

            return (
              `${index + 1}) ${item.name}\n` +
              `   • Soni: ${item.quantity}` +
              `${item.size ? `\n   • Razmer: ${item.size}` : ""}` +
              `\n   • Narxi: ${lineTotal.toLocaleString()} so‘m`
            );
          })
          .join("\n\n")
      : "Mahsulotlar topilmadi";

    const text =
      `🛍 Yangi buyurtma!\n\n` +
      `📦 Buyurtma raqami: ${orderNumber || "Noma’lum"}\n` +
      `👤 Mijoz: ${customerFullName || "Kiritilmagan"}\n` +
      `📞 Telefon: ${customerPhone || "Kiritilmagan"}\n` +
      `📍 Manzil: ${customerAddress || "Kiritilmagan"}\n` +
      `💳 To‘lov usuli: ${paymentMethod || "Kiritilmagan"}\n` +
      `💰 Jami: ${Number(total || 0).toLocaleString()} so‘m\n\n` +
      `🧾 Mahsulotlar:\n${itemsText}`;

    const telegramResponse = await fetch(
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

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Telegram API error",
          details: telegramData,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        message: "Order sent to Telegram",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Unknown error",
      }),
    };
  }
}