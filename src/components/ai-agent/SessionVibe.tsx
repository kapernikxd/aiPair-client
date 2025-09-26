type Props = {
    title?: string;
    description?: string;
}

export default function SessionVibe(props: Props) {
    if(!props.description) return;
    return (
        <div className="rounded-3xl border border-violet-500/40 bg-violet-500/10 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-200">{props.title || 'Интро'}</h3>
            <p className="mt-3 text-sm text-violet-100/80">{props.description}</p>
        </div>
    );
}