import type { AgeCategory, TestType, AnswerOption, KindergartenPart } from "@/types";

export type Interpretation = {
  description: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
};

export function getTestType(category: AgeCategory): TestType {
  if (category === "3-7") return "kindergarten_psychological_test";
  if (category === "8-13") return "child_psychological_test";
  if (category === "14-17") return "teen_psychological_test";
  return "adult_psychological_test";
}

export function calculateScore(answers: { selectedIndex: number }[], options: AnswerOption[][]): number {
  return answers.reduce((total, ans, i) => total + (options[i]?.[ans.selectedIndex]?.score ?? 0), 0);
}

export function calculateKindergartenResult(answers: { selectedIndex: number }[]): { result: string; interpretation: Interpretation; parts: KindergartenPart[] } {
  // Part 1: Q1-3 (indices 0-2), 3 options A/B/C
  // Part 2: Q4-6 (indices 3-5), 4 options A/B/C/D
  const part1Answers = answers.slice(0, 3);
  const part2Answers = answers.slice(3, 6);

  // Count per option for part 1
  const p1Counts = [0, 0, 0];
  for (const a of part1Answers) p1Counts[a.selectedIndex] = (p1Counts[a.selectedIndex] ?? 0) + 1;
  let p1Max = 0;
  let p1Idx = 0;
  for (let i = 0; i < 3; i++) {
    if (p1Counts[i] > p1Max) { p1Max = p1Counts[i]; p1Idx = i; }
  }

  // Count per option for part 2
  const p2Counts = [0, 0, 0, 0];
  for (const a of part2Answers) p2Counts[a.selectedIndex] = (p2Counts[a.selectedIndex] ?? 0) + 1;
  let p2Max = 0;
  let p2Idx = 0;
  for (let i = 0; i < 4; i++) {
    if (p2Counts[i] > p2Max) { p2Max = p2Counts[i]; p2Idx = i; }
  }

  const talentMap: Record<number, { name: string; desc: string; strengths: string[]; rec: string }> = {
    0: {
      name: "Vizual-Ijodiy",
      desc: "Bolangiz tasavvuri boy, dunyoni ranglar va tasvirlar orqali anglaydi. Tuyg'ularini rasm va san'atda yaxshi ifodalaydi.",
      strengths: ["Tasavvuri boy va ijodkor", "Rasm, musiqa va san'atga qiziqish"],
      rec: "Rasm, musiqa, aktyorlik va dizayn to'garaklariga bering. Tasavvurini cheklamang, ko'proq rasmli kitoblar bering.",
    },
    1: {
      name: "Kinetik-Lider",
      desc: "Bolangiz energiyaga boy, amaliyotchi. Ma'lumotni harakat, sport va o'zi bajarib ko'rish orqali o'zlashtiradi.",
      strengths: ["Energiyaga boy va faol", "Harakatli o'yinlarga qiziqish"],
      rec: "Sport, raqs, robototexnika to'garaklariga bering. Energiyasini faol to'garaklarga yo'naltiring.",
    },
    2: {
      name: "Mantiqiy-Tahlilchi",
      desc: "Bolangiz diqqatli, kuzatuvchi va sabrli. Eshitgan ma'lumotini tahlil qiladi, mayda detallarga e'tiborli.",
      strengths: ["Diqqatli va kuzatuvchi", "Mantiqiy fikrlashga moyil"],
      rec: "Shaxmat, Lego-konstruktor, chet tillari to'garaklariga bering. Mantiqiy savollariga erinmay javob bering.",
    },
  };

  const temperamentMap: Record<number, { name: string; desc: string; strengths: string[]; rec: string }> = {
    0: {
      name: "Sangvinik",
      desc: "Quvnoq, kirishimli, yangilikka tez moslashadi. Lekin diqqati tez chalg'iydi.",
      strengths: ["Kirishimli va quvnoq", "Yangilikka tez moslashish"],
      rec: "Boshlagan ishini quvnoq holatda oxiriga yetkazishni o'rgating.",
    },
    1: {
      name: "Xolerik",
      desc: "Qat'iyatli, shiddatli, liderlikka intiladi. Lekin tez jahl qiladi.",
      strengths: ["Qat'iyatli va liderlikka intiluvchi", "Tez natijaga erishish"],
      rec: "U bilan baqirmasdan, his-tuyg'ularini tushungan holda gaplashing.",
    },
    2: {
      name: "Flegmatik",
      desc: "Bosiq, sabrli, har bir ishni tartib bilan bajaradi. Lekin sekin va o'zgarishlarga qiyin ko'nikadi.",
      strengths: ["Bosiq va sabrli", "Tartib bilan ishlash"],
      rec: "Uni shoshirmang, vaqt bering. O'zgarishlarga moslashishga asta-sekin o'rgating.",
    },
    3: {
      name: "Melanxolik",
      desc: "Sezgir, mehribon, ehtiyotkor. Lekin tez xafa bo'ladi va tortinadi.",
      strengths: ["Sezgir va mehribon", "Ehtiyotkor va diqqatli"],
      rec: "Ustidan kulmang, tez-tez ruhlantirib, maqtang. Ijtimoiy muloqotga asta-sekin jalb eting.",
    },
  };

  const talent = talentMap[p1Idx]!;
  const temperament = temperamentMap[p2Idx]!;

  const parts: KindergartenPart[] = [
    {
      title: "Bolangizning yetakchi iqtidori (1–3-savollar)",
      resultName: talent.name,
      description: talent.desc,
      strengths: talent.strengths,
      recommendation: talent.rec,
    },
    {
      title: "Bolangizning temperamenti (4–6-savollar)",
      resultName: temperament.name,
      description: temperament.desc,
      strengths: temperament.strengths,
      recommendation: temperament.rec,
    },
  ];

  return {
    result: `${talent.name} — ${temperament.name}`,
    interpretation: {
      description: `${talent.desc} Temperament jihatidan: ${temperament.desc}`,
      strengths: [...talent.strengths, ...temperament.strengths],
      improvements: [],
      recommendation: `${talent.rec} ${temperament.rec}`,
    },
    parts,
  };
}

