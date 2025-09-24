export default function GradientBackdrop() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 -top-[20%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="absolute -right-[10%] -bottom-[10%] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>
    );
}