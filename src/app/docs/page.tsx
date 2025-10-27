import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileText, ShieldCheck, UserMinus, Users } from "lucide-react";
import type { JSX } from "react";

import { DOCS, type DocSlug } from "./docs.config";

const iconBySlug: Record<DocSlug, JSX.Element> = {
  "privacy-policy": <ShieldCheck className="h-6 w-6" aria-hidden="true" />,
  "terms-of-use": <FileText className="h-6 w-6" aria-hidden="true" />,
  "child-safety-standards": <Users className="h-6 w-6" aria-hidden="true" />,
  "delete-account": <UserMinus className="h-6 w-6" aria-hidden="true" />,
};

export const metadata: Metadata = {
  title: "AiPair | Документы и политики",
  description:
    "Найдите основные документы AiPair: правила использования, политику конфиденциальности и стандарты безопасности.",
};

export default function DocsLandingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#070611] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[-10%] h-72 w-72 rounded-full bg-[#6f2da8]/40 blur-3xl" />
        <div className="absolute right-[-15%] top-[25%] h-80 w-80 rounded-full bg-fuchsia-500/30 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[160px]" />
      </div>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-20 sm:px-10 lg:px-12">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-white/80">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Документы AiPair
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Всё, что нужно знать об использовании AiPair
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Ознакомьтесь с политиками сервиса, требованиями к безопасности и инструкциями по управлению аккаунтом. Мы
            собрали ключевые документы, чтобы вы всегда могли быстро найти ответы на важные вопросы.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {DOCS.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_-25px_rgba(111,45,168,0.6)] transition hover:border-[#b794f6]/40 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6f2da8]/20 text-[#c4b5fd] transition group-hover:scale-105">
                  {iconBySlug[doc.slug]}
                </div>
                <h2 className="text-xl font-semibold text-white">{doc.name}</h2>
              </div>

              <p className="mt-4 flex-1 text-base text-white/70">{doc.summary}</p>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#c4b5fd] transition group-hover:translate-x-1">
                Читать документ
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <footer className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
          Нужна дополнительная информация? Напишите нам на{' '}
          <a className="font-medium text-[#c4b5fd] underline decoration-transparent transition hover:decoration-[#c4b5fd]" href="mailto:hello@aipair.app">
            hello@aipair.app
          </a>{' '}
          — мы всегда готовы помочь.
        </footer>
      </section>
    </main>
  );
}
