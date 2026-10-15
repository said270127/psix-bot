// Vercel serverless funksiyasi: POST /api/bot (Telegram webhook)
import { handleBotUpdate } from "../server/bot.js";

type Req = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};
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
  const header = req.headers?.["x-telegram-bot-api-secret-token"];
  const { status, body } = await handleBotUpdate(update as Parameters<typeof handleBotUpdate>[0], {
    token: process.env.TELEGRAM_BOT_TOKEN,
    webAppUrl: process.env.WEBAPP_URL,
    ownerId: process.env.TELEGRAM_CHAT_ID,
    webhookSecret: process.env.WEBHOOK_SECRET,
    headerSecret: Array.isArray(header) ? header[0] : header,
  });
  res.status(status).json(body);
}
