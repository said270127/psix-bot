import { useState, useEffect } from "react";
import {
  Compass,
  Brain,
  Palette,
  BarChart3,
  Zap,
  Rocket,
  Lightbulb,
  RotateCcw,
  Home,
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
  Scale,
  Truck,
  Shield,
  TrendingUp,
  Code,
  Stethoscope,
  Landmark,
  Cog,
  FlaskConical,
  Ruler,
  Megaphone,
  PenLine,
  Languages,
  Share2,
  Heart,
  Palette as PaletteIcon,
  type LucideIcon,
} from "lucide-react";
import type { TestResult } from "@/types";

type ProfileKey = "A" | "B" | "D";

type CareerInfo = {
  name: string;
  icon: LucideIcon;
};

type ProfileData = {
  name: string;
  icon: LucideIcon;
  gradient: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  character: string;
  strengths: string[];
  careers: CareerInfo[];
};

const teenProfiles: Record<ProfileKey, ProfileData> = {
  A: {
    name: "Lider va Harakatdagi inson",
    icon: Compass,
    gradient: "from-orange-500 to-red-500",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    description:
      "Energiyaga boy, qat'iyatli va mas'uliyatdan qo'rqmaydigan inson.",
    character: "Energiyaga boy, qat'iyatli va mas'uliyatdan qo'rqmaydigan.",
    strengths: ["Odamlarni boshqarish", "Tez qaror qabul qilish"],
    careers: [
      { name: "Biznesmen", icon: Briefcase },
      { name: "Boshliq / Menejer", icon: Users },
      { name: "Yurist / Huquqshunos", icon: Scale },
      { name: "Logist", icon: Truck },
      { name: "Harbiy", icon: Shield },
      { name: "Savdo mutaxassisi", icon: TrendingUp },
    ],
  },
  B: {
    name: "Mantiqiy fikrlaydigan va Aniq inson",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-500",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    description:
      "Bosiq, diqqatli va har bir narsani tartib bilan qiladigan inson.",
    character: "Bosiq, diqqatli va har bir narsani tartib bilan qiladigan.",
    strengths: ["Hisob-kitob", "Mantiq", "Chigal narsalarni tahlil qilish"],
    careers: [
      { name: "Dasturchi / IT", icon: Code },
      { name: "Shifokor", icon: Stethoscope },
      { name: "Bankir / Iqtisodchi", icon: Landmark },
      { name: "Muhandis", icon: Cog },
      { name: "Olim", icon: FlaskConical },
      { name: "Arxitektor", icon: Ruler },
    ],
  },
  D: {
    name: "Kreativ va Kirishimli inson",
    icon: Palette,
    gradient: "from-violet-500 to-fuchsia-500",
    color: "bg-violet-500",
    bgColor: "bg-violet-50",
    textColor: "text-violet-600",
    borderColor: "border-violet-200",
    description:
      "Ijodkor, odamlar bilan tez til topishadigan va chiroyli narsalarni yaxshi ko'radigan inson.",
    character:
      "Ijodkor, odamlar bilan tez til topishadigan va chiroyli narsalarni yaxshi ko'radigan.",
    strengths: ["Yangi g'oyalar o'ylab topish", "Muloqot", "San'at"],
    careers: [
      { name: "Dizayner", icon: Palette },
      { name: "Psixolog", icon: Heart },
      { name: "Marketer", icon: Megaphone },
      { name: "Jurnalist", icon: PenLine },
      { name: "Tarjimon", icon: Languages },
      { name: "SMM-mutaxassis", icon: Share2 },
    ],
  },
};

const adultProfiles: Record<"A" | "B", ProfileData> = {
  A: {
    name: "Strateg-Tahlilchi",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-500",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    description:
      "Qarorlarni fakt va sovuqqon tahlilga tayanib qabul qilasiz. Reja va tizim bo'yicha ishlash sizga ishonch beradi.",
    character: "Mantiqiy, tizimli va adolatli.",
    strengths: [
      "Mantiq va adolat: faktlarga tayanib qaror qabul qilish",
      "Aniq tartib: reja va tizim bo'yicha ishlash",
    ],
    careers: [
      { name: "Tahlilchi", icon: TrendingUp },
      { name: "Buxgalter", icon: Landmark },
      { name: "Auditor", icon: Briefcase },
      { name: "Dasturchi", icon: Code },
      { name: "Tizim analitiki", icon: Cog },
      { name: "Loyiha menejeri", icon: Users },
      { name: "Yurist", icon: Scale },
      { name: "Biznes-konsultant", icon: Briefcase },
    ],
  },
  B: {
    name: "Moslashuvchan Empat",
    icon: Heart,
    gradient: "from-teal-500 to-emerald-500",
    color: "bg-teal-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
    borderColor: "border-teal-200",
    description:
      "Insonlar ruhiyatini nozik his qilasiz va samarali muloqot o'rnatasiz. Yangi vaziyatlarga tez moslashasiz.",
    character: "Empatik, moslashuvchan va kreativ.",
    strengths: [
      "Empatiya va intuitsiya",
      "Moslashuvchanlik va yangi g'oyalar",
    ],
    careers: [
      { name: "UX/UI dizayner", icon: Palette },
      { name: "Kopirayter", icon: PenLine },
      { name: "SMM-strateg", icon: Share2 },
      { name: "Psixolog", icon: Heart },
      { name: "HR-mutaxassis", icon: Users },
      { name: "Murabbiy", icon: Compass },
      { name: "PR-menejer", icon: Megaphone },
      { name: "Tadbirlar tashkilotchisi", icon: Briefcase },
    ],
  },
};

