// Ma'lumotlar ombori: Upstash Redis (REST orqali, qo'shimcha paket kerak emas).
// Vercel'da Storage → Upstash Redis ulanganda kerakli o'zgaruvchilar o'zi qo'shiladi.

type Cmd = (string | number)[];

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function storeConfigured(): boolean {
  return config() !== null;
}

async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
  const cfg = config();
  if (!cfg) throw new Error("Redis ulanmagan");
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error(`Redis xatosi: ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  return data.map((d) => {
    if (d.error) throw new Error(`Redis: ${d.error}`);
    return d.result;
  });
}

function toObject(flat: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(flat)) {
    for (let i = 0; i + 1 < flat.length; i += 2) out[String(flat[i])] = String(flat[i + 1]);
  }
  return out;
}

const K = {
  users: "psix:users", // botga /start bosgan oddiy foydalanuvchilar
  admins: "psix:admins", // qo'shimcha adminlar
  adminNames: "psix:adminnames", // adminlarning ismlari (ro'yxatda ko'rsatish uchun)
  seq: "psix:reg:seq", // #id hisoblagich
  regs: "psix:regs", // ro'yxatdan o'tganlar #id lari (tartib bilan)
  stats: "psix:stats", // hisoblagichlar
  reg: (id: number) => `psix:reg:${id}`,
  wait: (id: number) => `psix:wait:${id}`,
};

export const CATEGORIES = ["3-7", "8-13", "14-17", "18+"] as const;

export type Registration = {
  id: number;
  name: string;
  phone: string;
  category: string;
  done: boolean;
};

export async function trackUser(userId: number) {
  await pipeline([["SADD", K.users, userId]]);
}

export async function isExtraAdmin(userId: number): Promise<boolean> {
  const [r] = await pipeline([["SISMEMBER", K.admins, userId]]);
  return r === 1;
}

export async function listAdmins(): Promise<number[]> {
  const [r] = await pipeline([["SMEMBERS", K.admins]]);
  return Array.isArray(r) ? r.map(Number).filter((n) => Number.isInteger(n) && n > 0) : [];
}

export async function removeAdmin(userId: number) {
  await pipeline([
    ["SREM", K.admins, userId],
    ["HDEL", K.adminNames, userId],
  ]);
}

export async function setAdminName(userId: number, name: string) {
  await pipeline([["HSET", K.adminNames, userId, name.slice(0, 60)]]);
}

export async function getAdminNames(): Promise<Record<string, string>> {
  const [r] = await pipeline([["HGETALL", K.adminNames]]);
  return toObject(r);
}

export async function addAdmin(userId: number) {
  await pipeline([["SADD", K.admins, userId]]);
}

export async function setWait(userId: number, state: string) {
  await pipeline([["SET", K.wait(userId), state, "EX", 600]]);
}

export async function getWait(userId: number): Promise<string | null> {
  const [r] = await pipeline([["GET", K.wait(userId)]]);
  return typeof r === "string" ? r : null;
}

export async function clearWait(userId: number) {
  await pipeline([["DEL", K.wait(userId)]]);
}

export async function createRegistration(p: {
  name: string;
  phone: string;
  category: string;
}): Promise<number> {
  const [id] = await pipeline([["INCR", K.seq]]);
  const n = Number(id);
  await pipeline([
    [
      "HSET",
      K.reg(n),
      "id", n,
      "name", p.name,
      "phone", p.phone,
      "category", p.category,
      "done", "0",
      "at", new Date().toISOString(),
    ],
    ["RPUSH", K.regs, n],
    ["HINCRBY", K.stats, `cat:${p.category}`, 1],
  ]);
  return n;
}

export async function markDone(id: number, result: string, score: number, maxScore: number) {
  const [existing] = await pipeline([["HGET", K.reg(id), "done"]]);
  if (existing === null || existing === undefined) return; // bunday #id yo'q
  if (existing === "1") return; // allaqachon hisoblangan
  await pipeline([
    ["HSET", K.reg(id), "done", "1", "result", result, "score", `${score}/${maxScore}`],
    ["HINCRBY", K.stats, "done", 1],
  ]);
}

export type Stats = {
  visitors: number;
  registered: number;
  done: number;
  byCategory: Record<string, number>;
};

export async function getStats(): Promise<Stats> {
  const [visitors, registered, statsFlat] = await pipeline([
    ["SCARD", K.users],
    ["LLEN", K.regs],
    ["HGETALL", K.stats],
  ]);
  const s = toObject(statsFlat);
  const byCategory: Record<string, number> = {};
  for (const c of CATEGORIES) byCategory[c] = Number(s[`cat:${c}`] ?? 0);
  return {
    visitors: Number(visitors),
    registered: Number(registered),
    done: Number(s.done ?? 0),
    byCategory,
  };
}

export async function getRegistrations(page: number, size: number): Promise<Registration[]> {
  const start = page * size;
  const [ids] = await pipeline([["LRANGE", K.regs, start, start + size - 1]]);
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const rows = await pipeline(ids.map((id) => ["HGETALL", K.reg(Number(id))] as Cmd));
  return rows.map((flat) => {
    const o = toObject(flat);
    return {
      id: Number(o.id),
      name: o.name ?? "",
      phone: o.phone ?? "",
      category: o.category ?? "",
      done: o.done === "1",
    };
  });
}
