import type { Question } from "@/types";

export const childQuestions: Question[] = [
  {
    id: 1,
    text: "Yangi o'yin yoki vaziyatda men darhol qatnashishni boshlayman.",
    options: [
      { label: "A — Yo'q, men qaram turaman", score: 0 },
      { label: "B — Avval kuzataman", score: 1 },
      { label: "D — Albatta, darhol qatnashaman", score: 2 },
    ],
  },
  {
    id: 2,
    text: "Men yangi do'stlar topishni yaxshi ko'raman.",
    options: [
      { label: "A — Yo'q, mendan yomon chiqadi", score: 0 },
      { label: "B — O'rtacha", score: 1 },
      { label: "D — Ha, menga juda oson", score: 2 },
    ],
  },
  {
    id: 3,
    text: "Men boshqalarga o'z fikrimni aytishdan qo'rqmayman.",
    options: [
      { label: "A — Yo'q, uyalaman", score: 0 },
      { label: "B — Ba'zan", score: 1 },
      { label: "D — Ha, har doim aytaman", score: 2 },
    ],
  },
  {
    id: 4,
    text: "Menga yangi rasm chizish yoki o'yin o'ylash yoqadi.",
    options: [
      { label: "A — Yo'q, menga yoqmaydi", score: 0 },
      { label: "B — O'rtacha", score: 1 },
      { label: "D — Ha, juda yoqadi", score: 2 },
    ],
  },
  {
    id: 5,
    text: "Qiyin vaziyatda men o'ylab, keyin qaror qabul qilaman.",
    options: [
      { label: "A — Yo'q, shoshilaman", score: 0 },
      { label: "B — Ba'zan o'ylayman", score: 1 },
      { label: "D — Ha, doim o'ylayman", score: 2 },
    ],
  },
  {
    id: 6,
    text: "Men do'stlarim bilan janjallashganda o'zimni boshqara olaman.",
    options: [
      { label: "A — Yo'q, men xafa bo'laman", score: 0 },
      { label: "B — Ba'zan", score: 1 },
      { label: "D — Ha, men tinch turaman", score: 2 },
    ],
  },
];
