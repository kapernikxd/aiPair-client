"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useTranslations } from "@/localization/TranslationProvider";

export default function TermsContent() {
  const { t, tList } = useTranslations();

  const sections = useMemo(
    () => [
      {
        title: t("legal.terms.section1.title", "1. Introduction"),
        content: (
          <p>
            {t(
              "legal.terms.section1.body",
              "These Terms of Service (\"Terms\") govern your access to and use of AiPair, the conversational AI platform provided by AiPair Inc. (\"AiPair\", \"we\", \"us\", or \"our\"). By using AiPair you agree to these Terms. If you do not agree, please refrain from using the service.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section2.title", "2. Eligibility and Accounts"),
        content: (
          <p>
            {t(
              "legal.terms.section2.body",
              "AiPair is available to users aged 13 and older. When creating an account you must provide accurate and up-to-date information. You are responsible for safeguarding your login credentials and for all activity that occurs under your account.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section3.title", "3. Acceptable Use"),
        content: (
          <ul className="list-disc space-y-2 pl-5">
            {tList("legal.terms.section3.items", [
              "Reverse engineering, scraping, or automated data extraction from the platform is prohibited.",
              "You may not share harassment, hate speech, or illegal content through AiPair or with other users.",
              "Attempts to bypass security systems or access another user's account are forbidden.",
              "Do not use AiPair to develop or distribute competing models or datasets without written consent from AiPair.",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      },
      {
        title: t("legal.terms.section4.title", "4. Intellectual Property"),
        content: (
          <p>
            {t(
              "legal.terms.section4.body",
              "AiPair retains all rights to the platform, including software, interfaces, and branding. By providing content you grant AiPair a non-exclusive, worldwide, royalty-free license to use it solely to operate and improve the service. You are responsible for the legality of the content you publish.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section5.title", "5. Subscriptions and Payments"),
        content: (
          <p>
            {t(
              "legal.terms.section5.body",
              "AiPair offers free and paid plans. Paid subscriptions renew automatically at the prevailing rate unless cancelled before the renewal date. Payments are non-refundable unless required by law. We may adjust pricing with prior notice.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section6.title", "6. Privacy"),
        content: (
          <p>
            {t("legal.terms.section6.body.beforeLink", "Our ")}
            <Link className="text-[#6f2da8] underline" href="/privacy">
              {t("legal.terms.section6.body.link", "Privacy Policy")}
            </Link>
            {t(
              "legal.terms.section6.body.afterLink",
              " describes how we collect and use data. By using AiPair you agree to this handling of information.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section7.title", "7. Disclaimers and Limitation of Liability"),
        content: (
          <p>
            {t(
              "legal.terms.section7.body",
              'AiPair is provided "as is" without warranties. We do not guarantee the accuracy, availability, or suitability of conversations. To the maximum extent permitted by law, AiPair is not liable for indirect, incidental, special, or consequential damages arising from use of the service.',
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section8.title", "8. Termination"),
        content: (
          <p>
            {t("legal.terms.section8.body.beforeEmail", "We may suspend or restrict access to AiPair if you violate the Terms or harm the service. You can delete your account at any time via settings or by emailing ")}
            <a className="text-[#6f2da8] underline" href="mailto:aipairpro@yandex.com">
              aipairpro@yandex.com
            </a>
            {t("legal.terms.section8.body.afterEmail", ".")}
          </p>
        ),
      },
      {
        title: t("legal.terms.section9.title", "9. Changes to the Terms"),
        content: (
          <p>
            {t(
              "legal.terms.section9.body",
              "AiPair may update these Terms due to changes in the service or legal requirements. For significant updates we will post a notice here and adjust the effective date. Continuing to use the service after changes take effect signifies your agreement to the updated Terms.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.terms.section10.title", "10. Contact"),
        content: (
          <p>
            {t("legal.terms.section10.body.beforeEmail", "For questions about the Terms email us at ")}
            <a className="text-[#6f2da8] underline" href="mailto:aipairpro@yandex.com">
              aipairpro@yandex.com
            </a>
            {t("legal.terms.section10.body.afterEmail", " or visit our ")}
            <Link className="text-[#6f2da8] underline" href="/contact">
              {t("legal.terms.section10.body.link", "contact page")}
            </Link>
            {t("legal.terms.section10.body.afterLink", ".")}
          </p>
        ),
      },
    ],
    [t, tList],
  );

  const year = new Date().getFullYear();
  const effectiveDate = new Date().toLocaleDateString();

  return (
    <main className="min-h-screen bg-neutral-950 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl px-6">
        <header className="mb-12 space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            {t("legal.common.category", "AiPair legal documents")}
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            {t("legal.terms.heading", "Terms of Service")}
          </h1>
          <p className="text-sm text-white/70">
            {t("legal.common.effectiveDate", "Effective date")}: {effectiveDate}
          </p>
        </header>

        <div className="space-y-8 rounded-3xl border border-white/10 bg-neutral-900/60 p-8 text-sm leading-relaxed text-white/80">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <div className="space-y-3 text-white/80">{section.content}</div>
            </section>
          ))}
        </div>

        <footer className="mt-12 text-center text-xs text-white/60">
          <p>
            © {year} AiPair. {t("legal.common.rights", "All rights reserved.")}
          </p>
        </footer>
      </div>
    </main>
  );
}