const partIcons: LucideIcon[] = [PaletteIcon, Compass, Brain, Heart];
const partGradients = [
  "from-violet-500 to-fuchsia-500",
  "from-orange-500 to-red-500",
  "from-blue-500 to-cyan-500",
  "from-teal-500 to-emerald-500",
];

type Props = {
  result: TestResult;
  maxScore: number;
  onRestart: () => void;
};

export default function ResultScreen({ result, maxScore, onRestart }: Props) {
  const [animated, setAnimated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(true), 50);
    const animTimer = setTimeout(() => setAnimated(true), 300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(animTimer);
    };
  }, []);

  const isKindergarten = result.ageCategory === "3-7";
  const isTwoOption = result.ageCategory === "18+";

  const aCount = result.answers.filter((a) => a.selectedIndex === 0).length;
  const bCount = result.answers.filter((a) => a.selectedIndex === 1).length;
  const dCount = isTwoOption ? 0 : result.answers.filter((a) => a.selectedIndex === 2).length;
  const total = result.answers.length || 1;

  const aPercent = Math.round((aCount / total) * 100);
  const bPercent = Math.round((bCount / total) * 100);
  const dPercent = isTwoOption ? 0 : Math.round((dCount / total) * 100);

  let dominant: ProfileData;
  let dominantPercent: number;
  let isMixed: boolean;

  if (isTwoOption) {
    dominant = aCount >= bCount ? adultProfiles.A : adultProfiles.B;
    dominantPercent = aCount >= bCount ? aPercent : bPercent;
    isMixed = aCount === bCount;
  } else if (isKindergarten) {
    dominant = teenProfiles.A;
    dominantPercent = 0;
    isMixed = false;
  } else {
    const counts: Record<ProfileKey, number> = { A: aCount, B: bCount, D: dCount };
    const dominantKey = (Object.keys(counts) as ProfileKey[]).reduce((a, b) =>
      counts[a] >= counts[b] ? a : b,
    );
    dominant = teenProfiles[dominantKey];
    dominantPercent =
      dominantKey === "A" ? aPercent : dominantKey === "B" ? bPercent : dPercent;
    isMixed = dominantPercent < 50;
  }

  const distribution = isTwoOption
    ? [
        { key: "A", label: "Strateg-Tahlilchi", percent: aPercent, color: "bg-blue-500", dotColor: "bg-blue-500", textColor: "text-blue-600" },
        { key: "B", label: "Moslashuvchan Empat", percent: bPercent, color: "bg-teal-500", dotColor: "bg-teal-500", textColor: "text-teal-600" },
      ]
    : [
        { key: "A", label: "Lider va Harakat", percent: aPercent, color: "bg-orange-500", dotColor: "bg-orange-500", textColor: "text-orange-600" },
        { key: "B", label: "Mantiqiy va Aniq", percent: bPercent, color: "bg-blue-500", dotColor: "bg-blue-500", textColor: "text-blue-600" },
        { key: "D", label: "Kreativ va Kirishimli", percent: dPercent, color: "bg-violet-500", dotColor: "bg-violet-500", textColor: "text-violet-600" },
      ];

  const categoryLabel =
    result.ageCategory === "3-7" ? "3–7 yosh" : result.ageCategory === "8-13" ? "8–13 yosh" : result.ageCategory === "14-17" ? "14–17 yosh" : "18+ yosh";

  // Kindergarten two-part rendering
  if (isKindergarten && result.parts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 px-4 py-8 sm:py-12">
        <div className={`max-w-3xl mx-auto space-y-6 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="text-center pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">TEST YAKUNLANDI</h1>
            <p className="text-slate-500 text-base sm:text-lg">Bolangizning natijasi</p>
          </div>

          {/* User Info Bar */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px] bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-0.5">Ism va familiya</p>
              <p className="text-sm font-semibold text-slate-700">{result.fullName}</p>
            </div>
            <div className="flex-1 min-w-[100px] bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-0.5">Yosh kategoriyasi</p>
              <p className="text-sm font-semibold text-slate-700">{categoryLabel}</p>
            </div>
            <div className="flex-1 min-w-[100px] bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-0.5">Natija</p>
              <p className="text-sm font-semibold text-slate-700">{result.result}</p>
            </div>
          </div>

          {/* Two-part result cards */}
          {result.parts.map((part, idx) => {
            const PartIcon = partIcons[idx] ?? Brain;
            const gradient = partGradients[idx] ?? "from-blue-500 to-cyan-500";
            return (
              <div key={idx} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} shadow-xl shadow-slate-200/60`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                      <PartIcon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs mb-0.5">{part.title}</p>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{part.resultName}</h2>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4">{part.description}</p>
                  <div className="space-y-2 mb-4">
                    {part.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-white/90">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/80 mt-1.5" />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                    <p className="text-white/90 text-sm leading-relaxed">{part.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Paid Test Promotion */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Bolangiz haqida yanada ko'proq bilishni xohlaysizmi?</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Bepul test umumiy natijani ko'rsatadi. Batafsil tahlil uchun kengaytirilgan pullik testdan foydalanishingiz mumkin.
                  </p>
                  <a
                    href="https://t.me/Malika_Umidova?text=Assalomu%20aleykum.%20Men%20sizning%20pullik%20testingiz%20haqida%20ko%27proq%20ma%27lumot%20olmoqchi%20edim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Batafsil ma'lumot olish
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Eslatma</p>
              <p className="text-sm text-blue-600 leading-relaxed">
                Ushbu bepul test bolangizning umumiy yo'nalishini ko'rsatib beradi. To'liq va aniq diagnostika uchun markazimizda psixolog bilan yuzma-yuz professional test va suhbat tashkil etiladi.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-4">
            <button onClick={onRestart} className="flex-1 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Testni qayta topshirish
            </button>
            <button onClick={onRestart} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const DominantIcon = dominant.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 px-4 py-8 sm:py-12">
      <div className={`max-w-3xl mx-auto space-y-6 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Header */}
        <div className="text-center pt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">TEST YAKUNLANDI</h1>
          <p className="text-slate-500 text-base sm:text-lg">Sizning kelajak profilingiz</p>
        </div>

        {/* Main Result Card */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${dominant.gradient} shadow-xl shadow-slate-200/60`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-20 -translate-x-16" />
          <div className="relative p-6 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm mb-5">
              <DominantIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-white/70 text-sm mb-2">Asosiy profilingiz</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">{dominant.name}</h2>
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-bold text-white">{dominantPercent}</span>
              <span className="text-2xl font-semibold text-white/80">%</span>
            </div>
            <p className="text-white/80 text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed">{dominant.description}</p>
            {isMixed && (
              <div className="mt-5 inline-block bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                <p className="text-white/90 text-sm">
                  {isTwoOption ? "Sizda har ikki yo'nalishga xos xususiyatlar nisbatan teng taqsimlangan." : "Sizda bir nechta yo'nalishga xos xususiyatlar mavjud."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Info Bar */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[140px] bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-slate-400 mb-0.5">Ism va familiya</p>
            <p className="text-sm font-semibold text-slate-700">{result.fullName}</p>
          </div>
          <div className="flex-1 min-w-[100px] bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-slate-400 mb-0.5">Yosh kategoriyasi</p>
            <p className="text-sm font-semibold text-slate-700">{categoryLabel}</p>
          </div>
          <div className="flex-1 min-w-[100px] bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-slate-400 mb-0.5">Natija</p>
            <p className="text-sm font-semibold text-slate-700">{result.result}</p>
          </div>
        </div>

        {/* Profile Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-5">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            Sizning profilingiz
          </h3>
          <div className="space-y-5">
            {distribution.map((d) => (
              <div key={d.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${d.dotColor}`} />
                    <span className="text-sm font-medium text-slate-600">{d.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{d.percent}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: animated ? `${d.percent}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character & Strengths */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-3">
              <Brain className="w-5 h-5 text-slate-400" />
              Xarakteringiz
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{dominant.character}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-3">
              <Zap className="w-5 h-5 text-slate-400" />
              Kuchli tomonlaringiz
            </h3>
            <ul className="space-y-2">
              {dominant.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${dominant.color} mt-1.5`} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-4">
            <Rocket className="w-5 h-5 text-slate-400" />
            Sizga mos kelishi mumkin bo'lgan yo'nalishlar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dominant.careers.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl ${dominant.bgColor} border ${dominant.borderColor} hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default`}>
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${dominant.color} bg-opacity-10`}>
                    <Icon className={`w-5 h-5 ${dominant.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 text-center leading-tight">{c.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Paid Test Promotion */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">O'zingiz haqingizda yanada ko'proq bilishni xohlaysizmi?</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Bepul test umumiy natijani ko'rsatadi. Batafsil tahlil uchun kengaytirilgan pullik testdan foydalanishingiz mumkin.
                </p>
                <a
                  href="https://t.me/Malika_Umidova?text=Assalomu%20aleykum.%20Men%20sizning%20pullik%20testingiz%20haqida%20ko%27proq%20ma%27lumot%20olmoqchi%20edim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Batafsil ma'lumot olish
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-700 mb-1">Eslatma</p>
            <p className="text-sm text-blue-600 leading-relaxed">
              Ushbu bepul test umumiy yo'nalishni ko'rsatib beradi. To'liq va aniq diagnostika uchun markazimizda psixolog bilan yuzma-yuz professional test va suhbat tashkil etiladi.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <button onClick={onRestart} className="flex-1 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Testni qayta topshirish
          </button>
          <button onClick={onRestart} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}