export function calculateChildResult(score: number, maxScore: number): { result: string; interpretation: Interpretation } {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 75) {
    return {
      result: "Yuqori darajada rivojlangan",
      interpretation: {
        description:
          "Bola yangi vaziyatlarga tez moslashadi, do'stlar bilan erkin muloqot qiladi va o'z fikrini ifoda eta oladi. Bu uning shaxsiy rivojlanishida katta yutuqdir.",
        strengths: [
          "Yangi do'stlar orttirish va ijtimoiy muloqot",
          "O'z fikrini ifoda eta olish",
          "Yangi vaziyatlarga tez moslashish",
        ],
        improvements: [
          "Vaqt boshqaruvi ko'nikmalarini rivojlantirish",
          "Stressli vaziyatlarda sabrlilikni o'rganish",
        ],
        recommendation:
          "Bolaning kuchli tomonlaridan foydalanib, ijodiy va sport faoliyatiga jalb eting. Bu uning o'ziga ishonchini yanada oshiradi.",
      },
    };
  }

  if (percentage >= 50) {
    return {
      result: "O'rta darajada rivojlangan",
      interpretation: {
        description:
          "Bola ko'plab sohalarda yaxshi natija ko'rsatadi, ammo ba'zi vaziyatlarda o'ziga ishonchni oshirishi mumkin. Bu butunlay normal.",
        strengths: [
          "O'z fikrlarini ifoda eta olish",
          "Do'stlar bilan munosabat o'rnatish",
          "Yangi narsalarni o'rganishga qiziqish",
        ],
        improvements: [
          "O'ziga ishonchni oshirish",
          "Yangi vaziyatlarga moslashish ko'nikmalarini rivojlantirish",
        ],
        recommendation:
          "Bolani qiyinroq vaziyatlarda ko'proq ishtirok etishga rag'batlantiring. Har bir kichik yutuq uning ishonchini mustahkamlaydi.",
      },
    };
  }

  return {
    result: "Rivojlantirish mumkin bo'lgan daraja",
    interpretation: {
      description:
        "Bola hozir o'zini ifoda etish va yangi vaziyatlarga moslashishda ba'zi qiyinchiliklarni boshdan kechirishi mumkin. Bu mutlaqo normal. Muhimi — kichik qadamlar bilan oldinga intilish.",
      strengths: [
        "O'z xatolarini tan olishga tayyorlik",
        "Boshqalarning his-tuyg'ularini tushunishga harakat",
      ],
      improvements: [
        "O'z his-tuyg'ularini ifoda etish ko'nikmalarini rivojlantirish",
        "Ijtimoiy muloqotda ko'proq ishtirok etish",
        "O'ziga ishonchni bosqichma-bosqich oshirish",
      ],
      recommendation:
        "Kichik qadamlardan boshlang — har kuni bola bilan birga yangi narsa sinab ko'ring. Ota-ona bilan birga vaqt o'tkazish va o'z his-tuyg'ulari haqida gaplashish bolaga yordam beradi.",
    },
  };
}

