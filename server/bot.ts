// Telegram bot webhook mantiqi.
// - Hamma uchun: /start → salomlashuv + "Testni yechish" tugmasi (sayt Mini App sifatida ochiladi)
// - Adminlar uchun qo'shimcha tugmalar: "Ro'yxat" va "Admin qo'shish"
import {
  addAdmin,
  clearWait,
  getRegistrations,
  getStats,
  getWait,
  isExtraAdmin,
  setWait,
  storeConfigured,
  trackUser,
  type Registration,
} from "./store.js";

export type BotEnv = {
  token?: string;
  webAppUrl?: string;
  ownerId?: string; // birinchi (asosiy) admin: TELEGRAM_CHAT_ID
  webhookSecret?: string;
  headerSecret?: string; // Telegram yuborgan X-Telegram-Bot-Api-Secret-Token
};

type TgUser = { id: number; first_name?: string };
type TelegramUpdate = {
  message?: {
    chat?: { id?: number; type?: string };
    from?: TgUser;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: TgUser;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
  };
};

type Result = { status: number; body: { ok: boolean; error?: string } };

const PAGE_SIZE = 25;
const CATEGORY_LABELS: Record<string, string> = {
  "3-7": "3–7 yosh",
  "8-13": "8–13 yosh",
  "14-17": "14–17 yosh",
  "18+": "18+ yosh",
};

export function buildWelcome(firstName?: string, admin = false): string {
  const name = firstName ? `, ${firstName}` : "";
  const lines = [
    `Assalomu alaykum${name}! 👋`,
    "",
    "🧠 Discover Yourself botiga xush kelibsiz.",
    "",
    "Qisqa psixologik test orqali o'zingiz (yoki bolangiz) haqingizda, kuchli tomonlar va mos yo'nalishlar haqida bilib oling.",
    "",
    "Boshlash uchun pastdagi tugmani bosing 👇",
  ];
  if (admin) lines.push("", "🔐 Siz adminsiz: pastda ro'yxat va admin qo'shish tugmalari ham bor.");
  return lines.join("\n");
}

function menuKeyboard(webAppUrl: string, admin: boolean) {
  const rows: unknown[][] = [[{ text: "📝 Testni yechish", web_app: { url: webAppUrl } }]];
  if (admin) {
    rows.push([
      { text: "📋 Ro'yxat", callback_data: "list" },
      { text: "➕ Admin qo'shish", callback_data: "addadmin" },
    ]);
  }
  return { inline_keyboard: rows };
}

export function buildListText(
  stats: Awaited<ReturnType<typeof getStats>>,
  items: Registration[],
  page: number,
  pages: number,
): string {
  const lines = [
    "📋 Ro'yxat",
    "",
    `👥 Botga kelganlar: ${stats.visitors}`,
    `📝 Ro'yxatdan o'tganlar: ${stats.registered}`,
    `✅ Testni tugatganlar: ${stats.done}`,
    "",
    "Kategoriya bo'yicha:",
    ...Object.entries(CATEGORY_LABELS).map(([k, label]) => `• ${label}: ${stats.byCategory[k] ?? 0}`),
    "",
    `Sahifa ${page + 1} / ${pages}   (✅ test tugatgan, ⏳ tugatmagan)`,
    "",
  ];
  if (items.length === 0) {
    lines.push("Hozircha ro'yxatdan o'tgan odam yo'q.");
  } else {
    for (const r of items) {
      lines.push(`#${r.id} ${r.name.slice(0, 60)} — ${r.phone} (${CATEGORY_LABELS[r.category] ?? r.category}) ${r.done ? "✅" : "⏳"}`);
    }
  }
  return lines.join("\n").slice(0, 4000);
}

function pageKeyboard(page: number, pages: number) {
  const row: unknown[] = [];
  if (page > 0) row.push({ text: "◀️ Oldingi", callback_data: `list:${page - 1}` });
  row.push({ text: `${page + 1}/${pages}`, callback_data: `list:${page}` });
  if (page < pages - 1) row.push({ text: "Keyingi ▶️", callback_data: `list:${page + 1}` });
  return { inline_keyboard: [row] };
}

async function tg(token: string, method: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`Telegram ${method} xatosi:`, res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Telegram ${method} so'rovi muvaffaqiyatsiz:`, err);
    return false;
  }
}

async function isAdmin(userId: number, env: BotEnv): Promise<boolean> {
  if (env.ownerId && String(userId) === String(env.ownerId).trim()) return true;
  if (!storeConfigured()) return false;
  try {
    return await isExtraAdmin(userId);
  } catch (err) {
    console.error("Admin tekshirishda xato:", err);
    return false;
  }
}

async function showList(token: string, chatId: number, page: number | null, messageId?: number) {
  const stats = await getStats();
  const pages = Math.max(1, Math.ceil(stats.registered / PAGE_SIZE));
  // Birinchi ochilganda eng oxirgi (yangi) sahifa ko'rsatiladi
  const p = Math.min(Math.max(page ?? pages - 1, 0), pages - 1);
  const items = await getRegistrations(p, PAGE_SIZE);
  const payload = {
    chat_id: chatId,
    text: buildListText(stats, items, p, pages),
    reply_markup: pageKeyboard(p, pages),
  };
  if (messageId) await tg(token, "editMessageText", { ...payload, message_id: messageId });
  else await tg(token, "sendMessage", payload);
}

