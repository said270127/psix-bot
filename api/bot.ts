// Vercel serverless funksiyasi: POST /api/bot (Telegram webhook)
import { handleBotUpdate } from "../server/bot";

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
  const update = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { status, body } = await handleBotUpdate(
    update as Parameters<typeof handleBotUpdate>[0],
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.WEBAPP_URL,
  );
  res.status(status).json(body);
}
