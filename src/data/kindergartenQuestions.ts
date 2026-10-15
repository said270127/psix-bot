import type { Question } from "@/types";

export const kindergartenQuestions: Question[] = [
  {
    id: 1,
    text: "Bo'sh vaqtida bolangiz ko'proq nima qiladi?",
    options: [
      { label: "A) Rasm chizish, bo'yash, plastilindan narsa yasash", score: 0 },
      { label: "B) Koptok o'ynash, yugurish, harakatli o'yinlar", score: 1 },
      { label: "C) Kitob/ertak eshitish, mantiqiy o'yinchoqlar (Lego, pazl) o'ynash", score: 2 },
    ],
  },
  {
    id: 2,
    text: "Bayramlarda yoki davralarda farzandingiz o'zini qanday tutadi?",
    options: [
      { label: "A) Raqs tushadi, qo'shiq va she'r aytib beradi", score: 0 },
      { label: "B) Boshqa bolalar bilan musobaqa va o'yinlar o'ynaydi", score: 1 },
      { label: "C) Tinchgina tomosha qiladi yoki do'stlariga yordamlashadi", score: 2 },
    ],
  },
  {
    id: 3,
    text: "Yangi narsani o'rganayotganda farzandingizga qaysi usul ma'qul?",
    options: [
      { label: "A) Ko'rib va tasavvur qilib (multfilm, rasmlar orqali)", score: 0 },
      { label: "B) O'zi ushlab, yasab va bajarib ko'rib", score: 1 },
      { label: "C) Kattalarning tushuntirishini tinglab va kuzatib", score: 2 },
    ],
  },
  {
    id: 4,
    text: "Yangi joyga yoki bog'chaga borganda bolangiz o'zini qanday tutadi?",
    options: [
      { label: "A) Tezda moslashib, hamma bilan do'stlashib ketadi (Sangvinik)", score: 0 },
      { label: "B) Avval norozilik bildirib, keyin yetakchilik qilishga urinadi (Xolerik)", score: 1 },
      { label: "C) Tinch turib atrofdagilarni kuzatib, o'rganib chiqadi (Flegmatik)", score: 2 },
      { label: "D) Biroz tortinadi, uyaladi yoki ota-onasiga yopishib oladi (Melanxolik)", score: 3 },
    ],
  },
  {
    id: 5,
    text: "Mustaqil topshiriq bajarishga munosabati qanday?",
    options: [
      { label: "A) Tez va quvnoq bajaradi, lekin keyingi ishga o'tib ketishi mumkin (Sangvinik)", score: 0 },
      { label: "B) Juda tirishib va shoshib bajaradi, tez natija xohlaydi (Xolerik)", score: 1 },
      { label: "C) Shoshmasdan, sekin, lekin odatda oxirigacha yetkazadi (Flegmatik)", score: 2 },
      { label: "D) Juda diqqat bilan va xato qilishdan qo'rqib bajaradi (Melanxolik)", score: 3 },
    ],
  },
  {
    id: 6,
    text: "Biror narsa o'xshamasa yoki \"yo'q\" deb rad etilsa reaksiyasi qanday bo'ladi?",
    options: [
      { label: "A) Tezda e'tiborini boshqa qiziqarli narsaga burib ketadi (Sangvinik)", score: 0 },
      { label: "B) Jahli chiqadi, baqiradi yoki o'z aytganini qildirishga urinadi (Xolerik)", score: 1 },
      { label: "C) Xotirjam qabul qiladi yoki indamay o'z ishi bilan mashg'ul bo'ladi (Flegmatik)", score: 2 },
      { label: "D) Arazlaydi, xafa bo'lib bir chetga o'tib oladi (Melanxolik)", score: 3 },
    ],
  },
];
