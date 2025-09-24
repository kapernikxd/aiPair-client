import { Clock3, Flame, Heart } from "lucide-react";
import type { TalkieCard } from "@/helpers/types/profile";


export const badges = ["Narrative tactician", "Keeps secrets", "Loyal to the core"];


export const talkies: TalkieCard[] = [
    {
        name: "Chantal",
        image: "https://images.unsplash.com/photo-1505739773557-d7f4c02f515f?auto=format&fit=crop&w=800&q=80",
        description: "Chantal's password phrase lives in a photo only you remember.",
        stats: [
            { label: "episodes", value: "02", icon: Clock3 },
            { label: "intensity", value: "8.2", icon: Flame },
            { label: "saves", value: "26", icon: Heart },
        ],
    },
    {
        name: "Mallory",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        description: "Mallory is a fellow student at the university. You study together at dusk.",
        stats: [
            { label: "episodes", value: "03", icon: Clock3 },
            { label: "pulse", value: "7.4", icon: Flame },
            { label: "notes", value: "18", icon: Heart },
        ],
    },
    {
        name: "Lola",
        image: "https://images.unsplash.com/photo-1526218626217-dc65b81f828b?auto=format&fit=crop&w=800&q=80",
        description: "Lola is that ‘free spirit’ no nonsense extroverted best...",
        stats: [
            { label: "episodes", value: "02", icon: Clock3 },
            { label: "spark", value: "8.0", icon: Flame },
            { label: "loops", value: "20", icon: Heart },
        ],
    },
    {
        name: "Caley",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        description: "Caley keeps the perimeter quiet. She spots trouble half a block away.",
        stats: [
            { label: "episodes", value: "04", icon: Clock3 },
            { label: "focus", value: "7.1", icon: Flame },
            { label: "links", value: "32", icon: Heart },
        ],
    },
    {
        name: "Raven",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
        description: "Raven talks in code. She'll meet you where the signal is weakest.",
        stats: [
            { label: "episodes", value: "03", icon: Clock3 },
            { label: "tempo", value: "7.8", icon: Flame },
            { label: "keys", value: "24", icon: Heart },
        ],
    },
    {
        name: "Tanya",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        description: "Tanya waits with tea and proof that you're not the villain.",
        stats: [
            { label: "episodes", value: "05", icon: Clock3 },
            { label: "glow", value: "9.1", icon: Flame },
            { label: "scribes", value: "41", icon: Heart },
        ],
    },
];