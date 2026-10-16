import { Brain, Baby, User, Users, TrendingUp, Smile, Sparkles } from "lucide-react";
import { HelpCircle } from "lucide-react";
import type { AgeCategory } from "@/types";

type Props = {
  onSelect: (category: AgeCategory) => void;
};

const categoryCards: { category: AgeCategory; icon: typeof Smile; label: string; desc: string; questions: string; accent: string; iconBg: string; iconColor: string; hoverBorder: string }[] = [
  {
    category: "3-7",
    icon: Baby,
    label: "3–7 yosh",
    desc: "Bog'cha yoshidagi bolalar uchun mo'ljallangan test. Bolaning iqtidor yo'nalishi va temperamentini aniqlaydi.",
    questions: "6 savol",
    accent: "from-blue-50",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    hoverBorder: "hover:border-blue-200",
  },
  {
    category: "8-13",
    icon: Smile,
    label: "8–13 yosh",
    desc: "Bolalar uchun psixologik test. Shaxsiy rivojlanish, ijtimoiy ko'nikmalar va qiziqishlarni baholaydi.",
    questions: "10 savol",
    accent: "from-blue-50",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    hoverBorder: "hover:border-blue-200",
  },
  {
    category: "14-17",
    icon: User,
    label: "14–17 yosh",
    desc: "O'smirlar uchun yo'nalish tanlash testi. Qiziqishlar, xarakter va mos kasblarni aniqlaydi.",
    questions: "10 savol",
    accent: "from-blue-50",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    hoverBorder: "hover:border-blue-200",
  },
  {
    category: "18+",
    icon: Users,
    label: "18+ yosh",
    desc: "Kattalar uchun psixologik test. Shaxs turi, kuchli tomonlar va mos sohalarni aniqlaydi.",
    questions: "10 savol",
    accent: "from-teal-50",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
    hoverBorder: "hover:border-teal-200",
  },
];

export default function AgeSelection({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg shadow-blue-200 mb-6">
            <Brain className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-2 tracking-tight">
            Discover Yourself
          </h1>
          <div className="inline-flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span className="text-xl sm:text-2xl font-semibold text-slate-600">Siz kimsiz?</span>
          </div>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            Yosh kategoriyangizni tanlang va bepul psixologik testni boshlang.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-slate-600">
              1,200+ kishi ushbu testdan o'tdi
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.category}
                onClick={() => onSelect(card.category)}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left border border-slate-100 ${card.hoverBorder} hover:-translate-y-1 flex flex-col min-h-[260px]`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.accent} to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500`} />
                <div className="relative flex flex-col h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.iconBg} mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${card.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{card.label}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                    {card.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-medium text-slate-500">{card.questions}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
