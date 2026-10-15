import type { Question } from "@/types";

export const adultQuestions: Question[] = [
  {
    id: 1,
    text: "Yangi jamoa, tadbir yoki notanish davrada o'zingizni qanday tutasiz?",
    options: [
      { label: "A) Tezda muloqotga kirishaman, odamlarga o'zimni tanishtirib, energiya olaman.", score: 0 },
      { label: "B) Dastlab vaziyatni va odamlarni kuzataman, o'zimni qulay his qilsamgina suhbatga qo'shilaman.", score: 1 },
    ],
  },
  {
    id: 2,
    text: "Munosabatlarda noqulay vaziyat yoki ishingizda muammo yuzaga kelsa, birinchi navbatda nimaga tayanasiz?",
    options: [
      { label: "A) Asos, sovuqqon tahlil va faktlarga.", score: 0 },
      { label: "B) Tuyg'ular, insoniy munosabatlar va ichki his-tuyg'ularimga (intuitsiya).", score: 1 },
    ],
  },
  {
    id: 3,
    text: "Kutilmagan reja o'zgarishlari yoki muddatli (deadline) shoshilinch topshiriqlar bo'lganda:",
    options: [
      { label: "A) Bu meni bezovta qiladi, chunki men hammasi oldindan rejalashtirilgan tartibda bo'lishini yaxshi ko'raman.", score: 0 },
      { label: "B) Men buni tezda qabul qilaman va vaziyatga qarab tez moslashaman, shoshilinch bosim ostida yaxshiroq ishlayman.", score: 1 },
    ],
  },
  {
    id: 4,
    text: "Siz uchun yangi maqsad yoki reja ustida ishlashda qaysi biri ko'proq zavq beradi?",
    options: [
      { label: "A) Aniq reja, natijalar va haqqoniy, hayotiy tajribaga tayanib ishlash.", score: 0 },
      { label: "B) Yangi noaniq g'oyalar, kelajakda bo'lishi mumkin bo'lgan keng imkoniyatlarni tasavvur qilish.", score: 1 },
    ],
  },
  {
    id: 5,
    text: "Yaqin insoningiz bilan kelishmovchilik chiqqanda:",
    options: [
      { label: "A) Haqiqat va adolatni birinchi o'ringa qo'yib, to'g'ridan-to'g'ri muammoni hal qilaman.", score: 0 },
      { label: "B) Munosabatlarni iliq saqlab qolish uchun murosaga kelishga, yumshoqroq bo'lishga harakat qilaman.", score: 1 },
    ],
  },
  {
    id: 6,
    text: "Hayotingizdagi hozirgi bosqichda sizni eng ko'p nima ikkilantiryapti?",
    options: [
      { label: "A) O'z salohiyatim va kuchli tomonlarimdan to'liq foydalana olmayotganim.", score: 0 },
      { label: "B) Muammolarga duch kelganda hissiyot va mantiq o'rtasida to'g'ri balans topa olmasligim.", score: 1 },
    ],
  },
];
