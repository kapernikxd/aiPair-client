export const genderOptions = [
  { value: "MALE", label: "Мужской" },
  { value: "FEMALE", label: "Женский" },
] as const;

export const professionOptions: string[] = [
  "Выберите ваш род занятий",
  "Обучаюсь",
  "Студент",
  "Работаю",
  "Запускаю собственный проект",
] as const;


export const badges = [
    "Мастер повествований",
    "Умеет хранить секреты",
    "Безусловно предан",
];


export const initialProfile = {
    userName: "Вадим Степанов",
    gender: "MALE",
    intro: "Дизайнер AI-продуктов, исследующий границы цифровых компаньонов.",
    profession: "Выберите ваш род занятий",
};


export const genderLabels: Record<string, string> = {
    MALE: "Мужской",
    FEMALE: "Женский",
};
