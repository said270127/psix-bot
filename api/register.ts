// Vercel serverless funksiyasi: POST /api/register (ro'yxatdan o'tganni saqlaydi)
import { registerPerson, type RegisterPayload } from "../server/register.js";

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
  const payload = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as RegisterPayload;
  const { status, body } = await registerPerson(payload);
  res.status(status).json(body);
}
