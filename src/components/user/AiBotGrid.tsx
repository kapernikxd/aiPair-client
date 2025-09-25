import AiBotCard from "./AiBotCard";
import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";


type AiBotGridProps = {
    items: AiBotDTO[];
    isLoading?: boolean;
};

export default function AiBotGrid({ items, isLoading }: AiBotGridProps) {
    if (isLoading) {
        return (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 text-sm text-white/60">
                Загружаем подборку AI-ботов…
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 text-sm text-white/60">
                Пока что здесь пусто — добавьте своего первого AI-бота, чтобы показать его миру.
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((bot) => (
                <AiBotCard key={bot._id} bot={bot} />
            ))}
        </div>
    );
}
