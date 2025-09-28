import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const GradientBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute left-1/2 top-[-10%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#6f2da8]/30 blur-3xl" />
    <div className="absolute right-[-10%] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full bg-fuchsia-400/20 blur-3xl" />
    <div className="absolute bottom-[-10%] left-[-10%] h-[22rem] w-[22rem] rounded-full bg-indigo-400/20 blur-3xl" />
  </div>
);

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-950 text-white">
      <GradientBackdrop />

      <header className="flex items-center justify-between border-b border-white/10 bg-neutral-950/70 px-6 py-4 backdrop-blur">
        <Logo />
        <Link href="/" className="inline-flex">
          <Button variant="ghostRounded" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to safety
          </Button>
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full bg-white/5 px-4 py-1 text-sm text-white/70 ring-1 ring-white/10">
          Oops! The page vanished
        </span>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
          404 — Page not found
        </h1>

        <p className="mt-4 max-w-xl text-balance text-base text-white/70 sm:text-lg">
          The link you followed may be broken, or the page might have been removed.
          Let&apos;s get you back to exploring AI companions.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex">
            <Button variant="primary" className="w-auto gap-2 px-6 py-3">
              <Home className="h-5 w-5" />
              Go home
            </Button>
          </Link>
          <Link href="/contact" className="inline-flex">
            <Button
              variant="outline"
              className="w-auto gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Contact support
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-neutral-950/80 px-6 py-6 text-center text-sm text-white/50 backdrop-blur">
        Need something else? Reach out to our team anytime.
      </footer>
    </div>
  );
}
