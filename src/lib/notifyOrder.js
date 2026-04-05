export async function notifyTelegramAboutOrder(order) {
  const response = await fetch("/.netlify/functions/send-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Telegramga yuborib bo‘lmadi");
  }

  return response.json();
}