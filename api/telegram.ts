// Vercel serverless funksiyasi: POST /api/telegram
import { sendToTelegram, type TelegramPayload } from "../server/telegram";

type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  json: (data: unknown) => void;
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Faqat POST" });
    return;
  }
  const payload = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as TelegramPayload;
  const { status, body } = await sendToTelegram(
    payload,
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.TELEGRAM_CHAT_ID,
  );
  res.status(status).json(body);
}
