export default function GradientBackdrop() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-[10%] -top-[5%] h-[26rem] w-[26rem] rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -right-[15%] -bottom-[10%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
        </div>
    );
}