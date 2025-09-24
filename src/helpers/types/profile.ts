import type { LucideIcon } from "lucide-react";


export type TalkieStat = {
    label: string;
    value: string;
    icon: LucideIcon;
};


export type TalkieCard = {
    name: string;
    image: string;
    description: string;
    stats: TalkieStat[];
};


export type EditableProfile = {
    userName: string;
    gender: string;
    intro: string;
    relationshipPreference: string;
};