export function calculateTeenResult(score: number, maxScore: number): { result: string; interpretation: Interpretation } {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 75) {
    return {
      result: "Yuqori darajada rivojlangan",
      interpretation: {
        description:
          "Siz o'z his-tuyg'ularingizni yaxshi tushunasiz, do'stlar bilan erkin muloqot qilasiz va yangi vaziyatlarga tez moslashasiz. Bu sizning shaxsiy rivojlanishingizda katta yutuqdir.",
        strengths: [
          "O'z his-tuyg'ularini ifoda eta olish",
          "Yangi do'stlar orttirish va ijtimoiy muloqot",
          "Qaror qabul qilishda ishonchlik",
          "Mas'uliyatni qabul qilishga tayyorlik",
        ],
        improvements: [
          "Vaqt boshqaruvi va rejalashtirish ko'nikmalarini yanada mustahkamlash",
          "Stressli vaziyatlarda sabrlilikni rivojlantirish",
        ],
        recommendation:
          "O'z kuchli tomonlaringizdan foydalanib, yangi loyihalar va ijodiy faoliyatda qatnashing. Bu sizning o'zingizga bo'lgan ishonchingizni yanada oshiradi.",
      },
    };
  }

  if (percentage >= 50) {
    return {
      result: "O'rta darajada rivojlangan",
      interpretation: {
        description:
          "Siz ko'plab sohalarda yaxshi natija ko'rsatasiz, ammo ba'zi vaziyatlarda o'zingizga ishonchni oshirishingiz mumkin. Bu butunlay normal va ko'plab tengdoshlaringiz ham shunday.",
        strengths: [
          "O'z fikrlarini ifoda eta olish",
          "Do'stlar bilan munosabat o'rnatish",
          "Yangi narsalarni o'rganishga qiziqish",
        ],
        improvements: [
          "O'ziga ishonchni oshirish",
          "Stressli vaziyatlarda his-tuyg'ularni boshqarishni mashq qilish",
          "Yangi vaziyatlarga moslashish ko'nikmalarini rivojlantirish",
        ],
        recommendation:
          "O'zingizni qiyinroq deb hisoglagan vaziyatlarda ko'proq ishtirok eting. Har bir kichik yutuq sizning ishonchingizni mustahkamlaydi.",
      },
    };
  }

  return {
    result: "Rivojlantirish mumkin bo'lgan daraja",
    interpretation: {
      description:
        "Siz hozir o'zingizni ifoda etish va yangi vaziyatlarga moslashishda ba'zi qiyinchiliklarni boshdan kechirishingiz mumkin. Bu mutlaqo normal va har bir inson shu yo'ldan o'tadi. Muhimi — kichik qadamlar bilan oldinga intilish.",
      strengths: [
        "O'z xatolarini tan olishga tayyorlik",
        "Boshqalarning his-tuyg'ularini tushunishga harakat",
      ],
      improvements: [
        "O'z his-tuyg'ularini ifoda etish ko'nikmalarini rivojlantirish",
        "Ijtimoiy muloqotda ko'proq ishtirok etish",
        "O'ziga ishonchni bosqichma-bosqich oshirish",
        "Stressni boshqarish usullarini o'rganish",
      ],
      recommendation:
        "Kichik qadamlardan boshlang — har kuni bitta yangi narsa sinab ko'ring. Ota-onangiz, o'qituvchingiz yoki ishonchli do'stingiz bilan his-tuyg'ularingiz haqida gaplashing. Vaqt o'tishi bilan o'zingizdagi o'zgarishlarni sezishingiz mumkin.",
    },
  };
}

export function calculateAdultResult(score: number, maxScore: number): { result: string; interpretation: Interpretation } {
  // score 0 = A (Strateg-Tahlilchi), score 1 = B (Moslashuvchan Empat)
  // Low score = mostly A, high score = mostly B
  const half = maxScore / 2;

  if (score <= half) {
    return {
      result: "Strateg-Tahlilchi",
      interpretation: {
        description:
          "Siz qarorlarni his-tuyg'uga berilmay, fakt va sovuqqon tahlilga tayanib qabul qilasiz. Reja va tizim bo'yicha ishlash sizga ishonch va yuqori samaradorlik beradi.",
        strengths: [
          "Mantiq va adolat: faktlarga tayanib qaror qabul qilish",
          "Aniq tartib: reja va tizim bo'yicha ishlash",
          "Yuqori samaradorlik",
        ],
        improvements: [
          "Kutilmagan o'zgarishlarga moslashishni o'rganish",
          "Munosabatlarda hissiyotga ko'proq e'tibor berish",
        ],
        recommendation:
          "Moliya, IT va boshqaruv sohalarida o'zingizni sinab ko'ring. Tahlilchi, buxgalter, auditor, dasturchi, tizim analitiki, loyiha menejeri, yurist yoki biznes-konsultant yo'nalishlari sizga mos keladi.",
      },
    };
  }

  return {
    result: "Moslashuvchan Empat",
    interpretation: {
      description:
          "Siz insonlar ruhiyatini nozik his qilasiz va samarali muloqot o'rnatasiz. Kutilmagan vaziyatlar va shoshilinch holatlarga tez ko'nikasiz va yangi g'oyalar topasiz.",
      strengths: [
        "Empatiya va intuitsiya: insonlar ruhiyatini nozik his qilish",
        "Moslashuvchanlik: yangi vaziyatlarga tez moslashish",
        "Samarali muloqot",
      ],
      improvements: [
        "Aniq reja tuzish va intizamni mustahkamlash",
        "O'z manfaatlarini ham hisobga olishni o'rganish",
      ],
      recommendation:
        "Kreativ, media va insonlar bilan ishlash sohalarida o'zingizni sinab ko'ring. UX/UI dizayner, kopirayter, SMM-strateg, psixolog, HR-mutaxassis, murabbiy, PR-menejer yoki tadbirlar tashkilotchisi yo'nalishlari sizga mos keladi.",
    },
  };
}
