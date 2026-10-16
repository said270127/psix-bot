import type { Question } from "@/types";

export const adultQuestions: Question[] = [
  {
    id: 1,
    text: "Yangi jamoa, tadbir yoki notanish davraga tushib qolsangiz, o'zingizni qanday tutasiz?",
    options: [
      { label: "A) Darhol o'zim birinchi bo'lib gap boshlayman va tez do'stlashib ketaman.", score: 0 },
      { label: "B) Boshida chetdan kuzataman, o'zimni qulay his qilsamgina suhbatga qo'shilaman.", score: 1 },
    ],
  },
  {
    id: 2,
    text: "Yangi reja va maqsadlar ustida ishlashda sizga qaysi biri ko'proq yoqadi?",
    options: [
      { label: "A) Aniq ketma-ketlik, real natijalar va sinovdan o'tgan tajribalarga tayanib ishlash.", score: 0 },
      { label: "B) Yangi, noodatiy g'oyalarni o'ylab topish va kelajakdagi imkoniyatlarni tasavvur qilish.", score: 1 },
    ],
  },
  {
    id: 3,
    text: "Ishingizda muammo yoki munosabatlarda noqulaylik bo'lsa, nimaga tayanib qaror qilasiz?",
    options: [
      { label: "A) Aql, mantiq va faqat aniq faktlarga.", score: 0 },
      { label: "B) Ichki sezgi (intuitsiya), hissiyotlar va insoniy munosabatlarga.", score: 1 },
    ],
  },
  {
    id: 4,
    text: "Rejalaringiz kutilmaganda buzilsa yoki shoshilinch ish chiqib qolsa:",
    options: [
      { label: "A) Bu meni bezovta qiladi, chunki hammasi oldindan rejalashtirilgan bo'lishini xohlayman.", score: 0 },
      { label: "B) Tezda yangi vaziyatga moslashaman va shoshilinch bosim ostida ham yaxshi ishlayman.", score: 1 },
    ],
  },
  {
    id: 5,
    text: "Yaqin insoningiz bilan kelishmovchilik bo'lib qolsa:",
    options: [
      { label: "A) To'g'rilik va adolatni birinchi o'ringa qo'yib, muammoni ochiqcha hal qilaman.", score: 0 },
      { label: "B) Munosabat buzilmasligi uchun biroz yon berib, murosaga kelishga harakat qilaman.", score: 1 },
    ],
  },
  {
    id: 6,
    text: "Hozirgi hayotingizda sizni eng ko'p nima o'ylantiryapti?",
    options: [
      { label: "A) O'z qobiliyatim va kuchli taraflarimdan to'liq foydalana olmayotganim.", score: 0 },
      { label: "B) Qiyinchilik paytida aql va hissiyot o'rtasida to'g'ri muvozanat topa olmasligim", score: 1 },
    ],
  },
  {
    id: 7,
    text: "O'qish yoki ishingizda sizga qaysi biri ko'proq yoqadi?",
    options: [
      { label: "A) Aniq tartib, hisob-kitob, kompyuter yoki texnika bilan ishlab natija ko'rsatish.", score: 0 },
      { label: "B) Odamlar bilan gaplashish, ularga biror narsani o'rgatish yoki yangicha ijodiy g'oyalar o'ylab topish.", score: 1 },
    ],
  },
  {
    id: 8,
    text: "Odamlar orasida yoki jamoada o'zingizni qaysi rolda ko'rasiz?",
    options: [
      { label: "A) Bosh bo'lib, hammani ortimdan ergashtirish va ishlarni boshqarish.", score: 0 },
      { label: "B) Yordamchi bo'lib, odamlarni eshitish va ularga qo'limdan kelgancha yordam berish.", score: 1 },
    ],
  },
  {
    id: 9,
    text: "Kutilmagan muammo yoki qiyin vaziyat bo'lib qolsa, birinchi ko'rsatadigan reaksiyangiz:",
    options: [
      { label: "A) Darhol harakatga tushib, vaziyatni o'z qo'lga olishga urinaman.", score: 0 },
      { label: "B) Vahima qilmay, xotirjamlik bilan bosiqlikni saqlayman va yechimini kutaman.", score: 1 },
    ],
  },
  {
    id: 10,
    text: "Kelajakda erishgan qaysi muvaffaqiyatingiz sizga eng katta quvonch beradi?",
    options: [
      { label: "A) O'z shaxsiy biznesim, yuqori daromadim va zo'r karyeram bilan tanilish.", score: 0 },
      { label: "B) Ilm-fan, san'at yoki odamlarga foydam tegishi va jamiyatda yaxshi nom qoldirish.", score: 1 },
    ],
  },
];
