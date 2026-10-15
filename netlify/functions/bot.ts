// Netlify funksiyasi: POST /api/bot (Telegram webhook)
import { handleBotUpdate } from "../../server/bot";

export const config = { path: "/api/bot" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ ok: false, error: "Faqat POST" }, { status: 405 });
  }
  let update: Parameters<typeof handleBotUpdate>[0];
  try {
    update = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Noto'g'ri JSON" }, { status: 400 });
  }
  const { status, body } = await handleBotUpdate(
    update,
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.WEBAPP_URL,
  );
  return Response.json(body, { status });
}
