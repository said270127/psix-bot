// Saytda "Testni boshlash" bosilganda ro'yxatdan o'tganni saqlaydi va #id beradi.
import { createRegistration, storeConfigured, CATEGORIES } from "./store.js";

export type RegisterPayload = {
  fullName: string;
  phoneNumber: string;
  ageCategory: string;
};

export async function registerPerson(
  p: RegisterPayload,
): Promise<{ status: number; body: { ok: boolean; id?: number; error?: string } }> {
  const name = typeof p?.fullName === "string" ? p.fullName.trim().slice(0, 100) : "";
  const phone = typeof p?.phoneNumber === "string" ? p.phoneNumber.replace(/[^\d+]/g, "") : "";
  const category = typeof p?.ageCategory === "string" ? p.ageCategory : "";

  if (!name || phone.length < 9 || phone.length > 15 || !(CATEGORIES as readonly string[]).includes(category)) {
    return { status: 400, body: { ok: false, error: "Noto'g'ri ma'lumot" } };
  }
  if (!storeConfigured()) {
    return { status: 503, body: { ok: false, error: "Ombor ulanmagan" } };
  }
  try {
    const id = await createRegistration({ name, phone, category });
    return { status: 200, body: { ok: true, id } };
  } catch (err) {
    console.error("Ro'yxatga olishda xato:", err);
    return { status: 500, body: { ok: false, error: "Saqlab bo'lmadi" } };
  }
}
