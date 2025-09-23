export type Align = 'left' | 'right';


export type ChatMessage = {
    id: string | number;
    speaker: string;
    timestamp: string; // e.g. "Now" or "6"
    content: string; // can contain \n
    align: Align;
};