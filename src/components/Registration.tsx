import { useState, type FormEvent } from "react";
import { ArrowLeft, Phone, User, Loader2 } from "lucide-react";
import type { AgeCategory } from "@/types";

type Props = {
  ageCategory: AgeCategory;
  onBack: () => void;
  onStart: (firstName: string, lastName: string, phone: string) => void;
};

type FormErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

function isValidUzbekPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // +998901234567, 998901234567, 901234567
  if (/^\+998\d{9}$/.test(normalized)) return true;
  if (/^998\d{9}$/.test(normalized)) return true;
  if (/^\d{9}$/.test(normalized)) return true;
  return false;
}

export default function Registration({ ageCategory, onBack, onStart }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function clearError(field: keyof FormErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = "Ismingizni kiriting.";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Familiyangizni kiriting.";
    }
    if (!phone.trim()) {
      newErrors.phone = "Telefon raqamini to'g'ri kiriting.";
    } else if (!isValidUzbekPhone(phone)) {
      newErrors.phone = "Telefon raqamini to'g'ri kiriting.";
    }
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 300));
      onStart(firstName.trim(), lastName.trim(), normalizePhone(phone));
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  }

  const categoryLabel =
    ageCategory === "3-7" ? "3–7 yosh" : ageCategory === "8-13" ? "8–13 yosh" : ageCategory === "14-17" ? "14–17 yosh" : "18+ yosh";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-xs font-medium mb-3">
              {categoryLabel}
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Ro'yxatdan o'tish</h2>
            <p className="text-slate-400 text-sm">
              Testni boshlash uchun quyidagi ma'lumotlarni kiriting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Ism
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError("firstName");
                  }}
                  placeholder="Ismingiz"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                    errors.firstName ? "border-red-300" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1.5 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Familiya
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError("lastName");
                  }}
                  placeholder="Familiyangiz"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                    errors.lastName ? "border-red-300" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1.5 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Telefon raqami
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  placeholder="+998 90 123 45 67"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                    errors.phone ? "border-red-300" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Boshlanmoqda...
                </>
              ) : (
                "Testni boshlash"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
