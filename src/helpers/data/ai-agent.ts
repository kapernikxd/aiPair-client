import type { Highlight, Opening } from "@/helpers/types/ai-agent";


export const highlights: Highlight[] = [
    {
        title: "Creator Info",
        lines: [
            { label: "Handle", value: "@aiAgent" },
            { label: "Role", value: "Adaptive companion" },
            { label: "Created", value: "02/15/2026 09:41" },
        ],
    },
    {
        title: "Personality Keys",
        lines: [
            { label: "Tone", value: "Warm, incisive" },
            { label: "Specialty", value: "Strategic empathy" },
            { label: "Availability", value: "24/7" },
        ],
    },
];


export const openings: Opening[] = [
    {
        title: "Morning reset",
        description:
            "Ground yourself with a 5-minute clarity ritual crafted around today's priorities.",
    },
    {
        title: "Creative unblock",
        description: "Spin up fresh metaphors or story angles when you're feeling stuck.",
    },
    {
        title: "Tough talk rehearsal",
        description:
            "Run through the hard conversation before it happens—rehearse, refine, release.",
    },
];