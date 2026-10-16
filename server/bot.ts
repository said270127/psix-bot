// Telegram bot webhook mantiqi.
// - Hamma uchun: /start → salomlashuv + "Testni yechish" tugmasi (sayt Mini App sifatida ochiladi)
// - Adminlar: "Ro'yxat" va "Adminlar ro'yxati"
// - Bosh admin (TELEGRAM_CHAT_ID): yana "Admin qo'shish" va "Adminni olib tashlash"
import {
  addAdmin,
  clearWait,
  getAdminNames,
  getRegistrations,
  getStats,
  getWait,
  isExtraAdmin,
  listAdmins,
  removeAdmin,
  setAdminName,
  setWait,
  storeConfigured,
  trackUser,
  type Registration,
} from "./store.js";

export type BotEnv = {
  token?: string;
  webAppUrl?: string;
  ownerId?: string; // bosh admin: TELEGRAM_CHAT_ID
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
type Role = "user" | "admin" | "owner";

const PAGE_SIZE = 25;
const CATEGORY_LABELS: Record<string, string> = {
  "3-7": "3–7 yosh",
  "8-13": "8–13 yosh",
  "14-17": "14–17 yosh",
  "18+": "18+ yosh",
};

export function buildWelcome(firstName?: string, role: Role = "user"): string {
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
  if (role === "owner") {
    lines.push("", "👑 Siz bosh adminsiz: ro'yxat, adminlar ro'yxati, admin qo'shish va olib tashlash tugmalari pastda.");
  } else if (role === "admin") {
    lines.push("", "🔐 Siz adminsiz: ro'yxat va adminlar ro'yxati tugmalari pastda.");
  }
  return lines.join("\n");
}

export function menuKeyboard(webAppUrl: string, role: Role) {
  const rows: unknown[][] = [[{ text: "📝 Testni yechish", web_app: { url: webAppUrl } }]];
  if (role !== "user") {
    rows.push([
      { text: "📋 Ro'yxat", callback_data: "list" },
      { text: "👥 Adminlar ro'yxati", callback_data: "admins" },
    ]);
  }
  if (role === "owner") {
    rows.push([
      { text: "➕ Admin qo'shish", callback_data: "addadmin" },
      { text: "➖ Adminni olib tashlash", callback_data: "rmadmin" },
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

export function buildAdminsText(
  ownerId: string,
  extras: number[],
  names: Record<string, string>,
): string {
  const owner = names[String(ownerId)];
  const lines = [
    "👥 Adminlar ro'yxati",
    "",
    `👑 Bosh admin: ${owner ? `${owner} — ` : ""}${ownerId}`,
    "",
  ];
  if (extras.length === 0) {
    lines.push("Qo'shimcha adminlar yo'q.");
  } else {
    lines.push(`Adminlar (${extras.length}):`);
    extras.forEach((id, i) => {
      const n = names[String(id)];
      lines.push(`${i + 1}. ${n ? `${n} — ${id}` : `${id} (ismi hali noma'lum)`}`);
    });
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

function isOwnerId(userId: number, env: BotEnv): boolean {
  return !!env.ownerId && String(userId) === String(env.ownerId).trim();
}

async function getRole(userId: number, env: BotEnv): Promise<Role> {
  if (isOwnerId(userId, env)) return "owner";
  if (!storeConfigured()) return "user";
  try {
    return (await isExtraAdmin(userId)) ? "admin" : "user";
  } catch (err) {
    console.error("Admin tekshirishda xato:", err);
    return "user";
  }
}

async function rememberName(user: TgUser) {
  if (!user.first_name || !storeConfigured()) return;
  try {
    await setAdminName(user.id, user.first_name);
  } catch (err) {
    console.error("Ismni saqlashda xato:", err);
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

function parseId(s: string): number | null {
  return /^\d{5,15}$/.test(s) ? Number(s) : null;
}

async function handleCallback(
  cq: NonNullable<TelegramUpdate["callback_query"]>,
  env: BotEnv,
  token: string,
) {
  const userId = cq.from.id;
  const chatId = cq.message?.chat.id ?? userId;
  const data = cq.data ?? "";
  const deny = (text: string) =>
    tg(token, "answerCallbackQuery", { callback_query_id: cq.id, text, show_alert: true });

  const role = await getRole(userId, env);
  if (role === "user") return void (await deny("Ruxsat yo'q"));

  // Admin qo'shish va olib tashlash faqat bosh adminga
  const ownerOnly = data === "addadmin" || data === "rmadmin" || data === "rmno" || data.startsWith("rm:") || data.startsWith("rmok:");
  if (ownerOnly && role !== "owner") return void (await deny("Bu tugma faqat bosh admin uchun"));

  if (!storeConfigured()) {
    return void (await deny("Ma'lumotlar ombori (Upstash Redis) hali ulanmagan"));
  }
  await tg(token, "answerCallbackQuery", { callback_query_id: cq.id });
  await rememberName(cq.from);

  try {
    if (data === "list") {
      await showList(token, chatId, null);
    } else if (data.startsWith("list:")) {
      await showList(token, chatId, Number(data.slice(5)) || 0, cq.message?.message_id);
    } else if (data === "admins") {
      const [extras, names] = await Promise.all([listAdmins(), getAdminNames()]);
      await tg(token, "sendMessage", {
        chat_id: chatId,
        text: buildAdminsText(String(env.ownerId ?? ""), extras, names),
      });
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
    } else if (data === "rmadmin") {
      const [extras, names] = await Promise.all([listAdmins(), getAdminNames()]);
      if (extras.length === 0) {
        await tg(token, "sendMessage", { chat_id: chatId, text: "Olib tashlash uchun qo'shimcha admin yo'q." });
      } else {
        await tg(token, "sendMessage", {
          chat_id: chatId,
          text: "➖ Qaysi adminning huquqini olib tashlaymiz?",
          reply_markup: {
            inline_keyboard: [
              ...extras.map((id) => [
                { text: `❌ ${names[String(id)] ? `${names[String(id)]} ` : ""}(${id})`, callback_data: `rm:${id}` },
              ]),
              [{ text: "↩️ Bekor qilish", callback_data: "rmno" }],
            ],
          },
        });
      }
    } else if (data.startsWith("rm:")) {
      const id = parseId(data.slice(3));
      if (id) {
        const names = await getAdminNames();
        await tg(token, "sendMessage", {
          chat_id: chatId,
          text: `❓ ${names[String(id)] ? `${names[String(id)]} ` : ""}(${id}) adminligini olib tashlaysizmi?`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Ha, olib tashlash", callback_data: `rmok:${id}` },
                { text: "↩️ Yo'q", callback_data: "rmno" },
              ],
            ],
          },
        });
      }
    } else if (data.startsWith("rmok:")) {
      const id = parseId(data.slice(5));
      if (id && (await isExtraAdmin(id))) {
        await removeAdmin(id);
        await tg(token, "sendMessage", { chat_id: chatId, text: `✅ ${id} adminlikdan olib tashlandi.` });
        await tg(token, "sendMessage", { chat_id: id, text: "Sizdan admin huquqi olib tashlandi." });
      } else {
        await tg(token, "sendMessage", { chat_id: chatId, text: "Bu odam allaqachon admin emas." });
      }
    } else if (data === "rmno") {
      await tg(token, "sendMessage", { chat_id: chatId, text: "Bekor qilindi." });
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

  const role = await getRole(from.id, env);
  const text = (msg.text ?? "").trim();

  if (role !== "user") await rememberName(from);

  // Admin qo'shish: faqat bosh admin
  if (role === "owner" && storeConfigured()) {
    try {
      const waiting = await getWait(from.id);
      if (waiting === "add_admin" && !text.startsWith("/start")) {
        if (text === "/cancel") {
          await clearWait(from.id);
          await tg(token, "sendMessage", { chat_id: chatId, text: "Bekor qilindi." });
          return;
        }
        const id = parseId(text);
        if (id) {
          if (isOwnerId(id, env) || (await isExtraAdmin(id))) {
            await tg(token, "sendMessage", {
              chat_id: chatId,
              text: "Bu odam allaqachon admin. Boshqa ID yuboring yoki /cancel bosing.",
            });
            return;
          }
          await addAdmin(id);
          await clearWait(from.id);
          const notified = await tg(token, "sendMessage", {
            chat_id: id,
            text: "🔐 Sizga admin huquqi berildi. Menyuni ochish uchun /start yozing.",
          });
          await tg(token, "sendMessage", {
            chat_id: chatId,
            text: `✅ Admin qo'shildi: ${id}` + (notified ? "" : "\n(U hali botga /start yozmagan, shuning uchun xabar bormadi. Unga /start yozishini ayting.)"),
            reply_markup: menuKeyboard(webAppUrl, "owner"),
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
  if (role === "user" && storeConfigured()) {
    try {
      await trackUser(from.id);
    } catch (err) {
      console.error("Foydalanuvchini hisoblashda xato:", err);
    }
  }

  await tg(token, "sendMessage", {
    chat_id: chatId,
    text: buildWelcome(from.first_name, role),
    reply_markup: menuKeyboard(webAppUrl, role),
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