async function handleCallback(
  cq: NonNullable<TelegramUpdate["callback_query"]>,
  env: BotEnv,
  token: string,
) {
  const userId = cq.from.id;
  const chatId = cq.message?.chat.id ?? userId;

  if (!(await isAdmin(userId, env))) {
    await tg(token, "answerCallbackQuery", { callback_query_id: cq.id, text: "Ruxsat yo'q", show_alert: true });
    return;
  }
  if (!storeConfigured()) {
    await tg(token, "answerCallbackQuery", {
      callback_query_id: cq.id,
      text: "Ma'lumotlar ombori (Upstash Redis) hali ulanmagan",
      show_alert: true,
    });
    return;
  }
  await tg(token, "answerCallbackQuery", { callback_query_id: cq.id });

  const data = cq.data ?? "";
  try {
    if (data === "list") {
      await showList(token, chatId, null);
    } else if (data.startsWith("list:")) {
      await showList(token, chatId, Number(data.slice(5)) || 0, cq.message?.message_id);
    } else if (data === "addadmin") {
      await setWait(userId, "add_admin");
      await tg(token, "sendMessage", {
        chat_id: chatId,
        text: [
          "➕ Yangi admin qo'shish",
          "",
          "Qo'shmoqchi bo'lgan odamning Telegram ID raqamini yuboring (faqat raqam, masalan 123456789).",
          "ID ni bilish uchun u odam @userinfobot ga /start yozishi kerak.",
          "",
          "Bekor qilish: /cancel",
        ].join("\n"),
      });
    }
  } catch (err) {
    console.error("Callback xatosi:", err);
    await tg(token, "sendMessage", { chat_id: chatId, text: "⚠️ Xatolik yuz berdi, birozdan keyin qayta urinib ko'ring." });
  }
}

async function handleMessage(
  msg: NonNullable<TelegramUpdate["message"]>,
  env: BotEnv,
  token: string,
  webAppUrl: string,
) {
  const chatId = msg.chat?.id;
  const from = msg.from;
  if (!chatId || !from || msg.chat?.type !== "private") return;

  const admin = await isAdmin(from.id, env);
  const text = (msg.text ?? "").trim();

  if (admin && storeConfigured()) {
    try {
      const waiting = await getWait(from.id);
      if (waiting === "add_admin" && !text.startsWith("/start")) {
        if (text === "/cancel") {
          await clearWait(from.id);
          await tg(token, "sendMessage", { chat_id: chatId, text: "Bekor qilindi." });
          return;
        }
        if (/^\d{5,15}$/.test(text)) {
          await addAdmin(Number(text));
          await clearWait(from.id);
          const notified = await tg(token, "sendMessage", {
            chat_id: Number(text),
            text: "🔐 Sizga admin huquqi berildi. Menyuni ochish uchun /start yozing.",
          });
          await tg(token, "sendMessage", {
            chat_id: chatId,
            text: `✅ Admin qo'shildi: ${text}` + (notified ? "" : "\n(U hali botga /start yozmagan, shuning uchun xabar bormadi. Unga /start yozishini ayting.)"),
            reply_markup: menuKeyboard(webAppUrl, true),
          });
          return;
        }
        await tg(token, "sendMessage", {
          chat_id: chatId,
          text: "❌ Noto'g'ri ID. Faqat raqamlardan iborat Telegram ID yuboring yoki /cancel bosing.",
        });
        return;
      }
      if (text.startsWith("/start")) await clearWait(from.id);
    } catch (err) {
      console.error("Holatni tekshirishda xato:", err);
    }
  }

  // Oddiy foydalanuvchilar "botga kelganlar" hisobiga qo'shiladi (adminlar emas)
  if (!admin && storeConfigured()) {
    try {
      await trackUser(from.id);
    } catch (err) {
      console.error("Foydalanuvchini hisoblashda xato:", err);
    }
  }

  await tg(token, "sendMessage", {
    chat_id: chatId,
    text: buildWelcome(from.first_name, admin),
    reply_markup: menuKeyboard(webAppUrl, admin),
  });
}

export async function handleBotUpdate(update: TelegramUpdate, env: BotEnv): Promise<Result> {
  const { token, webAppUrl, webhookSecret } = env;
  if (!token || !webAppUrl || !webhookSecret) {
    return {
      status: 500,
      body: { ok: false, error: "TELEGRAM_BOT_TOKEN, WEBAPP_URL yoki WEBHOOK_SECRET sozlanmagan" },
    };
  }
  // Faqat Telegram'ning o'zi yuborgan so'rovlar qabul qilinadi
  if (env.headerSecret !== webhookSecret) {
    return { status: 401, body: { ok: false, error: "Ruxsat yo'q" } };
  }

  try {
    if (update?.callback_query) await handleCallback(update.callback_query, env, token);
    else if (update?.message) await handleMessage(update.message, env, token, webAppUrl);
  } catch (err) {
    console.error("Bot xatosi:", err);
  }
  // Doim 200: aks holda Telegram bir xil update'ni qayta-qayta yuboradi
  return { status: 200, body: { ok: true } };
}
