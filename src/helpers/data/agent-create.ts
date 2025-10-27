import { StepDef } from "../../types/aiBot/agent-create";

export const steps: StepDef[] = [
  { title: "Идентичность", description: "Аватар, имя и первое впечатление." },
  { title: "Фокус", description: "Выберите категории и пользу, которую агент приносит." },
  { title: "Голос и история", description: "Сформируйте промпт, описание и приветствие." },
  { title: "Медиа-набор", description: "Загрузите визуальные материалы, чтобы задать настроение." },
];

export const categoryOptions = [
  "Обучение",
  "Английский",
  "Для прикола",
  "Романтический",
  "Роли",
  "История",
];

export const MAX_GALLERY_ITEMS = 6;
