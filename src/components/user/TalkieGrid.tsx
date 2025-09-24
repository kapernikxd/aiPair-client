import TalkieTile from "./TalkieTile";
import type { TalkieCard } from "@/helpers/types/profile";


export default function TalkieGrid({ items }: { items: TalkieCard[] }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((t) => (
                <TalkieTile key={t.name} talkie={t} />
            ))}
        </div>
    );
}