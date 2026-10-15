// Telegram bot webhook mantiqi: /start (yoki istalgan xabar) kelganda
// salomlashuv xabari va "Testni yechish" tugmasini yuboradi.
// Tugma saytni Telegram ichida (Mini App) ochadi.

type TelegramUpdate = {
  message?: {
    chat?: { id?: number };
    from?: { first_name?: string };
    text?: string;
  };
};

export function buildWelcome(firstName?: string): string {
  const name = firstName ? `, ${firstName}` : "";
  return [
    `Assalomu alaykum${name}! 👋`,
    "",
    "🧠 Discover Yourself botiga xush kelibsiz.",
    "",
    "Qisqa psixologik test orqali o'zingiz (yoki bolangiz) haqingizda, kuchli tomonlar va mos yo'nalishlar haqida bilib oling.",
    "",
    "Boshlash uchun pastdagi tugmani bosing 👇",
  ].join("\n");
}

export async function handleBotUpdate(
  update: TelegramUpdate,
  token: string | undefined,
  webAppUrl: string | undefined,
): Promise<{ status: number; body: { ok: boolean; error?: string } }> {
  if (!token || !webAppUrl) {
    return {
      status: 500,
      body: { ok: false, error: "TELEGRAM_BOT_TOKEN yoki WEBAPP_URL sozlanmagan" },
    };
  }

  const chatId = update?.message?.chat?.id;
  // Xabar bo'lmasa (masalan boshqa turdagi update) — Telegram qayta yubormasligi uchun 200 qaytaramiz
  if (!chatId) return { status: 200, body: { ok: true } };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildWelcome(update.message?.from?.first_name),
        reply_markup: {
          inline_keyboard: [[{ text: "📝 Testni yechish", web_app: { url: webAppUrl } }]],
        },
      }),
    });
    if (!res.ok) {
      console.error("Telegram xatosi:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Telegram so'rovi muvaffaqiyatsiz:", err);
  }
  // Doim 200: aks holda Telegram bir xil update'ni qayta-qayta yuboradi
  return { status: 200, body: { ok: true } };
}
