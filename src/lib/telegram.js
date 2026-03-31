export function getTelegramWebApp() {
  return window.Telegram?.WebApp || null;
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();

  if (!tg) return null;

  tg.ready();
  tg.expand();

  return tg;
}