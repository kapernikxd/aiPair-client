import type { Highlight, Opening } from "@/helpers/types/ai-agent";


export const highlights: Highlight[] = [
    {
        title: "Информация о создателе",
        lines: [
            {
                label: "Ник",
                value: "@aiAgent",
                href: "https://example.com/@aiAgent",
            },
            { label: "Роль", value: "Адаптивный компаньон" },
            { label: "Создан", value: "15.02.2026 09:41" },
        ],
    },
];


export const openings: Opening[] = [
    {
        title: "Утренний перезапуск",
        description:
            "Соберитесь с мыслями благодаря 5-минутному ритуалу ясности, построенному вокруг ваших приоритетов на сегодня.",
    },
    {
        title: "Творческий прорыв",
        description: "Подберите свежие метафоры или сюжетные повороты, когда идеи заканчиваются.",
    },
    {
        title: "Репетиция сложного разговора",
        description:
            "Проиграйте трудный диалог до того, как он состоится — потренируйтесь, отпустите напряжение и найдите верные слова.",
    },
];