import { Sparkles, ArrowRight, RotateCcw, Home } from "lucide-react";

// "Pullik testdan olish" tugmasi shu Instagram akkauntining direct (xabar) oynasini ochadi
const INSTAGRAM_DM_URL = "https://ig.me/m/malika.pedagog";

function openInstagram(e: React.MouseEvent<HTMLAnchorElement>) {
  // Telegram ichida (Mini App) ochilsa, havola tashqi brauzer/Instagram ilovasida ochiladi
  const tgApp = (window as unknown as { Telegram?: { WebApp?: { openLink?: (url: string) => void } } })
    .Telegram?.WebApp;
  if (tgApp?.openLink) {
    e.preventDefault();
    tgApp.openLink(INSTAGRAM_DM_URL);
  }
}

type Props = {
  // true: bolalar natijasi (3-7, 8-13) — "bolaning ..."; false: "sizning ..."
  forChild: boolean;
  onRestart: () => void;
};

export default function ResultFooter({ forChild, onRestart }: Props) {
  return (
    <>
      {/* Pullik test */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
              <Sparkles className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Bu hali natijaning 10% qismi xolos!
              </h3>
              <p className="text-[15px] text-slate-300 leading-relaxed mb-6">
                Qolgan 90% natijani bilish, o'zingizning kuchli tomonlaringiz va sizga mos kasbiy
                yo'nalishni aniqlash uchun to'liq pullik testdan o'ting. Test yakunida natijangizni
                psixolog bilan shaxsiy suhbat orqali batafsil tahlil qilish imkoniyatiga ega bo'lasiz.
              </p>
              <a
                href={INSTAGRAM_DM_URL}
                onClick={openInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition-all"
              >
                Pullik testdan olish
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Muhim eslatma */}
      <div className="rounded-[2rem] border-2 border-indigo-200 bg-gradient-to-br from-white via-indigo-50/40 to-indigo-100/60 p-6 sm:p-9 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-5 mb-6">
          <div className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 ring-4 ring-white shadow-lg shadow-indigo-500/30">
            <span className="text-3xl leading-none" role="img" aria-label="Lampochka">
              💡
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-indigo-600">
                Muhim eslatma
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                E'tibor bering
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Test natijasi haqida</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white/90 border border-indigo-100 p-5 sm:p-6 shadow-sm space-y-4">
          <p className="text-slate-700 leading-8">
            {forChild ? (
              <>
                Ushbu bepul test bolaning{" "}
                <strong className="text-slate-900">umumiy yo'nalishi va qiziqishlarini</strong> ko'rsatib
                beradi.
              </>
            ) : (
              <>
                Ushbu bepul test sizning{" "}
                <strong className="text-slate-900">umumiy yo'nalishingiz va qiziqishlaringizni</strong>{" "}
                ko'rsatib beradi.
              </>
            )}
          </p>
          <p className="text-slate-700 leading-8">
            <strong className="text-indigo-600">To'liq va aniq diagnostika</strong> uchun markazimizda
            psixolog bilan yuzma-yuz professional test va individual suhbat tashkil etiladi.
          </p>
        </div>
      </div>

      {/* Tugmalar */}
      <div className="flex flex-col sm:flex-row gap-3 pb-4">
        <button
          onClick={onRestart}
          className="flex-1 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Testni qayta topshirish
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Bosh sahifaga qaytish
        </button>
      </div>
    </>
  );
}
