import { Button } from '@/components/ui/Button';

export default function SectionHeader({ title, subtitle, actionLabel }: { title: string; subtitle?: string; actionLabel?: string }) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-semibold">{title}</h2>
                {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
            </div>
            {actionLabel ? (
                <div className="hidden sm:flex">
                    <Button variant="ghostPillCompact">{actionLabel}</Button>
                </div>
            ) : null}
        </div>
    );
}