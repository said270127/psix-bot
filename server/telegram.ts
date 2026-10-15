// Telegram'ga natija yuboradigan umumiy mantiq.
// Bot tokeni FAQAT serverda (env o'zgaruvchida) turadi, brauzerga chiqmaydi.

import { markDone, storeConfigured } from "./store.js";

export type TelegramPayload = {
  registrationId?: number;
  fullName: string;
  phoneNumber: string;
  ageCategory: string;
  testType: string;
  score: number;
  maxScore: number;
  result: string;
  interpretation: {
    description: string;
    strengths: string[];
    improvements: string[];
    recommendation: string;
  };
  parts?: {
    title: string;
    resultName: string;
    description: string;
    strengths: string[];
    recommendation: string;
  }[];
  completedAt: string;
};

const TEST_LABELS: Record<string, string> = {
  kindergarten_psychological_test: "Bog'cha testi (3-7 yosh)",
  child_psychological_test: "Bolalar testi (8-13 yosh)",
  teen_psychological_test: "O'smirlar testi (14-17 yosh)",
  adult_psychological_test: "Kattalar testi (18+)",
};

function clip(value: unknown, max = 500): string {
  return String(value ?? "").slice(0, max);
}

function list(items: unknown): string {
  if (!Array.isArray(items)) return "";
  return items.slice(0, 10).map((s) => `• ${clip(s, 300)}`).join("\n");
}

export function buildMessage(p: TelegramPayload): string {
  const date = new Date(p.completedAt);
  const when = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

  const lines: string[] = [
    p.registrationId ? `🧠 Yangi test natijasi #${Number(p.registrationId)}` : "🧠 Yangi test natijasi",
    "",
    `👤 Ism: ${clip(p.fullName, 100)}`,
    `📞 Telefon: ${clip(p.phoneNumber, 30)}`,
    `🎂 Yosh toifasi: ${clip(p.ageCategory, 10)}`,
    `📝 Test: ${TEST_LABELS[p.testType] ?? clip(p.testType, 60)}`,
    `📊 Ball: ${Number(p.score)} / ${Number(p.maxScore)}`,
    `🏷 Natija: ${clip(p.result, 200)}`,
  ];
  if (when) lines.push(`🕒 Vaqt: ${when}`);

  const i = p.interpretation;
  if (i) {
    lines.push("", `📄 ${clip(i.description, 800)}`);
    const strengths = list(i.strengths);
    if (strengths) lines.push("", "✅ Kuchli tomonlari:", strengths);
    const improvements = list(i.improvements);
    if (improvements) lines.push("", "⚠️ Rivojlantirish kerak:", improvements);
    if (i.recommendation) lines.push("", `💡 Tavsiya: ${clip(i.recommendation, 600)}`);
  }

  if (Array.isArray(p.parts) && p.parts.length > 0) {
    lines.push("", "📚 Bo'limlar:");
    for (const part of p.parts.slice(0, 10)) {
      lines.push(`— ${clip(part.title, 100)}: ${clip(part.resultName, 100)}`);
    }
  }

  // Telegram xabar limiti 4096 belgi
  return lines.join("\n").slice(0, 4000);
}

export async function sendToTelegram(
  payload: TelegramPayload,
  token: string | undefined,
  chatId: string | undefined,
): Promise<{ status: number; body: { ok: boolean; error?: string } }> {
  if (!token || !chatId) {
    return {
      status: 500,
      body: { ok: false, error: "TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan" },
    };
  }
  if (!payload || typeof payload.fullName !== "string" || typeof payload.result !== "string") {
    return { status: 400, body: { ok: false, error: "Noto'g'ri ma'lumot" } };
  }

  // Ro'yxatdagi shu odamni "testni tugatdi" deb belgilaymiz (Telegram yuborilmasa ham)
  const regId = Number(payload.registrationId);
  if (Number.isInteger(regId) && regId > 0 && storeConfigured()) {
    try {
      await markDone(regId, clip(payload.result, 200), Number(payload.score), Number(payload.maxScore));
    } catch (err) {
      console.error("Natijani belgilashda xato:", err);
    }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(payload),
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("Telegram xatosi:", res.status, detail);
      return { status: 502, body: { ok: false, error: "Telegram xabarni qabul qilmadi" } };
    }
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error("Telegram so'rovi muvaffaqiyatsiz:", err);
    return { status: 502, body: { ok: false, error: "Telegram'ga ulanib bo'lmadi" } };
  }
}
