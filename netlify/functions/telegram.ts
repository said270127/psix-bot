// Netlify funksiyasi: POST /api/telegram
import { sendToTelegram, type TelegramPayload } from "../../server/telegram";

export const config = { path: "/api/telegram" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ ok: false, error: "Faqat POST" }, { status: 405 });
  }
  let payload: TelegramPayload;
  try {
    payload = (await req.json()) as TelegramPayload;
  } catch {
    return Response.json({ ok: false, error: "Noto'g'ri JSON" }, { status: 400 });
  }
  const { status, body } = await sendToTelegram(
    payload,
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.TELEGRAM_CHAT_ID,
  );
  return Response.json(body, { status });
}
