export default function GradientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-[-10%] top-[-15%] h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-[-20%] top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
    </div>
  );
}
